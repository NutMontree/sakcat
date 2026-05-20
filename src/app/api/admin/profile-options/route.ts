import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sakcat_db");
    const collection = db.collection("users");
    
    // Fetch unique values from the users collection
    const [positions, departments, factions] = await Promise.all([
      collection.distinct("position"),
      collection.distinct("department"),
      collection.distinct("faction")
    ]);

    return NextResponse.json({
      success: true,
      positions: (positions || []).filter(Boolean).sort(),
      departments: (departments || []).filter(Boolean).sort(),
      factions: (factions || []).filter(Boolean).sort(),
    });
  } catch (error: any) {
    console.error("Error fetching profile options:", error);
    return NextResponse.json({ success: false, error: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}
