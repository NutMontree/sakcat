import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, message: 'URL is required' }, { status: 400 });
    }

    // Extract filename from URL
    // URL format: /folder/filename.ext
    const pathParts = url.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      return NextResponse.json({ success: false, message: 'Invalid URL format' }, { status: 400 });
    }

    const folder = pathParts[0];
    const filename = pathParts.slice(1).join('/');
    const filePath = join(process.cwd(), 'public', folder, filename);

    // Check if file exists
    const { existsSync } = await import('fs');
    if (!existsSync(filePath)) {
      console.log(`⚠️ File not found for deletion: ${filePath}`);
      return NextResponse.json({ success: true, message: 'File not found (already deleted)' });
    }

    // Delete file
    await unlink(filePath);
    console.log(`✅ File deleted: ${filePath}`);

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('Delete file error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Delete failed',
      error: error.message || String(error)
    }, { status: 500 });
  }
}
