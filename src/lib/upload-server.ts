import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

/**
 * upload-server.ts: ไฟล์ตัวช่วยสำหรับบันทึกไฟล์ลงบนเครื่อง Server (ฝั่ง Server-side)
 * 
 * หน้าที่: 
 * - รับข้อมูลไฟล์ในรูปแบบ Buffer หรือ Base64
 * - บันทึกไฟล์ลงในโฟลเดอร์ public/uploads (หรือโฟลเดอร์ที่ระบุ)
 * - คืนค่าเป็น URL สำหรับเข้าถึงไฟล์ผ่าน API Media
 */

/**
 * uploadToCloudinary: อัปโหลดไฟล์ไปยัง Cloudinary ผ่าน REST API
 */
export async function uploadToCloudinary(
  fileData: string | Buffer,
  folder: string = "uploads"
): Promise<string | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxulshldj";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sakcat";

  try {
    const formData = new FormData();
    
    if (Buffer.isBuffer(fileData)) {
      const blob = new Blob([fileData]);
      formData.append("file", blob, "file");
    } else {
      formData.append("file", fileData);
    }
    
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    console.log(`☁️ Uploading to Cloudinary (auto) in folder: ${folder}...`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudinary responded with ${res.status}: ${errText}`);
    }

    const data = await res.json();
    console.log("✅ Cloudinary upload successful:", data.secure_url);
    return data.secure_url || null;
  } catch (error) {
    console.error("❌ uploadToCloudinary Error:", error);
    return null;
  }
}

/**
 * saveFileLocally: บันทึกไฟล์ลงบน Disk ของเครื่อง Server (หรือ Cloudinary)
 * @param data ข้อมูลไฟล์ (Buffer หรือ Base64 string)
 * @param folder ชื่อโฟลเดอร์ย่อยใน public
 * @param filenamePrefix คำนำหน้าชื่อไฟล์
 */
export async function saveFileLocally(
  data: string | Buffer,
  folder: string = "uploads",
  filenamePrefix: string = "file"
): Promise<string | null> {
  try {
    // พยายามอัปโหลดขึ้น Cloudinary ก่อนถ้ามีการกำหนดค่า
    if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxulshldj") {
      const cloudinaryUrl = await uploadToCloudinary(data, folder);
      if (cloudinaryUrl) {
        return cloudinaryUrl;
      }
    }

    let buffer: Buffer;
    let ext = "jpg"; // ค่าเริ่มต้นนามสกุลไฟล์

    // 1. จัดการข้อมูล Base64 (กรณีส่งมาจาก Canvas หรือ WebCam)
    if (typeof data === "string" && data.startsWith("data:image")) {
      const matches = data.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("รูปแบบ Base64 ไม่ถูกต้อง");
      }
      ext = matches[1]; // ดึงนามสกุลไฟล์ เช่น png, jpeg
      buffer = Buffer.from(matches[2], "base64");
    } 
    // 2. จัดการข้อมูลแบบ Buffer (กรณีอัปโหลดไฟล์ปกติ)
    else if (Buffer.isBuffer(data)) {
      buffer = data;
    } else {
      throw new Error("รูปแบบข้อมูลไม่รองรับ");
    }

    // 3. ตั้งชื่อไฟล์ใหม่เพื่อป้องกันการซ้ำกัน (Timestamp + Random)
    const filename = `${filenamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    
    const baseDir = join(process.cwd(), "public");
    
    const uploadDir = join(baseDir, folder);

    // 4. ตรวจสอบและสร้างโฟลเดอร์หากยังไม่มี
    await mkdir(uploadDir, { recursive: true });

    const filepath = join(uploadDir, filename);
    
    // 5. เขียนไฟล์ลงบน Disk
    await writeFile(filepath, buffer);
    console.log(`✅ Server-side file saved to: ${filepath}`);

    // คืนค่า URL ที่ชี้ไปที่ API Media ของเรา (เพื่อให้เข้าถึงไฟล์ได้ผ่าน HTTP)
    return `/api/media/${folder}/${filename}`;
  } catch (error) {
    console.error("❌ saveFileLocally Error:", error);
    return null;
  }
}

