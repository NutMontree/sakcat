"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Activity, LayoutDashboard, ExternalLink } from "lucide-react";
import NotificationBell from "../NotificationBell";

/**
 * DashboardHeader.tsx (Client Component): ส่วนหัวของหน้า Dashboard
 *
 * หน้าที่:
 * 1. แสดงชื่อหน้า (Overview) พร้อม Animation สวยงาม
 * 2. แสดงสถานะระบบ (System Live)
 * 3. แสดงการ์ดข้อมูลส่วนตัวของผู้ใช้ (User Profile Card)
 * 4. มีปุ่มทางลัดไปหน้าแก้ไขโปรไฟล์และกระดิ่งแจ้งเตือน
 */

interface DashboardHeaderProps {
  user: {
    username?: string;
    role?: string;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  // การตั้งค่า Animation สำหรับการปรากฏตัวของ Element
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1, // ให้คอมโพเนนต์ลูกค่อยๆ โผล่ตามกันมา
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // คอมเม้นท์ส่วนแสดงผลทั้งหมดเป็น null ตามความต้องการของผู้ใช้
  return null;
}
