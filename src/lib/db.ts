import { MongoClient } from "mongodb";

/**
 * db.ts: ไฟล์จัดการการเชื่อมต่อฐานข้อมูล MongoDB (Native Driver)
 *
 * หน้าที่:
 * 1. สร้าง Connection Pool ไปยัง MongoDB
 * 2. ใช้ Pattern 'Global Variable' เพื่อป้องกันการสร้าง Connection ใหม่ทุกครั้งที่มีการ Request (ช่วยประหยัดทรัพยากร)
 * 3. จัดการสร้าง Index อัตโนมัติเพื่อเพิ่มความเร็วในการค้นหาข้อมูล (Performance Optimization)
 *
 * ความเชื่อมโยง:
 * - ถูกเรียกใช้ในทุกๆ API Route ที่ต้องการดึงข้อมูลจากฐานข้อมูล
 */

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ [MongoDB] MONGODB_URI is not defined in environment variables");
  console.error(
    "Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("MONGO") || k.includes("CLOUD")),
  );
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
// ทำการเซนเซอร์รหัสผ่านใน Log เพื่อความปลอดภัย
const sanitizedUri = uri.replace(/\/\/.*@/, "//****:****@");
console.log(`🔌 [MongoDB] Target: ${sanitizedUri}`);

const options = {
  connectTimeoutMS: 30000, // กำหนดเวลารอการเชื่อมต่อสูงสุด 30 วินาที
  serverSelectionTimeoutMS: 30000,
  tlsAllowInvalidCertificates: true, // อนุญาตให้ใช้ SSL certificate ที่ไม่ถูกต้องสำหรับ development
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * ฟังก์ชันสำหรับสร้าง Index อัตโนมัติ (Database Indexing)
 * หน้าที่: เพิ่มความเร็วในการสืบค้นข้อมูลในคอลเลกชันต่างๆ
 */
async function createIndexes(promise: Promise<MongoClient>) {
  try {
    const client = await promise;
    const db = client.db("sakcat_db");

    // 1. Index สำหรับ Audit Log: เรียงลำดับตามเวลาล่าสุด (-1 คือจากใหม่ไปเก่า)
    await db.collection("logs").createIndex({ timestamp: -1 });

    // 2. Index สำหรับ Users: ค้นหา username ได้รวดเร็วและห้ามซ้ำ (unique)
    await db.collection("users").createIndex({ username: 1 }, { unique: true });

    // 3. Index สำหรับการจัดลำดับ User: ใช้ในหน้าบุคลากร
    await db.collection("users").createIndex({ orderIndex: 1 });

    // 4. Index สำหรับ Attendance: ค้นหาข้อมูลการลงเวลาได้เร็วขึ้น
    await db.collection("attendances").createIndex({ date: -1 });
    await db.collection("attendances").createIndex({ userId: 1 });

    // 5. Index สำหรับ Leave Requests: ค้นหาประวัติการลา
    await db.collection("leave_requests").createIndex({ createdAt: -1 });
    await db.collection("leave_requests").createIndex({ userId: 1 });
    await db.collection("leave_requests").createIndex({ startDate: -1 });

    // 6. Index สำหรับ Files (MongoDB Storage): ค้นหาไฟล์ได้เร็ว
    await db.collection("files").createIndex({ uploadedAt: -1 });
    await db.collection("files").createIndex({ folder: 1 });

    console.log("✅ [MongoDB] Indexes created/verified successfully");
  } catch (error) {
    console.error("❌ [MongoDB] Index creation error:", error);
  }
}

// การจัดการชื่อฐานข้อมูล (Dynamic Database Resolution)
function getDbName(uri: string): string {
  if (process.env.MONGODB_DB) {
    return process.env.MONGODB_DB;
  }
  try {
    const connectionStringWithoutProtocol = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const slashIndex = connectionStringWithoutProtocol.indexOf("/");
    if (slashIndex !== -1) {
      const pathAndQuery = connectionStringWithoutProtocol.substring(slashIndex + 1);
      const queryIndex = pathAndQuery.indexOf("?");
      const dbName = queryIndex !== -1 ? pathAndQuery.substring(0, queryIndex) : pathAndQuery;
      if (dbName) {
        return dbName;
      }
    }
  } catch (error) {
    console.error("❌ [MongoDB] Error parsing DB name from MONGODB_URI:", error);
  }
  return "sakcat_db"; // ค่าเริ่มต้น fallback
}

// การจัดการ Singleton Connection (เพื่อให้มี Connection เดียวทั้งแอป)
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  console.log("🔌 [MongoDB] Initializing new connection...");
  client = new MongoClient(uri, options);

  // Override client.db เพื่อให้ชี้ไปยัง Database ที่ระบุใน URI หรือ Env โดยไม่ต้องแก้ไขโค้ด 200 กว่าไฟล์
  const originalDb = client.db.bind(client);
  const targetDb = getDbName(uri);
  console.log(`🔌 [MongoDB] Redirecting all "sakcat_db" database calls to target: "${targetDb}"`);
  
  client.db = function (dbName?: string, options?: any) {
    if (!dbName || dbName === "sakcat_db") {
      return originalDb(targetDb, options);
    }
    return originalDb(dbName, options);
  };

  globalWithMongo._mongoClientPromise = client
    .connect()
    .then((connectedClient) => {
      console.log("✅ [MongoDB] Connected successfully");
      return connectedClient;
    })
    .catch((err) => {
      console.error("❌ [MongoDB] Connection failed:", err);
      globalWithMongo._mongoClientPromise = undefined; // รีเซ็ตเพื่อให้ลองเชื่อมต่อใหม่ได้
      throw err;
    });

  // รันการสร้าง Index ในพื้นหลังเฉพาะเมื่อไม่ใช่ Production/Serverless Environment เพื่อความเร็วและเสถียรภาพ
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    createIndexes(globalWithMongo._mongoClientPromise);
  }
}

clientPromise = globalWithMongo._mongoClientPromise;

// ส่งออก clientPromise เพื่อให้ไฟล์อื่นนำไปใช้ (เช่น await clientPromise)
export default clientPromise;
