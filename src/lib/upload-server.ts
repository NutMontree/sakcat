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
    // อัปโหลดขึ้น Cloudinary เท่านั้น (ไม่มีการเขียนไฟล์ลง Disk ท้องถิ่นของ Server)
    const cloudinaryUrl = await uploadToCloudinary(data, folder);
    if (cloudinaryUrl) {
      return cloudinaryUrl;
    }
    throw new Error("Cloudinary upload failed and local fallback is disabled.");
  } catch (error) {
    console.error("❌ saveFileLocally Error:", error);
    return null;
  }
}

