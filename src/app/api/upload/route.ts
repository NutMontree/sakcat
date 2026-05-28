import { NextResponse } from "next/server";

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

    // Folder sanitization
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

    // Upload to Cloudinary
    try {
      const cloudinaryUrl = await uploadToCloudinary(buffer, sanitizedFolder, file.name);
      if (cloudinaryUrl) {
        return NextResponse.json({
          success: true,
          secure_url: cloudinaryUrl,
          thumbnail_url: cloudinaryUrl,
          message: 'File uploaded successfully to Cloudinary'
        });
      }
      throw new Error("Cloudinary upload returned null URL.");
    } catch (cloudinaryErr: any) {
      console.error("Cloudinary upload failed:", cloudinaryErr);
      return NextResponse.json({ 
        success: false, 
        message: `Cloudinary upload failed: ${cloudinaryErr?.message || String(cloudinaryErr)}` 
      }, { status: 500 });
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

async function uploadToCloudinary(
  data: Buffer,
  folder: string,
  filename: string
): Promise<string | null> {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dmez2x7ez";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ktltc_preset";
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "238175287533225";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "shzOF6QSd2y5xFxKMOwSEhRd73c";

    // Generate timestamp and signature
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${uploadPreset}`;
    const signature = require('crypto')
      .createHmac('sha1', apiSecret)
      .update(paramsToSign)
      .digest('hex');

    // Prepare form data
    const formData = new FormData();
    formData.append('file', new Blob([data as unknown as BlobPart]), filename);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    
    if (result.secure_url) {
      console.log(`✅ File uploaded to Cloudinary: ${filename}`);
      return result.secure_url;
    }
    
    throw new Error(result.error?.message || 'Cloudinary upload failed');
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    return null;
  }
}
