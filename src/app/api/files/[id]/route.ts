import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("sakcat_db");

    const file = await db.collection("files").findOne({ _id: id });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Extract binary data from MongoDB
    const binaryData = file.data.buffer;

    // Return file with appropriate headers
    return new NextResponse(binaryData, {
      headers: {
        "Content-Type": file.mimetype || "application/octet-stream",
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("File retrieval error:", error);
    return NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 });
  }
}
