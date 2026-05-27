import clientPromise from "./db";
import { Binary } from "mongodb";
import { v4 as uuidv4 } from "uuid";

/**
 * upload-server.ts: ไฟล์ตัวช่วยสำหรับบันทึกไฟล์ (ฝั่ง Server-side)
 *
 * หน้าที่:
 * - รับข้อมูลไฟล์ในรูปแบบ Buffer หรือ Base64
 * - บันทึกไฟล์ลงใน MongoDB (เก็บเป็น Binary Data)
 * - คืนค่าเป็น URL สำหรับเข้าถึงไฟล์ผ่าน API Media
 */

/**
 * uploadToMongoDB: บันทึกไฟล์ลงใน MongoDB
 */
export async function uploadToMongoDB(
  fileData: Buffer,
  filename: string,
  folder: string = "uploads",
  mimetype: string = "application/octet-stream",
): Promise<string | null> {
  try {
    const client = await clientPromise;
    const db = client.db("sakcat_db");
    const fileId = uuidv4();

    await db.collection("files").insertOne({
      _id: fileId,
      filename,
      folder,
      mimetype,
      size: fileData.length,
      data: new Binary(fileData),
      uploadedAt: new Date(),
      url: `/api/files/${fileId}`,
    });

    console.log(`💾 File uploaded to MongoDB: ${filename} (ID: ${fileId})`);
    return `/api/files/${fileId}`;
  } catch (error) {
    console.error("❌ uploadToMongoDB Error:", error);
    return null;
  }
}

/**
 * uploadToCloudinary: อัปโหลดไฟล์ไปยัง Cloudinary ผ่าน REST API (ใช้สำหรับ compatibility เท่านั้น)
 * @deprecated ใช้ uploadToMongoDB แทน
 */
export async function uploadToCloudinary(
  fileData: string | Buffer,
  folder: string = "uploads",
): Promise<string | null> {
  console.warn("⚠️ uploadToCloudinary is deprecated. Using MongoDB storage instead.");
  const buffer = typeof fileData === "string" ? Buffer.from(fileData) : fileData;
  return uploadToMongoDB(buffer, `file-${Date.now()}`, folder);
}
