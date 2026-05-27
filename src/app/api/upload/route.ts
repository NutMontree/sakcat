import { NextResponse } from "next/server";
import { uploadToMongoDB } from "@/lib/upload-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file received." }, { status: 400 });
    }

    // Basic server-side validation
    const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES) || 500 * 1024 * 1024; // 500 MB

    const fileSize = (file as any).size || 0;
    const fileType = file.type || "application/octet-stream";

    // Folder sanitization: reject attempts to traverse out of public folder
    const rawFolder = folder || "uploads";
    if (typeof rawFolder !== "string" || rawFolder.includes("..") || rawFolder.startsWith("/")) {
      return NextResponse.json({ success: false, message: "Invalid folder" }, { status: 400 });
    }
    const sanitizedFolder = rawFolder.replace(/[^a-zA-Z0-9_\-/]/g, "");

    // Validate size
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: `File exceeds size limit (${MAX_FILE_SIZE} bytes)` },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to MongoDB
    try {
      const mongoUrl = await uploadToMongoDB(buffer, file.name, sanitizedFolder, fileType);
      if (mongoUrl) {
        return NextResponse.json({
          success: true,
          secure_url: mongoUrl,
          thumbnail_url: mongoUrl,
          message: "File uploaded successfully to MongoDB",
        });
      }
      throw new Error("MongoDB upload returned null URL.");
    } catch (mongoErr: any) {
      console.error("MongoDB upload failed:", mongoErr);
      return NextResponse.json(
        {
          success: false,
          message: `Upload failed: ${mongoErr?.message || String(mongoErr)}`,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Upload failed",
        error: error.message || String(error),
      },
      { status: 500 },
    );
  }
}
