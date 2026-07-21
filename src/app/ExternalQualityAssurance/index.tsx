"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileTextOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const ExternalQualityAssurance = () => {
  return (
    // <section className="relative py-24 overflow-hidden dark:bg-transparent bg-slate-50/50">
    <section className=" ">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-125 bg-linear-to-tr from-blue-500/10 to-cyan-500/5 rounded-full blur-3xl pointer-events-none opacity-70 dark:opacity-40" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 lg:px-20 relative z-10">
        {/* --- Header Section (Commented Out as requested) ---
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-16 text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100/50 dark:border-blue-900/30 uppercase tracking-wider mb-4">
            <CheckCircleOutlined className="text-xs" /> Accreditation & Standards
          </span>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            การรับรองมาตรฐาน
            <span className="bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent px-2">
              &
            </span>
            ความโปร่งใส
          </h2>

          <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-500 dark:text-zinc-400 font-medium">
            รายงานผลการประกันคุณภาพการศึกษาภายนอก และผลการประเมินคุณธรรมและความโปร่งใส (ITA){" "}
            <br className="hidden md:inline" />
            เพื่อการันตีการดำเนินงานด้วยหลักธรรมาภิบาลและความเป็นเลิศระดับสากล
          </p>
        </motion.div>
        --- */}

        {/* --- Content Grid (Centered for Single Card) --- */}
        <div className="max-w-2xl mx-auto">
          {/* Card 1: ประกันคุณภาพภายนอก (สมศ.) - ปิดใช้งานชั่วคราวโดยใช้เงื่อนไข false */}
          {false && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Link
                href="/pdf/งานประกันฯ/ฉบับจริงรายงานการประกันภายนอกรอบ5.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full relative"
              >
                {/* Back Card Glow effect */}
                <div className="absolute inset-0 bg-linear-to-brrom-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-3xl" />

                <article className="relative h-full flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-8 md:p-10 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-400/40 group-hover:shadow-xl group-hover:shadow-blue-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:group-hover:border-blue-500/40">
                  <div>
                    {/* Top Badge & Date */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-100/30 dark:border-blue-900/20">
                        ผ่านการรับรอง สมศ. รอบ 5
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                        ONESQA Certified
                      </span>
                    </div>

                    {/* Logo Container */}
                    <div className="relative mb-6 inline-block">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700/60 p-3 transition-transform duration-500 group-hover:scale-105 shadow-inner">
                        <Image
                          src="/images/logo/logoTH.webp"
                          className="h-full w-full object-contain"
                          alt="Logo Quality Assurance"
                          width={60}
                          height={60}
                        />
                      </div>
                      {/* Small Corner Badge */}
                      <div className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md border border-white dark:border-zinc-900 dark:bg-blue-500">
                        <FileTextOutlined className="text-xs" />
                      </div>
                    </div>

                    {/* Title & Body */}
                    <h3 className="mb-3 text-xl font-bold text-slate-800 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      รายงานการประกันคุณภาพภายนอก
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400 font-semibold mb-8">
                      รายงานสรุปผลการประเมินการประกันคุณภาพการศึกษาภายนอกด้านวิชาชีพและการจัดการเรียนรู้
                      จาก สมศ. (รอบที่ 5) เพื่อยืนยันคุณภาพมาตรฐานวิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ
                    </p>
                  </div>

                  {/* Footer Link Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                      Format: PDF Document
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:translate-x-1">
                      เปิดเอกสารฉบับจริง <ArrowRightOutlined className="text-[10px]" />
                    </span>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}

          {/* Card 2: ประเมินคุณธรรมและความโปร่งใส (ITA) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link href="/ITA" className="group block h-full relative">
              {/* Back Card Glow effect */}
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-3xl" />

              <article className="relative h-full flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-8 md:p-10 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-orange-400/40 group-hover:shadow-xl group-hover:shadow-orange-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:group-hover:border-orange-500/40">
                <div>
                  {/* Top Badge & Date */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-[10px] font-bold border border-orange-100/30 dark:border-orange-900/20">
                      ระบบประเมินคุณธรรม OIT
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                      ITA Transparency
                    </span>
                  </div>

                  {/* Title & Body */}
                  <h3 className="mb-3 text-xl font-bold text-slate-800 dark:text-white transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    การประเมินคุณธรรม (ITA)
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400 font-semibold mb-8">
                    ข้อมูลผลการประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ (OIT)
                    เพื่อส่งเสริมความโปร่งใส ตรวจสอบได้ และป้องกันการทุจริตตามนโยบายธรรมาภิบาล
                  </p>
                </div>

                {/* Footer Link Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 transition-transform duration-300 group-hover:translate-x-1">
                    เข้าสู่เว็บไซต์ OIT <ArrowRightOutlined className="text-[10px]" />
                  </span>
                </div>
              </article>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExternalQualityAssurance;
