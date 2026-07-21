"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SafetyCertificateOutlined, BookOutlined } from "@ant-design/icons";

// Helper function to check if a link is an image
const isImageUrl = (url: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].split("#")[0].toLowerCase();
  return (
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".gif") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".svg") ||
    cleanUrl.endsWith(".bmp")
  );
};

// --- Clean Header Component ---
const CleanHeader = ({ selectedYear, years, setSelectedYear }: any) => {
  return (
    <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-600 dark:bg-orange-500 text-white shadow-sm shrink-0">
            <SafetyCertificateOutlined style={{ fontSize: "20px" }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              ITA Online
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              วิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ
            </p>
          </div>
        </div>

        {/* Right: Year Selector & Home Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg border border-slate-200 dark:border-zinc-800">
            {years.map((year: string) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                  selectedYear === year
                    ? "bg-white dark:bg-zinc-800 text-orange-600 dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                ปี {year}
              </button>
            ))}
          </div>
          {/* <Link href="/dashboard/ita">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-orange-500 hover:border-orange-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer">
              จัดการ ITA
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

// --- Accordion Indicator Item Component ---
const IndicatorItem = ({
  item,
  dbItems,
  onViewImage,
}: {
  item: any;
  dbItems: any[];
  onViewImage: (url: string, name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const oitCode = `O${item.key}`;
  const dbEntry = dbItems?.find((d) => d.oitCode === oitCode);

  const hasData = useMemo(() => {
    if (!dbEntry) return false;
    const hasLinks = Array.isArray(dbEntry.links) && dbEntry.links.length > 0;

    // ตรวจสอบว่าคำอธิบายแตกต่างจากคำอธิบายแนะนำของดัชนี และไม่เป็นช่องว่างเปล่า
    const hasDesc =
      typeof dbEntry.description === "string" &&
      dbEntry.description.trim().length > 0 &&
      dbEntry.description.trim() !== item.note?.trim();
    return hasLinks || hasDesc;
  }, [dbEntry, item]);

  return (
    <div className="py-3">
      {/* Trigger bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-900/40 p-3 rounded-lg transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-zinc-800/50"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-black text-slate-700 dark:text-zinc-300">
            {item.key}
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 truncate">
            {item.title}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {hasData ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30">
              บันทึกข้อมูลแล้ว
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800">
              ไม่มีข้อมูล
            </span>
          )}
          <span className="text-slate-400 text-[10px] w-4 text-center">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-2.5 ml-0 sm:ml-10 p-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-900 rounded-lg text-slate-700 dark:text-zinc-300 text-xs md:text-sm font-medium space-y-5">
          {/* Detailed Guidelines & Responsibility (100% Matching photos) */}
          {item.guideline && (
            <div className="bg-orange-50/30 dark:bg-orange-950/10 border-l-4 border-orange-500 p-4 rounded-r-xl space-y-3">
              <div>
                <h4 className="text-[11px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1.5">
                  องค์ประกอบที่ต้องแสดง (Official Guidelines):
                </h4>
                <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed space-y-1">
                  {item.guideline.split("\n").map((line: string, idx: number) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>

              {item.responsibility && (
                <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
                    งานที่รับผิดชอบ:
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border border-teal-200/40 dark:border-teal-800/30">
                    {item.responsibility}
                  </span>
                </div>
              )}
            </div>
          )}

          {dbEntry && hasData ? (
            <>
              {dbEntry.description && (
                <div className="text-slate-700 dark:text-zinc-300 leading-relaxed border-b border-slate-200/50 dark:border-zinc-800 pb-3 font-semibold">
                  {dbEntry.description.split("\n").map((line: string, idx: number) => (
                    <p key={idx} className="mb-1">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {/* Document/Link/Image items */}
              {dbEntry.links && dbEntry.links.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    ลิงก์เอกสารอ้างอิงและหลักฐานเชิงประจักษ์:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dbEntry.links.map((link: any, idx: number) => {
                      const isImg = isImageUrl(link.url);
                      const isPdf =
                        link.url?.toLowerCase().endsWith(".pdf") ||
                        link.name?.toLowerCase().includes("pdf");

                      if (isImg) {
                        return (
                          <div
                            key={idx}
                            onClick={() => onViewImage(link.url, link.name)}
                            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3 p-2.5 hover:border-emerald-500/40 dark:hover:border-emerald-500/30"
                          >
                            <div className="relative h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-150 dark:border-zinc-800">
                              <img
                                src={link.url}
                                alt={link.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-350"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs">🔎</span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {link.name}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
                                คลิกเพื่อขยายรูปภาพ
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold hover:underline transition-all py-3 px-4 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200/80 dark:border-zinc-800 w-full hover:border-emerald-500/20 hover:shadow-xs"
                        >
                          <span className="text-sm shrink-0">{isPdf ? "📄" : "🔗"}</span>
                          <span className="truncate text-xs">{link.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic">ไม่มีการแนบลิงก์เอกสารอ้างอิง</p>
              )}
            </>
          ) : (
            <div className="text-slate-400 italic text-xs">
              {item.note || "ไม่มีการบันทึกคำชี้แจงสำหรับดัชนีชี้วัดข้อนี้"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Category Section Component ---
const CategorySection = ({
  group,
  dbItems,
  onViewImage,
}: {
  group: any;
  dbItems: any[];
  onViewImage: (url: string, name: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header bar */}
      <div className="bg-slate-50 dark:bg-zinc-800/30 px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-black text-xs">
          {group.id}
        </div>
        <div>
          <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest block">
            {group.title}
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
            {group.subtitle}
          </h3>
        </div>
      </div>

      {/* Accordion list inside */}
      <div className="p-4 divide-y divide-slate-100 dark:divide-zinc-800">
        {group.items.map((item: any) => (
          <IndicatorItem key={item.key} item={item} dbItems={dbItems} onViewImage={onViewImage} />
        ))}
      </div>
    </div>
  );
};

// --- Main ITA Component ---
export default function ITA() {
  const [selectedYear, setSelectedYear] = useState("2569");
  const [dbItems, setDbItems] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>(["2569"]);

  // Lightbox modal state
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [activeImageName, setActiveImageName] = useState<string>("");

  useEffect(() => {
    async function fetchYears() {
      try {
        const res = await fetch("/api/ita/years");
        if (res.ok) {
          const data = await res.json();
          if (data.years && data.years.length > 0) {
            setYears(data.years);
            setSelectedYear(data.years[data.years.length - 1]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch OIT years:", err);
      }
    }
    fetchYears();
  }, []);

  useEffect(() => {
    async function fetchOITData() {
      try {
        const res = await fetch(`/api/ita?year=${selectedYear}&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setDbItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch OIT data:", err);
      }
    }
    fetchOITData();
  }, [selectedYear]);

  // Topic Groups constructed based on official Vocational Education specifications
  const topicGroups = useMemo(() => {
    const yearPrefix = selectedYear;

    if (selectedYear === "2569") {
      return [
        {
          id: "9.1",
          title: `ตัวชี้วัดย่อยที่ 9.1 (${yearPrefix})`,
          subtitle: "ข้อมูลพื้นฐาน (O1 - O5)",
          items: [
            {
              key: "1",
              title: "O1 โครงสร้างและอำนาจหน้าที่",
              note: "แสดงแผนผังโครงสร้างการแบ่งส่วนราชการของสถานศึกษาและข้อมูลหน้าที่และอำนาจตามที่กฎหมายกำหนด",
              guideline:
                "1) แสดงแผนผังโครงสร้างการแบ่งส่วนราชการของสถานศึกษา แสดงตำแหน่งที่สำคัญและการแบ่งส่วนงานภายใน เช่น ฝ่าย งาน แผนกวิชา เป็นต้น\n2) แสดงข้อมูลหน้าที่และอำนาจของสถานศึกษาที่กฎหมายกำหนด เช่น คำสั่งมอบหมายหน้าที่ของสถานศึกษา ระเบียบสำนักงานคณะกรรมการการอาชีวศึกษา ว่าด้วยการบริหารสถานศึกษา เป็นต้น",
              responsibility: "งานบุคลากร/งานบริหารทั่วไป",
            },
            {
              key: "2",
              title: "O2 ข้อมูลผู้บริหารสถานศึกษา",
              note: "แสดงข้อมูลของผู้อำนวยการสถานศึกษาและรองผู้อำนวยการสถานศึกษา",
              guideline:
                "แสดงข้อมูลของผู้อำนวยการสถานศึกษาและรองผู้อำนวยการสถานศึกษา อย่างน้อยประกอบด้วย ดังนี้\n1. ชื่อ-นามสกุล\n2. ตำแหน่ง\n3. รูปถ่าย\n4. ช่องทางการติดต่อโดยตรง เช่น หมายเลขโทรศัพท์ หรือ Line หรือ E-mail เป็นต้น (อย่างน้อยหนึ่งช่องทาง)",
              responsibility: "งานประชาสัมพันธ์/งานศูนย์ข้อมูล",
            },
            {
              key: "3",
              title: "O3 แผนพัฒนาสถานศึกษา",
              note: "แสดงแผนพัฒนาสถานศึกษาที่มีระยะมากกว่า 1 ปี โดยครอบคลุมงบประมาณปัจจุบัน",
              guideline:
                "แสดงแผนพัฒนาสถานศึกษาที่มีระยะมากกว่า 1 ปี โดยครอบคลุมงบประมาณปัจจุบัน ที่มีข้อมูลรายละเอียดของแผนฯ อย่างน้อยประกอบด้วย ดังนี้\n1. ยุทธศาสตร์ หรือ แนวทาง\n2. กลยุทธ์\n3. เป้าหมาย\n4. ตัวชี้วัด",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "4",
              title: "O4 ข้อมูลการติดต่อ",
              note: "แสดงข้อมูลการติดต่อของสถานศึกษา ช่องทางสังคมออนไลน์ และพิกัดแผนที่",
              guideline:
                "แสดงข้อมูลการติดต่อของสถานศึกษา อย่างน้อยประกอบด้วย ดังนี้\n1. ที่อยู่สถานศึกษา\n2. หมายเลขโทรศัพท์ของสถานศึกษา\n3. E-mail งานสารบรรณ\n4. พิกัดที่ตั้งของสถานศึกษา (google Maps)\n5. ช่องทางการติดต่อทางเครือข่ายสังคมออนไลน์ (อย่างน้อยหนึ่งช่องทาง) เช่น Facebook, Twitter, Instagram, TikTok เป็นต้น",
              responsibility: "งานศูนย์ข้อมูล",
            },
            {
              key: "5",
              title: "O5 กฎหมายที่เกี่ยวข้อง",
              note: "แสดงกฎหมายที่เกี่ยวข้องกับการดำเนินงานหรือการปฏิบัติงานของสถานศึกษา",
              guideline:
                "แสดงกฎหมายที่เกี่ยวข้องกับการดำเนินงานหรือการปฏิบัติงานของสถานศึกษา ไม่น้อยกว่า 5 ฉบับ เช่น แผนการศึกษาแห่งชาติ ประกาศกระทรวงศึกษาธิการ การใช้มาตรฐานการอาชีวศึกษา ระดับ ปวช.และระดับ ปวส. เป็นต้น",
              responsibility: "งานบริหารทั่วไป/งานบุคลากร",
            },
          ],
        },
        {
          id: "9.2",
          title: `ตัวชี้วัดย่อยที่ 9.2 (${yearPrefix})`,
          subtitle: "การบริหารงาน ปฏิสัมพันธ์ข้อมูล และการดำเนินงาน (O6 - O9)",
          items: [
            {
              key: "6",
              title: "O6 แผนปฏิบัติราชการและแผนการใช้จ่ายงบประมาณประจำปี",
              note: "สรุปงบประมาณที่ผ่านมาและปัจจุบัน รวมถึงแผนโครงการและงบประมาณที่ใช้ในการดำเนินงาน",
              guideline:
                "1) สรุปผลการใช้จ่ายเงินปีงบประมาณที่ผ่านมา ตามแหล่งที่ได้รับการจัดสรร และประเภทรายการใช้จ่าย\n2) ประมาณการรายรับงบประมาณจากเงินรายได้ (บกศ.) ที่จะยกยอดมาในปีงบประมาณปัจจุบัน และ เงินงบประมาณที่คาดว่าจะได้รับจัดสรรในปีงบประมาณปัจจุบัน ตามแหล่งที่ได้รับการจัดสรรและประเภทรายการใช้จ่าย\n3) สรุปรายจ่ายปีงบประมาณปัจจุบัน ตามแหล่งที่ได้รับการจัดสรร และประเภทรายการใช้จ่าย\n4) รายละเอียดโครงการในปีงบประมาณปัจจุบัน โดยมีข้อมูล อย่างน้อยประกอบด้วย ดังนี้\n   1. โครงการหรือกิจกรรม\n   2. งบประมาณที่ใช้\n   3. ระยะเวลาที่ใช้ในการดำเนินการ",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "7",
              title: "O7 รายงานผลการดำเนินงานของสถานศึกษาประจำปี",
              note: "แสดงผลการดำเนินงานของสถานศึกษาประจำปี ย้อนหลัง 1 ปีงบประมาณ",
              guideline:
                "แสดงผลการดำเนินงานของสถานศึกษาประจำปี โดยมีข้อมูลรายละเอียดสรุปผลการดำเนินงานย้อนหลัง 1 ปีงบประมาณ อย่างน้อยประกอบด้วย ดังนี้\n1. ผลการดำเนินงานโครงการหรือกิจกรรม\n2. ผลการใช้จ่ายงบประมาณ\n3. ปัญหา อุปสรรค และข้อเสนอแนะหรือแนวทางการแก้ไข",
              responsibility: "งานวางแผนและงบประมาณ/ผู้รับผิดชอบโครงการ",
            },
            {
              key: "8",
              title: "O8 รายงานผลการประเมินตนเอง (SAR) ของสถานศึกษาประจำปี",
              note: "รายงานผลการขับเคลื่อนระบบประกันคุณภาพภายในสถานศึกษา ย้อนหลัง 1 ปีการศึกษา",
              guideline:
                "แสดงรายงานผลการขับเคลื่อนระบบการประกันคุณภาพภายในสถานศึกษา ย้อนหลัง 1 ปีการศึกษา อย่างน้อยประกอบด้วย รายละเอียด ดังนี้\n1. ผลการพัฒนาคุณภาพการศึกษาของสถานศึกษา (ผลสัมฤทธิ์)\n2. จุดเด่นของการขับเคลื่อนระบบการประกันคุณภาพภายในสถานศึกษา\n3. จุดที่ควรพัฒนาของการขับเคลื่อนระบบการประกันคุณภาพภายในสถานศึกษา\n4. ข้อเสนอแนะเพื่อการพัฒนาของการขับเคลื่อนระบบการประกันคุณภาพภายในสถานศึกษา",
              responsibility: "งานประกันคุณภาพ",
            },
            {
              key: "9",
              title: "O9 ข่าวประชาสัมพันธ์",
              note: "ข้อมูลข่าวสารต่าง ๆ ที่เกี่ยวข้องกับการดำเนินงานตามอำนาจหน้าที่ของสถานศึกษา",
              guideline:
                "แสดงข้อมูลข่าวสารต่าง ๆ ที่เกี่ยวข้องกับการดำเนินงานตามอำนาจหน้าที่หรือภารกิจของสถานศึกษา เป็นข้อมูลข่าวสารที่เกิดขึ้นในปีงบประมาณปัจจุบัน (อย่างน้อยหนึ่งช่องทาง)",
              responsibility: "งานศูนย์ข้อมูล/งานประชาสัมพันธ์",
            },
          ],
        },
        {
          id: "9.3",
          title: `ตัวชี้วัดย่อยที่ 9.3 (${yearPrefix})`,
          subtitle: "การจัดซื้อจัดจ้างหรือการจัดหาพัสดุ (O10 - O11)",
          items: [
            {
              key: "10",
              title: "O10 ประกาศต่างๆ เกี่ยวกับการจัดซื้อจัดจ้างหรือการจัดหาพัสดุ",
              note: "แสดงประกาศจัดซื้อจัดจ้างตาม พ.ร.บ. พัสดุฯ 2560 ในปีปัจจุบัน",
              guideline:
                "แสดงประกาศการจัดซื้อจัดจ้างตามที่สถานศึกษาจะต้องดำเนินการ ตามพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 เช่น ประกาศ เชิญชวน, ประกาศผลการจัดซื้อจัดจ้าง เป็นต้น โดยเป็นข้อมูลจัดซื้อจัดจ้างในปีงบประมาณปัจจุบัน ที่เปิดเผยข้อมูลบนเว็บไซต์หลักของสถานศึกษา",
              responsibility: "งานพัสดุ",
            },
            {
              key: "11",
              title: "O11 รายงานผลการจัดซื้อจัดจ้างหรือการจัดหาพัสดุประจำปี",
              note: "แสดงสรุปผลจัดซื้อจัดจ้างรายเดือน และ รายงานผลสรุปย้อนหลัง 1 ปีงบประมาณ",
              guideline:
                "แสดงสรุปผลการจัดซื้อจัดจ้างของสถานศึกษาที่มีข้อมูลรายละเอียดการจัดซื้อจัดจ้างตามแบบฟอร์มสถานศึกษา หรือ ตามแบบฟอร์มระบบจัดซื้อจัดจ้างภาครัฐของกรมบัญชีกลางที่เป็นข้อมูลแบบรายเดือนที่มีข้อมูลครอบคลุมแสดงสรุปผลการจัดซื้อจัดจ้างของสถานศึกษา เป็นรายงานผลย้อนหลัง 1 ปีงบประมาณ",
              responsibility: "งานพัสดุ",
            },
          ],
        },
        {
          id: "9.4",
          title: `ตัวชี้วัดย่อยที่ 9.4 (${yearPrefix})`,
          subtitle: "การปฏิบัติหน้าที่ (O12 - O15)",
          items: [
            {
              key: "12",
              title: "O12 คู่มือหรือขั้นตอนการปฏิบัติงานภายในสถานศึกษา",
              note: "คู่มือปฏิบัติงานตามโครงสร้างอย่างน้อยฝ่ายละ 1 เล่ม (จำนวน 4 เล่ม)",
              guideline:
                "แสดงคู่มือ หรือ ขั้นตอน หรือแนวทางการปฏิบัติงานตามโครงสร้างของสถานศึกษา ที่ใช้ยึดถือปฏิบัติให้เป็นมาตรฐานเดียวกัน โดยมีข้อมูลรายละเอียดของการปฏิบัติงานอย่างน้อยฝ่ายละ 1 เล่ม/ขั้นตอน/งาน (จำนวน 4 เล่ม)",
              responsibility: "งานประกันคุณภาพ",
            },
            {
              key: "13",
              title: "O13 คู่มือหรือขั้นตอนการให้บริการ",
              note: "แสดงคู่มือ/ขั้นตอนบริการประชาชน อย่างน้อย 2 คู่มือ",
              guideline:
                "แสดงคู่มือหรือขั้นตอนหรือแนวทางการให้บริการประชาชนที่มาติดต่อกับสถานศึกษา โดยมีข้อมูลรายละเอียดของการปฏิบัติงาน อย่างน้อย 2 คู่มือ/ขั้นตอน/แนวทาง ซึ่งกำหนดวิธีการขั้นตอนการให้บริการหรือการติดต่ออย่างไร ตัวอย่างเช่น คู่มือนักเรียนนักศึกษา, คู่มือการลงทะเบียนสำหรับนักเรียน นักศึกษา, คู่มือผู้ปกครองหรือนักเรียนในระบบ ศธ. O2 เป็นต้น",
              responsibility: "งานทะเบียน/งานทวิภาคี/งานแนะแนว",
            },
            {
              key: "14",
              title: "O14 E-Service",
              note: "แสดงช่องทางบริการประชาชนหรือธุรกรรมออนไลน์ผ่านเครือข่ายอินเทอร์เน็ต",
              guideline:
                "แสดงช่องทางการให้บริการข้อมูลหรือธุรกรรมภาครัฐที่สอดคล้องกับภารกิจของสถานศึกษาผ่านเครือข่ายอินเทอร์เน็ต โดยเชื่อมโยงไปยังช่องทางเว็บไซต์หลักของสถานศึกษา โดยที่ผู้ขอรับบริการไม่จำเป็นต้องเดินทางมายังสถานศึกษา เช่น ระบบ ศธ. 02 เป็นต้น",
              responsibility: "งานศูนย์ข้อมูล",
            },
            {
              key: "15",
              title: "O15 ข้อมูลเชิงสถิติและความพึงพอใจต่อการให้บริการ",
              note: "ข้อมูลสถิติและความพึงพอใจในการบริการ อย่างน้อย 3 โครงการ/กิจกรรม ย้อนหลัง 1 ปีงบประมาณ",
              guideline:
                "แสดงข้อมูลสถิติและความพึงพอใจต่อการบริการของสถานศึกษา อย่างน้อย 3 โครงการ/กิจกรรม/งาน ย้อนหลัง 1 ปีงบประมาณ",
              responsibility: "งานวิจัยและนวัตกรรม",
            },
          ],
        },
        {
          id: "9.5",
          title: `ตัวชี้วัดย่อยที่ 9.5 (${yearPrefix})`,
          subtitle: "การบริหารและพัฒนาทรัพยากรบุคคล (O16 - O17)",
          items: [
            {
              key: "16",
              title: "O16 การบริหารและพัฒนาทรัพยากรบุคคล",
              note: "หลักเกณฑ์ในการ สรรหา พัฒนา ประเมิน และสร้างขวัญกำลังใจสำหรับครูและบุคลากร",
              guideline:
                "แสดงหลักเกณฑ์การบริหารและพัฒนาทรัพยากรบุคคลที่ยังใช้บังคับในสถานศึกษา ปีงบประมาณปัจจุบัน อย่างน้อยประกอบด้วย ดังนี้\n1. การสรรหา คัดเลือก บรรจุ และแต่งตั้งบุคลากร เช่น การสรรหาและคัดเลือกพนักงานราชการ, ครูพิเศษสอน, เจ้าหน้าที่ เป็นต้น (กรณีไม่มีการสรรหา ให้ใช้การต่อสัญญา)\n2. การพัฒนาบุคลากร เช่น พัฒนาครูและบุคลากรทางการศึกษาในการจัดการเรียนรู้ เป็นต้น\n3. การประเมินผลการปฏิบัติงานบุคลากร เช่น รายงานผลการประเมินเงินเดือน เป็นต้น\n4. การสร้างขวัญกำลังใจ เช่น การขอพระราชทานเครื่องราชอิสริยาภรณ์, การแสดงความยินดีครูและบุคลากรทางการศึกษาที่ผ่านการเลื่อนวิทยฐานะที่สูงขึ้น, การเชิดชูเกียรติครูและบุคลากรดีเด่น เป็นต้น",
              responsibility: "งานบุคลากร",
            },
            {
              key: "17",
              title:
                "O17 ประมวลจริยธรรมและการขับเคลื่อนจริยธรรมของข้าราชการครูและบุคลากรทางการศึกษา",
              note: "แนวปฏิบัติ Do's & Don't และผลการฝึกอบรม/กิจกรรมสอดแทรกจริยธรรมในปีปัจจุบัน",
              guideline:
                "แสดงผลการเสริมสร้างมาตรฐานทางจริยธรรมให้แก่ครูและบุคลากรอาชีวศึกษา โดยต้องมีรายละเอียด อย่างน้อยประกอบด้วย ดังนี้\n1. แนวปฏิบัติ Do's & Don't เพื่อลดความสับสนเกี่ยวกับพฤติกรรมสีเทาและเป็นแนวทางในการประพฤติทางจริยธรรมสำหรับสถานศึกษา\n2. ผลการฝึกอบรมหรือกิจกรรมที่มีการสอดแทรกสาระด้านจริยธรรมของเจ้าหน้าที่ของรัฐ(ครูและบุคลากรอาชีวศึกษา) ในหลักสูตร หรือผลการจัดกิจกรรมส่งเสริมจริยธรรมที่ดำเนินการโดยสถานศึกษาในปีงบประมาณปัจจุบัน",
              responsibility: "งานบริหารทั่วไป",
            },
          ],
        },
        {
          id: "10.1",
          title: `ตัวชี้วัดย่อยที่ 10.1 (${yearPrefix})`,
          subtitle: "การจัดการเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ (O18 - O19)",
          items: [
            {
              key: "18",
              title: "O18 แนวปฏิบัติการจัดการเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ",
              note: "คู่มือหรือแนวการจัดการเรื่องร้องเรียน โดยระบุ วิธีการร้องเรียน ขั้นตอนจัดการ ฝ่ายรับผิดชอบ และช่องทางร้องเรียน",
              guideline:
                "แสดงคู่มือหรือแนวทางการดำเนินการต่อเรื่องร้องเรียนที่เกี่ยวข้องกับการทุจริตและประพฤติมิชอบของเจ้าหน้าที่ หรือบุคลากรทางการศึกษาในสถานศึกษา มีข้อมูลรายละเอียดของการปฏิบัติงาน อย่างน้อยประกอบด้วย ดังนี้\n1. รายละเอียดวิธีการที่บุคคลภายนอกจะทำการร้องเรียน\n2. รายละเอียดขั้นตอนหรือวิธีการในการจัดการต่อเรื่องร้องเรียน\n3. ฝ่ายงานที่รับผิดชอบ (รอง ผอ. บริหารทรัพยากร)\n4. ระยะเวลาดำเนินการ\n5. ช่องทางแจ้งเรื่องร้องเรียน",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "19",
              title: "O19 ข้อมูลเชิงสถิติเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ",
              note: "สถิติเรื่องร้องเรียนสรุปรายเดือน/ไตรมาส/6 เดือนแรกของปีงบประมาณปัจจุบัน",
              guideline:
                "แสดงข้อมูลสถิติเรื่องร้องเรียนการทุจริตและประพฤติมิชอบของเจ้าหน้าที่หรือบุคลากรทางการศึกษาของสถานศึกษา โดยมีข้อมูลความก้าวหน้าการจัดการเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ อย่างน้อยประกอบด้วย ดังนี้\n1. จำนวนเรื่องร้องเรียนทั้งหมด\n2. จำนวนเรื่องที่ดำเนินการแล้วเสร็จ\n3. จำนวนเรื่องที่อยู่ระหว่างดำเนินการ\nให้จัดทำข้อมูลเป็นแบบรายเดือน หรือรายไตรมาส หรือราย 6 เดือน ที่มีข้อมูลครอบคลุมในระยะเวลา 6 เดือนแรกของปีงบประมาณปัจจุบัน\n*กรณีไม่มีเรื่องร้องเรียนให้เผยแพร่ว่าไม่มีเรื่องร้องเรียน",
              responsibility: "งานบริหารทั่วไป",
            },
          ],
        },
        {
          id: "10.2",
          title: `ตัวชี้วัดย่อยที่ 10.2 (${yearPrefix})`,
          subtitle: "การป้องกันการทุจริต (O20 - O23)",
          items: [
            {
              key: "20",
              title: "O20 การขับเคลื่อนนโยบาย No Gift Policy",
              note: "แสดงประกาศเจตนารมณ์ No Gift Policy, กิจกรรมส่งเสริมจริยธรรม และรายงานการรับของขวัญ",
              guideline:
                "1) แสดงนโยบาย No Gift Policy ของปีงบประมาณปัจจุบัน ที่ลงนามโดยผู้บริหารสูงสุด\n2) มีกิจกรรมที่ผู้บริหารสูงสุดร่วมประกาศนโยบาย No Gift Policy หรือสร้างจริยธรรม\n3) มีรายงานการรับของขวัญและของกำนัลตามนโยบาย No Gift Policy ประจำปีงบประมาณปัจจุบัน",
              responsibility: "ผู้บริหารสูงสุด/งานบริหารทั่วไป",
            },
            {
              key: "21",
              title: "O21 การประเมินความเสี่ยงการทุจริต",
              note: "แสดงแผนและผลการดำเนินการเพื่อควบคุมความเสี่ยงการทุจริตในปีปัจจุบัน",
              guideline:
                "1) แสดงแผนการประเมินความเสี่ยงการทุจริตและประพฤติมิชอบ ประจำปีงบประมาณปัจจุบัน\n2) มีรายงานผลการดำเนินการตามมาตรการเพื่อควบคุมหรือลดความเสี่ยงการทุจริตในปีงบประมาณปัจจุบัน",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "22",
              title: "O22 แผนปฏิบัติการป้องกันการทุจริตประจำปี",
              note: "แสดงแผนปฏิบัติการและรายงานผลการดำเนินงานส่งเสริมคุณธรรมประจำปี",
              guideline:
                "1) แสดงแผนปฏิบัติการป้องกันการทุจริตและส่งเสริมคุณธรรมจริยธรรม ประจำปีงบประมาณปัจจุบัน\n2) มีรายงานผลการดำเนินงานตามแผนปฏิบัติการป้องกันการทุจริต ประจำปีงบประมาณปัจจุบัน",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "23",
              title: "O23 มาตรการส่งเสริมคุณธรรมและความโปร่งใสภายในสถานศึกษา",
              note: "มาตรการ โครงการ หรืองบประมาณส่งเสริมความซื่อสัตย์สุจริต หรือ แต่งตั้งกรรมการ ITA",
              guideline:
                "แสดงโครงการ/กิจกรรม ที่มีวัตถุประสงค์ในการส่งเสริม สนับสนุนการจัดกิจกรรมความซื่อสัตย์สุจริตและความโปร่งใสของสถานศึกษา ปีงบประมาณปัจจุบัน อย่างน้อยประกอบด้วย ดังนี้\n1. โครงการ / กิจกรรม\n2. งบประมาณ (กรณีไม่ได้ใช้งบประมาณ ให้ระบุว่า ไม่ใช้งบประมาณ)\n3. ช่วงเวลาดำเนินการ\nหรือ มีการแต่งตั้งคณะกรรมการดำเนินการ เรื่อง การประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของสถานศึกษาในปีงบประมาณปัจจุบัน (มีอย่างใดอย่างหนึ่ง)\n\nมีผลการวัดและประเมินผลกิจกรรมเสริมสร้างสุจริตจิต อาสา ระดับสถานศึกษา ครบ 4 ด้าน ย้อนหลัง 1 ปีงบประมาณ ดังนี้\nด้านที่ 1 การกระทำและการพูดความจริงไม่ลักขโมย ไม่เอาเปรียบ ไม่ฉวยโอกาส (สัตย์จริง โปร่งใส)\nด้านที่ 2 การกระทำและการพูดที่แสดงถึงการแยกแยะประโยชน์ส่วนบุคคลและประโยชน์ส่วนรวม\nด้านที่ 3 การกระทำ และการพูดที่แสดงถึงการปฏิบัติงานต่อผู้อื่นที่ไม่แตกต่างกัน (เสมอภาค ยุติธรรม)\nด้านที่ 4 การกระทำ และการพูดที่แสดงถึงการรับผิดชอบต่อตนเองและผู้อื่น การทำตามระเบียบวินัย (ความรับผิดชอบต่อหน้าที่)\n\nโดยเริ่มปีงบประมาณ พ.ศ. 2569 สามารถให้ผู้เรียนไปทำการทดสอบผ่านระบบ ITA -VEC หรือดำเนินการเองก็ได้ตามความเหมาะสม (จำนวนผู้เรียนอาชีวศึกษาแต่ละระดับชั้น ปวช. และ ปวส. ไม่น้อยกว่า 100 คน หรือจำนวนทั้งหมด)\nสำหรับสถานศึกษาที่ไม่มีผู้เรียนระดับประกาศนียบัตรวิชาชีพ (ปวช.) และระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) ต้องดำเนินกิจกรรมเสริมสร้างวัฒนธรรมองค์กรที่เกี่ยวข้องกับการป้องกันการทุจริตในรูปแบบอื่น ๆ เช่น โครงการ/กิจกรรม, แนวทางปฏิบัติ ฯลฯ",
              responsibility:
                "งานผู้สอนรายวิชากิจกรรมเสริมสร้างสุจริตจิตอาสา/ผู้เกี่ยวข้องที่ได้รับมอบหมาย",
            },
          ],
        },
      ];
    } else {
      // Default to 2568 structure (O1 to O37)
      return [
        {
          id: "9.1",
          title: `ตัวชี้วัดย่อยที่ 9.1 (${yearPrefix})`,
          subtitle: "ข้อมูลพื้นฐาน (O1 - O6)",
          items: [
            {
              key: "1",
              title: "O1 โครงสร้าง",
              note: "แสดงแผนผัง แสดงโครงสร้างการแบ่งส่วนราชการของสถานศึกษา",
              guideline: "แสดงแผนผัง แสดงโครงสร้างการแบ่งส่วนราชการของสถานศึกษา",
              responsibility: "งานบุคลากร/งานบริหารทั่วไป",
            },
            {
              key: "2",
              title: "O2 ข้อมูลผู้บริหาร",
              note: "แสดงรายนามผู้บริหาร ตำแหน่ง และรูปภาพ",
              guideline: "แสดงรายนามผู้บริหาร ตำแหน่ง และรูปภาพของคณะผู้บริหารสถานศึกษา",
              responsibility: "งานประชาสัมพันธ์/งานศูนย์ข้อมูล",
            },
            {
              key: "3",
              title: "O3 อำนาจหน้าที่",
              note: "แสดงหน้าที่และอำนาจตามกฎหมายจัดตั้ง หรือกฎหมายอื่นที่เกี่ยวข้อง",
              guideline:
                "แสดงหน้าที่และอำนาจตามกฎหมายจัดตั้ง หรือกฎหมายอื่นที่เกี่ยวข้องในการจัดตั้งสถานศึกษา",
              responsibility: "งานบริหารทั่วไป/งานบุคลากร",
            },
            {
              key: "4",
              title: "O4 แผนพัฒนาสถานศึกษา",
              note: "แสดงแผนยุทธศาสตร์ แผนพัฒนา หรือแผนปฏิบัติการของสถานศึกษา",
              guideline: "แสดงแผนยุทธศาสตร์ แผนพัฒนา หรือแผนปฏิบัติการของสถานศึกษาอย่างชัดเจน",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "5",
              title: "O5 ข้อมูลการติดต่อ",
              note: "แสดงข้อมูลการติดต่อ ที่อยู่ โทรศัพท์ และแผนที่ตั้ง",
              guideline: "แสดงข้อมูลการติดต่อ ที่อยู่ หมายเลขโทรศัพท์ โทรสาร แผนที่ตั้ง และอีเมล",
              responsibility: "งานศูนย์ข้อมูล",
            },
            {
              key: "6",
              title: "O6 กฎหมายที่เกี่ยวข้อง",
              note: "แสดงกฎหมาย พระราชบัญญัติ ระเบียบ ข้อบังคับที่เกี่ยวข้องกับการบริหารงาน",
              guideline:
                "แสดงกฎหมาย พระราชบัญญัติ ระเบียบ ข้อบังคับ หรือระเบียบการดำเนินการที่เกี่ยวข้อง",
              responsibility: "งานบริหารทั่วไป/งานบุคลากร",
            },
          ],
        },
        {
          id: "9.2",
          title: `ตัวชี้วัดย่อยที่ 9.2 (${yearPrefix})`,
          subtitle: "การบริหารงาน (O7 - O16)",
          items: [
            {
              key: "7",
              title: "O7 ข่าวประชาสัมพันธ์",
              note: "แสดงข่าวประชาสัมพันธ์ กิจกรรม และความเคลื่อนไหวล่าสุด",
              guideline:
                "แสดงข่าวประชาสัมพันธ์ กิจกรรม ข้อมูลความเคลื่อนไหว และการดำเนินงานตามภารกิจหลัก",
              responsibility: "งานศูนย์ข้อมูล/งานประชาสัมพันธ์",
            },
            {
              key: "8",
              title: "O8 Q&A",
              note: "ช่องทางสื่อสารสองทาง เช่น Web board, Messenger Live Chat",
              guideline:
                "ช่องทางที่บุคคลภายนอกสามารถสอบถามข้อมูล แลกเปลี่ยนความเห็น (เช่น Webboard หรือ Live Chat)",
              responsibility: "งานศูนย์ข้อมูล/งานประชาสัมพันธ์",
            },
            {
              key: "9",
              title: "O9 Social Network",
              note: "แสดงช่องทางเครือข่ายสังคมออนไลน์ของวิทยาลัย เช่น Facebook, YouTube",
              guideline:
                "แสดงช่องทางเครือข่ายสังคมออนไลน์หลักของวิทยาลัย เช่น Facebook, YouTube, Line",
              responsibility: "งานศูนย์ข้อมูล",
            },
            {
              key: "10",
              title: "O10 แผนดำเนินงานประจำปี",
              note: "แสดงแผนปฏิบัติราชการประจำปี และขั้นตอนดำเนินงานประจำปี",
              guideline: "แสดงแผนปฏิบัติราชการประจำปี งบประมาณ และเป้าหมายการบริหารงาน",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "11",
              title: "O11 รายงานผลการดําเนินงานประจําปี",
              note: "แสดงรายงานการประเมินตนเอง หรือผลการดำเนินงานในปีที่ผ่านมา",
              guideline:
                "แสดงรายงานการประเมินตนเอง สรุปงบประมาณ หรือผลการดำเนินงานประจำปีที่ผ่านมา",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "12",
              title: "O12 คู่มือหรือมาตรฐานการปฏิบัติงาน",
              note: "คู่มือหรือมาตรฐานการปฏิบัติงานที่เจ้าหน้าที่ใช้ยึดถือปฏิบัติ",
              guideline: "คู่มือการปฏิบัติหน้าที่ของฝ่ายบริหารและส่วนงานภายในอย่างละเอียด",
              responsibility: "งานประกันคุณภาพ",
            },
            {
              key: "13",
              title: "O13 คู่มือหรือมาตรฐานการให้บริการ",
              note: "คู่มือการให้บริการประชาชน ผู้ปกครอง หรือนักเรียนนักศึกษา",
              guideline: "คู่มือการให้บริการประชาชน ผู้ปกครอง นักเรียน หรือผู้มาขอติดต่อราชการ",
              responsibility: "งานทะเบียน/งานทวิภาคี/งานแนะแนว",
            },
            {
              key: "14",
              title: "O14 ข้อมูลเชิงสถิติการให้บริการ",
              note: "สถิติผู้มาขอรับบริการ หรือสรุปผลการให้บริการรายภาคเรียน/ปี",
              guideline:
                "สถิติจำนวนผู้มาขอรับบริการ หรือรายงานผลสรุปการรับใช้บริการอย่างเป็นรูปธรรม",
              responsibility: "งานศูนย์ข้อมูล",
            },
            {
              key: "15",
              title: "O15 รายงานผลการสํารวจความพึงพอใจ",
              note: "รายงานผลการสำรวจความพึงพอใจต่อการให้บริการของสถานศึกษา",
              guideline: "รายงานสรุปสถิติความพึงพอใจต่อการดำเนินงานและการให้บริการของบุคลากรภายใน",
              responsibility: "งานวิจัยและนวัตกรรม",
            },
            {
              key: "16",
              title: "O16 E-Service",
              note: "ช่องทางการให้บริการผ่านระบบออนไลน์ เช่น ระบบรับสมัครนักเรียน หรือระบบส่งงาน",
              guideline:
                "ช่องทางออนไลน์ หรือหน้าเว็บเพจอำนวยความสะดวกบริการประชาชนโดยไม่ต้องเข้ามาสถานศึกษา",
              responsibility: "งานศูนย์ข้อมูล",
            },
          ],
        },
        {
          id: "9.3",
          title: `ตัวชี้วัดย่อยที่ 9.3 (${yearPrefix})`,
          subtitle: "การบริหารเงินงบประมาณ (O17 - O22)",
          items: [
            {
              key: "17",
              title: "O17 แผนการใช้จ่ายงบประมาณประจําปี",
              note: "แสดงแผนการใช้จ่ายเงิน แผนงบประมาณของวิทยาลัย",
              guideline: "แสดงการวิเคราะห์งบประมาณและแผนการใช้จ่ายเงินประจำปี",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "18",
              title: "O18 ผลการใช้จ่ายงบประมาณประจําปี",
              note: "รายงานการรับ-จ่ายเงิน หรือรายงานสรุปการเงินการใช้จ่ายงบประมาณ",
              guideline:
                "รายงานการรับ-จ่ายเงิน หรือรายงานวิเคราะห์งบการเงินการใช้จ่ายงบประมาณของโครงการ",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "19",
              title: "O19 แผนการจัดซื้อจัดจ้าง/จัดหาพัสดุ",
              note: "แสดงแผนการจัดซื้อจัดจ้างประจำปีงบประมาณ",
              guideline: "แสดงรายละเอียดแผนการจัดสรรและจัดซื้อจัดจ้างประจำปีงบประมาณ",
              responsibility: "งานพัสดุ",
            },
            {
              key: "20",
              title: "O20 ประกาศต่าง ๆ เกี่ยวกับการจัดซื้อจัดจ้าง",
              note: "ประกาศประกวดราคา หรือประกาศผลการจัดซื้อจัดจ้างตามระเบียบ",
              guideline: "ประกาศผลการเปิดรับประกวดราคา ข้อเสนอราคา ผลการจัดซื้อจัดจ้างตามกฎกระทรวง",
              responsibility: "งานพัสดุ",
            },
            {
              key: "21",
              title: "O21 สรุปผลการจัดซื้อจัดจ้างรายเดือน",
              note: "รายงาน สขร.1 หรือสรุปผลการจัดซื้อจัดจ้างในแต่ละเดือน",
              guideline: "รายงานสรุปแบบ สขร.1 สำหรับผลการดำเนินงานจัดซื้อพัสดุในรายเดือน",
              responsibility: "งานพัสดุ",
            },
            {
              key: "22",
              title: "O22 รายงานผลการจัดซื้อจัดจ้างประจำปี",
              note: "รายงานผลการวิเคราะห์และสรุปผลการจัดซื้อจัดจ้างในปีงบประมาณที่ผ่านมา",
              guideline:
                "สรุปรายงานการประเมินและการวิเคราะห์ปัญหาความเสี่ยงในการจัดซื้อจัดจ้างปีงบประมาณปีก่อน",
              responsibility: "งานพัสดุ",
            },
          ],
        },
        {
          id: "9.4",
          title: `ตัวชี้วัดย่อยที่ 9.4 (${yearPrefix})`,
          subtitle: "การบริหารและพัฒนาทรัพยากรบุคคล (O23 - O25)",
          items: [
            {
              key: "23",
              title: "O23 การพัฒนาทรัพยากรบุคคล",
              note: "นโยบายการจัดหา พัฒนา และรักษาบุคลากรของวิทยาลัย",
              guideline: "นโยบายการบริหารพัฒนาส่งเสริมบุคลากรวิชาการและสายสนับสนุน",
              responsibility: "งานบุคลากร",
            },
            {
              key: "24",
              title: "O24 หลักเกณฑ์การบริหารและพัฒนา",
              note: "ระเบียบ ประกาศ หรือหลักเกณฑ์การประเมิน เลื่อนขั้น เลื่อนตำแหน่ง",
              guideline: "แสดงประกาศและรายละเอียดหลักเกณฑ์การประเมินผล การพัฒนาและเลื่อนวิทยฐานะ",
              responsibility: "งานบุคลากร",
            },
            {
              key: "25",
              title: "O25 รายงานผลการพัฒนาทรัพยากรบุคคล",
              note: "รายงานสรุปผลการดำเนินงานด้านทรัพยากรบุคคลประจำปี",
              guideline: "รายงานผลการบริหารและสรุปผลความพึงพอใจการพัฒนาสมรรถภาพของเจ้าหน้าที่",
              responsibility: "งานบุคลากร",
            },
          ],
        },
        {
          id: "9.5",
          title: `ตัวชี้วัดย่อยที่ 9.5 (${yearPrefix})`,
          subtitle: "การส่งเสริมความโปร่งใสในสถานศึกษา (O26 - O29)",
          items: [
            {
              key: "26",
              title: "O26 การจัดการร้องเรียนการทุจริต",
              note: "คู่มือหรือแนวทางปฏิบัติการแก้ไขและจัดการเรื่องร้องเรียนเมื่อพบเห็นการทุจริต",
              guideline:
                "คู่มือหรือข้อกำหนดแนวทางการจัดการเรื่องร้องเรียนกรณีพบการทุจริตประพฤติมิชอบ",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "27",
              title: "O27 ช่องทางแจ้งเรื่องร้องเรียนการทุจริต",
              note: "ระบบรับเรื่องร้องเรียนออนไลน์ หรือแบบฟอร์มส่งข้อมูลลับ",
              guideline: "ช่องทางลับหรือหน้าต่างรับแจ้งเบาะแสเรื่องการทุจริตประพฤติมิชอบออนไลน์",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "28",
              title: "O28 ข้อมูลเชิงสถิติเรื่องร้องเรียน",
              note: "รายงานสรุปสถิติจำนวนเรื่องร้องเรียนและผลการดำเนินการแต่ละข้อ",
              guideline:
                "สถิติจำนวนเรื่องร้องเรียน ข้อคิดเห็น และผลสรุปความคืบหน้าการแก้ปัญหาเรื่องทุจริต",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "29",
              title: "O29 การเปิดโอกาสให้เกิดการมีส่วนร่วม",
              note: "ภาพถ่าย หรือกิจกรรมที่เปิดโอกาสให้บุคคลภายนอกร่วมวางแผน/ตัดสินใจ",
              guideline:
                "รายงานกิจกรรมความร่วมมือและการมีส่วนร่วมของเครือข่ายหรือชุมชนภายนอกในการพัฒนา",
              responsibility: "งานบริหารทั่วไป",
            },
          ],
        },
        {
          id: "10.1",
          title: `ตัวชี้วัดย่อยที่ 10.1 (${yearPrefix})`,
          subtitle: "การดำเนินการเพื่อป้องกันทุจริต (O30 - O35)",
          items: [
            {
              key: "30",
              title: "O30 นโยบาย No Gift Policy",
              note: "ประกาศนโยบายไม่รับของขวัญและของกำนัลทุกชนิดจากการปฏิบัติหน้าที่",
              guideline: "ประกาศเจตจำนงนโยบายไม่รับของขวัญหรือผลประโยชน์อื่นใดจากการปฏิบัติหน้าที่",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "31",
              title: "O31 การมีส่วนร่วมของผู้บริหาร",
              note: "กิจกรรมที่ผู้บริหารสูงสุดร่วมประกาศนโยบาย No Gift Policy หรือสร้างจริยธรรม",
              guideline: "กิจกรรมหรือภาพถ่ายผู้บริหารสูงสุดประกาศแสดงพลังนโยบายต่อต้านทุจริต",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "32",
              title: "O32 การประเมินผลควบคุมภายใน",
              note: "รายงานวิเคราะห์และประเมินผลการดำเนินการเพื่อควบคุมหรือลดความเสี่ยงทุจริต",
              guideline:
                "การวิเคราะห์และรายงานผลการวิจัย/ประเมินผลระบบควบคุมการบริหารลดความเสี่ยงทุจริต",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "33",
              title: "O33 การเสริมสร้างวัฒนธรรมองค์กร",
              note: "โครงการ กิจกรรม หรืองานอบรมสร้างจิตสำนึกสุจริตให้บุคลากรและนักเรียน",
              guideline: "ภาพและรายงานโครงการอบรมพัฒนาจิตสำนึกจริยธรรมของข้าราชการหรือนักเรียน",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "34",
              title: "O34 โครงการป้องกันการทุจริต",
              note: "แผนงานป้องกันและส่งเสริมคุณธรรมจริยธรรมประจำปี",
              guideline:
                "แผนปฏิบัติการการป้องกันความทุจริตและยกระดับคุณธรรมจริยธรรมประจำปีงบประมาณ",
              responsibility: "งานวางแผนและงบประมาณ",
            },
            {
              key: "35",
              title: "O35 รายงานผลการป้องกันการทุจริต",
              note: "สรุปผลการดำเนินงานโครงการในแผนปฏิบัติการทุจริตที่ทำสำเร็จ",
              guideline: "รายงานสรุปความสำเร็จโครงการในแผนปฏิบัติการป้องกันทุจริตประจำปี",
              responsibility: "งานวางแผนและงบประมาณ",
            },
          ],
        },
        {
          id: "10.2",
          title: `ตัวชี้วัดย่อยที่ 10.2 (${yearPrefix})`,
          subtitle: "มาตรการภายในเพื่อป้องกันการทุจริต (O36 - O37)",
          items: [
            {
              key: "36",
              title: "O36 มาตรการส่งเสริมความโปร่งใส",
              note: "ประกาศระเบียบ หรือมาตรการเชิงบวกที่วิทยาลัยใช้กำกับการทำงาน",
              guideline:
                "มาตรการที่กำหนดกระบวนการทำงานเพื่อความโปร่งใส คุ้มครองผู้ร้องเรียน หรือการเผยแพร่ความโปร่งใส",
              responsibility: "งานบริหารทั่วไป",
            },
            {
              key: "37",
              title: "O37 การดําเนินการตามมาตรการ",
              note: "รายงานสรุปการตรวจสอบ การเปิดเผยข้อมูล หรือผลการบังคับใช้ข้อตกลงธรรมาภิบาล",
              guideline: "รายงานสรุปการตรวจประเมินตามมาตรการการป้องกันทุจริตเชิงรุกภายในสถานศึกษา",
              responsibility: "งานบริหารทั่วไป",
            },
          ],
        },
      ];
    }
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-orange-500/20 text-slate-800 dark:text-slate-200">
      <CleanHeader selectedYear={selectedYear} years={years} setSelectedYear={setSelectedYear} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Title Section */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-xs font-bold border border-orange-100 dark:border-orange-900/40 mb-4">
            <BookOutlined /> ITA Online
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            ข้อมูลการประเมินคุณธรรมและความโปร่งใส (OIT)
          </h2>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            วิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ • ประจำปีงบประมาณ {selectedYear}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-100 dark:border-zinc-700">
            <SafetyCertificateOutlined style={{ fontSize: "40px" }} />
          </div>
          <div className="grow text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              การเปิดเผยข้อมูลสาธารณะ (OIT)
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-semibold">
              วิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ
              มุ่งเน้นการดำเนินงานภายใต้หลักธรรมาภิบาลและความโปร่งใส
              ท่านสามารถเลือกปีงบประมาณและคลิกเพื่อเปิดดูรายละเอียดตัวชี้วัดความโปร่งใส
              {selectedYear === "2569" ? " (O1 - O23)" : " (O1 - O37)"}
              และเข้าถึงข้อมูลอ้างอิงอย่างเป็นทางการได้ทันที
            </p>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-6">
          {topicGroups.map((group) => (
            <CategorySection
              key={`${selectedYear}-${group.id}`}
              group={group}
              dbItems={dbItems}
              onViewImage={(url, name) => {
                setActiveImageUrl(url);
                setActiveImageName(name);
              }}
            />
          ))}
        </div>
      </div>

      {/* Premium Image Lightbox Modal Overlaying sticky navbar (z-9999) */}
      {activeImageUrl && (
        <div
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-md p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setActiveImageUrl(null)}
        >
          {/* Close button inside modal to avoid being under navbar */}
          <button
            onClick={() => setActiveImageUrl(null)}
            className="absolute top-6 right-6 z-10000 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all backdrop-blur-md border border-white/15 active:scale-95 cursor-pointer shadow-lg"
            title="ปิดรูปภาพ"
          >
            <span className="text-lg font-black leading-none w-4 h-4 flex items-center justify-center">
              ✕
            </span>
          </button>

          {/* Image Container with sizing bounds */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center p-2 animate-in zoom-in-95 duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImageUrl}
              alt={activeImageName || "Enlarged attachment"}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10 bg-zinc-900/50"
            />
            {activeImageName && (
              <p className="mt-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs md:text-sm font-bold shadow-md truncate max-w-lg">
                {activeImageName}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
