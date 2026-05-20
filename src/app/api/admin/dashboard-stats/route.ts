import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { auth } from "@/lib/auth";
import { execSync } from "child_process";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("sakcat_db");
    const userRole = (session?.user as any)?.role?.toLowerCase();

    // Check dynamic permissions
    const rolePerms = await db.collection("role_permissions").findOne({ role: userRole });
    const hasAccess = rolePerms?.permissions?.access_dashboard || userRole === "super_admin";

    if (!hasAccess) {
      // Fallback for legacy roles if role_permissions not set up
      const legacyRoles = ["admin", "editor"];
      if (!legacyRoles.includes(userRole)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    // 1. Fetch counts from MongoDB
    const [
      totalNews,
      totalNav,
      totalPages,
      totalBanners,
      totalUsers,
      totalPendingQA,
      totalDriveFiles,
      totalDriveFolders,
    ] = await Promise.all([
      db.collection("news").countDocuments(),
      db.collection("navbar").countDocuments({ parentId: null }),
      db.collection("pages").countDocuments(),
      db.collection("banners").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("questions").countDocuments({ status: "pending" }),
      db.collection("drive_files").countDocuments(),
      db.collection("drive_folders").countDocuments(),
    ]);

    // 2. Media Stats (Image Count from News + Drive)
    const [newsImageStats, driveImageCount] = await Promise.all([
      db.collection("news")
        .aggregate([
          {
            $project: {
              imageCount: {
                $add: [
                  { $cond: { if: { $isArray: "$images" }, then: { $size: "$images" }, else: 0 } },
                  { $cond: { if: { $isArray: "$announcementImages" }, then: { $size: "$announcementImages" }, else: 0 } },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$imageCount" } } },
        ])
        .toArray(),
      db.collection("drive_files").countDocuments({ type: { $regex: /^image\//i } })
    ]);

    const totalImagesCount = (newsImageStats.length > 0 ? newsImageStats[0].total : 0) + driveImageCount;

    // 3. Infrastructure Usage (MongoDB)
    let dbSizeMB = "0.00";
    try {
      const dbStats = await db.stats();
      dbSizeMB = ((dbStats.storageSize || dbStats.dataSize || 0) / (1024 * 1024)).toFixed(2);
    } catch (dbStatsErr: any) {
      console.error("Failed to get DB stats:", dbStatsErr.message);
    }
    
    // 4. Storage & DB Quotas
    let storageUsageMB = "0.00";
    let storageLimitMB = 25600; // Default fallback (25GB for Cloudinary Free Tier)
    let dbLimitMB = 512; // Default 512MB for MongoDB Atlas Free Tier
    let loadedFromCloudinary = false;

    try {
      // Fetch custom limits from database
      const [storageLimit, dbLimit] = await Promise.all([
        db.collection("site_settings").findOne({ key: "storage_limit_mb" }),
        db.collection("site_settings").findOne({ key: "db_limit_mb" })
      ]);

      if (storageLimit) {
        storageLimitMB = parseFloat(storageLimit.value);
        if (isNaN(storageLimitMB)) storageLimitMB = 25600;
      } else {
        storageLimitMB = 25600;
      }

      if (dbLimit) {
        dbLimitMB = parseFloat(dbLimit.value);
        if (isNaN(dbLimitMB)) dbLimitMB = 512;
      } else {
        dbLimitMB = 512;
      }

      // Fetch Cloudinary usage directly from API
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        try {
          const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
            headers: {
              Authorization: `Basic ${authHeader}`,
            },
            next: { revalidate: 60 } // cache for 1 minute
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.storage) {
              storageUsageMB = (data.storage.usage / (1024 * 1024)).toFixed(2);
              
              const fetchedLimit = Math.round(data.storage.limit / (1024 * 1024));
              if (fetchedLimit > 0) {
                storageLimitMB = fetchedLimit;
              } else {
                console.log(`☁️ Cloudinary returned 0 limit (Credit Plan). Keeping resolved limit: ${storageLimitMB} MB`);
              }
              loadedFromCloudinary = true;
              console.log(`☁️ Cloudinary stats loaded successfully: ${storageUsageMB} MB / ${storageLimitMB} MB`);
            }
          } else {
            console.warn("Cloudinary usage API status:", res.status);
          }
        } catch (cloudinaryErr: any) {
          console.error("Cloudinary usage API error:", cloudinaryErr.message);
        }
      }

      // If Cloudinary failed or was not configured, fallback to measuring local folders
      if (!loadedFromCloudinary) {
        const fs = require("fs");
        const foldersToMeasure = ["uploads", "images", "pdf", "sakcat_drive", "attendance_photos"];
        let totalBytes = 0;

        const getDirSize = (dirPath: string) => {
          let size = 0;
          try {
            if (!fs.existsSync(dirPath)) {
              return 0;
            }
            const files = fs.readdirSync(dirPath);
            for (let i = 0; i < files.length; i++) {
              const filePath = path.join(dirPath, files[i]);
              const stats = fs.statSync(filePath);
              if (stats.isDirectory()) {
                size += getDirSize(filePath);
              } else {
                size += stats.size;
              }
            }
          } catch (e: any) {
            console.error(`Error reading ${dirPath}:`, e.message);
          }
          return size;
        };

        foldersToMeasure.forEach((folder) => {
          const folderPath = path.join(process.cwd(), "public", folder);
          const folderSize = getDirSize(folderPath);
          totalBytes += folderSize;
        });
        
        storageUsageMB = (totalBytes / (1024 * 1024)).toFixed(2);
      }
    } catch (err) {
      console.error("General Stats Calculation Error:", err);
    }

    return NextResponse.json({
      totalNews,
      totalNav,
      totalPages,
      totalBanners,
      totalImagesCount,
      totalDriveFiles,
      totalDriveFolders,
      dbSizeMB,
      dbLimitMB: dbLimitMB,
      cloudUsageMB: storageUsageMB, // Keeping same key for frontend compatibility
      cloudLimitMB: storageLimitMB,
      totalPendingQA,
      totalUsers,
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
