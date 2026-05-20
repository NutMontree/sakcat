import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Dynamic import เพื่อไม่ให้ Vercel bundle fs เข้าไปใน client chunk
    const { writeFile, mkdir } = await import('fs/promises');
    const { join } = await import('path');

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file received.' }, { status: 400 });
    }

    // Basic server-side validation
    // Read limits from environment variables (bytes). Fallback to sensible defaults.
    const MAX_IMAGE_SIZE = Number(process.env.MAX_IMAGE_SIZE_BYTES) || 10 * 1024 * 1024; // 10 MB
    const MAX_VIDEO_SIZE = Number(process.env.MAX_VIDEO_SIZE_BYTES) || 200 * 1024 * 1024; // 200 MB
    const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_BYTES) || 500 * 1024 * 1024; // 500 MB for other files

    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];

    const fileSize = (file as any).size || 0;
    const fileType = file.type || 'application/octet-stream';

    // Folder sanitization: reject attempts to traverse out of public folder
    const rawFolder = folder || 'uploads';
    if (typeof rawFolder !== 'string' || rawFolder.includes('..') || rawFolder.startsWith('/')) {
      return NextResponse.json({ success: false, message: 'Invalid folder' }, { status: 400 });
    }
    const sanitizedFolder = rawFolder.replace(/[^a-zA-Z0-9_\-/]/g, '');

    // Validate size only (Allow everything else)
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: `File exceeds size limit (${MAX_FILE_SIZE} bytes)` }, { status: 413 });
    }

    const isImage = fileType.startsWith('image/');
    const isVideo = fileType.startsWith('video/');

    const buffer = Buffer.from(await file.arrayBuffer());

    // Try uploading to Cloudinary first if configured
    if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dxulshldj") {
      try {
        const { uploadToCloudinary } = await import("@/lib/upload-server");
        const cloudinaryUrl = await uploadToCloudinary(buffer, sanitizedFolder);
        if (cloudinaryUrl) {
          return NextResponse.json({ 
            success: true, 
            secure_url: cloudinaryUrl,
            thumbnail_url: cloudinaryUrl,
            message: 'File uploaded successfully' 
          });
        }
        throw new Error("Cloudinary returned a null URL.");
      } catch (cloudinaryErr: any) {
        console.error("Cloudinary upload failed:", cloudinaryErr);
        return NextResponse.json({ 
          success: false, 
          message: `Cloudinary upload failed: ${cloudinaryErr?.message || String(cloudinaryErr)}` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Cloudinary configuration is missing and local fallback is disabled.' 
    }, { status: 500 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Upload failed',
      error: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}
