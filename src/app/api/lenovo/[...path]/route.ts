import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("API Deprecated: Network storage has been migrated to Cloudinary.", { status: 410 });
}
