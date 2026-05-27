import { unlink } from "fs/promises";
import { join } from "path";
import clientPromise from "./db";

/**
 * file-utils.ts: ไฟล์ตัวช่วยสำหรับจัดการไฟล์บนระบบ (File System + MongoDB)
 *
 * หน้าที่:
 * - ลบไฟล์ออกจากระบบ (MongoDB หรือ Local Filesystem)
 * - ตรวจสอบความปลอดภัยเพื่อป้องกันการลบไฟล์นอกขอบเขตที่อนุญาต
 */

/**
 * deleteFileFromUrl: ลบไฟล์ออกจากระบบโดยใช้ URL ที่ได้มาจาก API Media
 *
 * รูปแบบ URL ที่รองรับ:
 * - /api/files/[fileId] - ไฟล์จาก MongoDB
 * - /api/media/folder/subfolder/filename.ext - ไฟล์จาก Local Filesystem (legacy)
 */
export async function deleteFileFromUrl(url: string): Promise<boolean> {
  if (!url) {
    return false;
  }

  // ✅ Delete from MongoDB
  if (url.startsWith("/api/files/")) {
    try {
      const fileId = url.replace("/api/files/", "");
      const client = await clientPromise;
      const db = client.db("sakcat_db");
      const result = await db.collection("files").deleteOne({ _id: fileId });
      return result.deletedCount > 0;
    } catch (error: any) {
      console.error(`Error deleting file from MongoDB: ${url}`, error);
      return false;
    }
  }

  // ✅ Delete from Local Filesystem (legacy)
  if (url.startsWith("/api/media/")) {
    try {
      const relativePath = url.replace("/api/media/", "");
      const parts = relativePath.split("/");

      const filePath = join(process.cwd(), "public", ...parts);

      // Security Check
      const allowedPrefix = join(process.cwd(), "public").toLowerCase();
      const normalizedPath = filePath.toLowerCase();
      const isAllowed = normalizedPath.startsWith(allowedPrefix);

      if (!isAllowed) {
        console.warn(
          `Security warning: Attempted to delete file outside allowed directories: ${filePath}`,
        );
        return false;
      }

      await unlink(filePath);
      return true;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return true;
      }
      console.error(`Error deleting file: ${url}`, error);
      return false;
    }
  }

  return false;
}
