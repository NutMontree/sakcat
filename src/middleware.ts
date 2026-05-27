import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * middleware.ts: ไฟล์ที่เป็น Middleware ของระบบตรวจสอบสิทธิ์และกรองเส้นทาง (Next.js Middleware)
 * 
 * หน้าที่: 
 * 1. ตรวจสอบ Session ของผู้ใช้ในทุกการเข้าถึง (Request) ตามเส้นทางที่ระบุใน matcher
 * 2. ดักและทำหน้าที่เป็น Reverse Proxy ส่งผ่านข้อมูล API ไปยังเครื่อง Server Local (ผ่าน Cloudflare Tunnel)
 *    เพื่อหลีกเลี่ยงข้อจำกัดการเชื่อมต่อฐานข้อมูลโดยตรงของ Vercel
 */

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1. API Proxy: ส่งต่อ /api/... (ยกเว้นระบบล็อคอิน /api/auth) ไปหาเครื่องเซิร์ฟเวอร์หลักผ่าน Cloudflare Tunnel
  const apiTarget = process.env.NEXT_PUBLIC_API_URL;
  if (apiTarget && pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const targetUrl = new URL(apiTarget + pathname + search);
    return NextResponse.rewrite(targetUrl);
  }

  // 2. NextAuth Auth: ระบบดักกรองสิทธิ์และประมวลผล Session เดิมสำหรับเส้นทางอื่น ๆ
  return auth(req as any);
}

export const config = {
  // ทำงานทุกเส้นทางยกเว้น _next/static, _next/image, images, และ favicon.ico
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};

