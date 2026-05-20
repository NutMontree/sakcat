import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      mongodb_uri_censored: process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.replace(/\/\/.*@/, "//****:****@")
        : null,
      node_env: process.env.NODE_ENV,
      vercel_env: process.env.VERCEL_ENV || "not-vercel",
    },
    dns_check: {},
    connection_test: {}
  };

  if (process.env.MONGODB_URI) {
    try {
      const url = new URL(process.env.MONGODB_URI);
      diagnostics.dns_check.host = url.hostname;
    } catch (e: any) {
      diagnostics.dns_check.error = "Invalid URI format: " + e.message;
    }

    try {
      console.log("[DEBUG-ENV] Testing direct connection to MongoDB...");
      const client = new MongoClient(process.env.MONGODB_URI, {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      });
      
      const startTime = Date.now();
      await client.connect();
      diagnostics.connection_test.status = "SUCCESS";
      diagnostics.connection_test.time_ms = Date.now() - startTime;
      
      const db = client.db("sakcat_db");
      const collections = await db.listCollections().toArray();
      diagnostics.connection_test.collections = collections.map(c => c.name);
      
      await client.close();
    } catch (err: any) {
      diagnostics.connection_test.status = "FAILED";
      diagnostics.connection_test.error = err.message || String(err);
      diagnostics.connection_test.code = err.code;
      diagnostics.connection_test.stack = err.stack;
    }
  } else {
    diagnostics.connection_test.status = "NO_URI";
  }

  return NextResponse.json(diagnostics);
}
