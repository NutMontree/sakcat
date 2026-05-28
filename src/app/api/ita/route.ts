import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET: ดึงข้อมูล ITA ทั้งหมดของปีที่กำหนด
 * Query Parameter: ?year=2568 หรือ ?year=2569
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || "2568";

    const client = await clientPromise;
    const db = client.db("sakcat_db");

    // Create index if not exists for better query performance
    await db.collection("ita_items").createIndex({ year: 1, oitCode: 1 }, { unique: true });

    // ดึงข้อมูล OIT ทั้งหมดของปีที่เลือก with projection to reduce data transfer
    const items = await db
      .collection("ita_items")
      .find({ year: year })
      .project({ _id: 0, year: 1, oitCode: 1, title: 1, description: 1, links: 1, updatedAt: 1 })
      .toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET ITA Items Error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูล ITA ได้" },
      { status: 500 }
    );
  }
}

/**
 * POST: บันทึกหรืออัปเดตข้อมูล ITA รายหัวข้อ (O1 - O37)
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    const client = await clientPromise;
    const db = client.db("sakcat_db");

    const body = await req.json();
    const { year, oitCode, title, description, links, action } = body;

    if (!year || !oitCode) {
      return NextResponse.json(
        { error: "กรุณาระบุปีงบประมาณและรหัสหัวข้อ OIT (เช่น O1)" },
        { status: 400 }
      );
    }

    // หากเป็นการขอเช็ดล้างข้อมูล (Delete)
    if (action === "delete") {
      const deleteResult = await db.collection("ita_items").deleteOne({ year: year, oitCode: oitCode });
      return NextResponse.json({
        success: true,
        message: `ลบข้อมูล ${oitCode} สำเร็จเรียบร้อยแล้ว`,
        deleteResult,
      });
    }

    // บันทึกหรืออัปเดตข้อมูล (Upsert) โดยค้นหาจาก year และ oitCode
    const result = await db.collection("ita_items").updateOne(
      { year: year, oitCode: oitCode },
      {
        $set: {
          title: title || "",
          description: description || "",
          links: Array.isArray(links) ? links : [],
          updatedAt: new Date(),
          updatedBy: session?.user?.name || (session?.user as any)?.username || "Guest User",
        },
      },
      { upsert: true, writeConcern: { w: 1, j: false } } // Faster writes without journaling
    );

    return NextResponse.json({
      success: true,
      message: `บันทึกข้อมูล ${oitCode} เรียบร้อยแล้ว`,
      result,
    });
  } catch (error) {
    console.error("POST ITA Item Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล ITA" },
      { status: 500 }
    );
  }
}
