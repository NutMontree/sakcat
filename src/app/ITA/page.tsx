"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  SafetyCertificateOutlined,
  CalendarOutlined,
  BookOutlined,
  HomeOutlined,
} from "@ant-design/icons";

// --- Styled Components & Assets ---
const CleanHeader = ({ selectedYear, years, setSelectedYear }: any) => {
  return (
    <div className="bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
            <SafetyCertificateOutlined style={{ fontSize: "20px" }} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              ITA Online Portal
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
                className={`px-4 py-1.5 rounded-md text-xs font-black transition-all ${
                  selectedYear === year
                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-white shadow-xs border border-slate-200/80 dark:border-zinc-700"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                ปี {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const IndicatorItem = ({ item, dbItems }: { item: any; dbItems: any[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const oitCode = `O${item.key}`;
  const dbEntry = dbItems?.find((d) => d.oitCode === oitCode);

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
          {dbEntry ? (
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
        <div className="mt-2.5 ml-10 p-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-900 rounded-lg text-slate-700 dark:text-zinc-300 text-xs md:text-sm font-medium space-y-4">
          {dbEntry ? (
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

              {/* Document/Link items */}
              {dbEntry.links && dbEntry.links.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    ลิงก์เอกสารอ้างอิงและหลักฐานเชิงประจักษ์:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {dbEntry.links.map((link: any, idx: number) => {
                      const isPdf =
                        link.url?.toLowerCase().endsWith(".pdf") ||
                        link.name?.toLowerCase().includes("pdf");
                      return (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold hover:underline transition-all py-1.5 px-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200/60 dark:border-zinc-800 w-fit"
                        >
                          <span>{isPdf ? "📄" : "🔗"}</span>
                          <span>{link.name}</span>
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

const CategorySection = ({ group, dbItems }: { group: any; dbItems: any[] }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Header bar */}
      <div className="bg-slate-50 dark:bg-zinc-800/30 px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
          {group.id}
        </div>
        <div>
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
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
          <IndicatorItem key={item.key} item={item} dbItems={dbItems} />
        ))}
      </div>
    </div>
  );
};

export default function ITA() {
  const [selectedYear, setSelectedYear] = useState("2569");
  const [dbItems, setDbItems] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>(["2569"]);

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

  const topicGroups = useMemo(() => {
    const yearPrefix = selectedYear;
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
          },
          { key: "2", title: "O2 ข้อมูลผู้บริหาร", note: "แสดงรายนามผู้บริหาร ตำแหน่ง และรูปภาพ" },
          {
            key: "3",
            title: "O3 อำนาจหน้าที่",
            note: "แสดงหน้าที่และอำนาจตามกฎหมายจัดตั้ง หรือกฎหมายอื่นที่เกี่ยวข้อง",
          },
          {
            key: "4",
            title: "O4 แผนพัฒนาสถานศึกษา",
            note: "แสดงแผนยุทธศาสตร์ แผนพัฒนา หรือแผนปฏิบัติการของสถานศึกษา",
          },
          {
            key: "5",
            title: "O5 ข้อมูลการติดต่อ",
            note: "แสดงข้อมูลการติดต่อ ที่อยู่ โทรศัพท์ และแผนที่ตั้ง",
          },
          {
            key: "6",
            title: "O6 กฎหมายที่เกี่ยวข้อง",
            note: "แสดงกฎหมาย พระราชบัญญัติ ระเบียบ ข้อบังคับที่เกี่ยวข้องกับการบริหารงาน",
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
          },
          {
            key: "8",
            title: "O8 Q&A",
            note: "ช่องทางสื่อสารสองทาง เช่น Web board, Messenger Live Chat",
          },
          {
            key: "9",
            title: "O9 Social Network",
            note: "แสดงช่องทางเครือข่ายสังคมออนไลน์ของวิทยาลัย เช่น Facebook, YouTube",
          },
          {
            key: "10",
            title: "O10 แผนดำเนินงานประจำปี",
            note: "แสดงแผนปฏิบัติราชการประจำปี และขั้นตอนดำเนินงานประจำปี",
          },
          {
            key: "11",
            title: "O11 รายงานผลการดําเนินงานประจําปี",
            note: "แสดงรายงานการประเมินตนเอง หรือผลการดำเนินงานในปีที่ผ่านมา",
          },
          {
            key: "12",
            title: "O12 คู่มือหรือมาตรฐานการปฏิบัติงาน",
            note: "คู่มือหรือมาตรฐานการปฏิบัติงานที่เจ้าหน้าที่ใช้ยึดถือปฏิบัติ",
          },
          {
            key: "13",
            title: "O13 คู่มือหรือมาตรฐานการให้บริการ",
            note: "คู่มือการให้บริการประชาชน ผู้ปกครอง หรือนักเรียนนักศึกษา",
          },
          {
            key: "14",
            title: "O14 ข้อมูลเชิงสถิติการให้บริการ",
            note: "สถิติผู้มาขอรับบริการ หรือสรุปผลการให้บริการรายภาคเรียน/ปี",
          },
          {
            key: "15",
            title: "O15 รายงานผลการสํารวจความพึงพอใจ",
            note: "รายงานผลการสำรวจความพึงพอใจต่อการให้บริการของสถานศึกษา",
          },
          {
            key: "16",
            title: "O16 E-Service",
            note: "ช่องทางการให้บริการผ่านระบบออนไลน์ เช่น ระบบรับสมัครนักเรียน หรือระบบส่งงาน",
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
          },
          {
            key: "18",
            title: "O18 ผลการใช้จ่ายงบประมาณประจําปี",
            note: "รายงานการรับ-จ่ายเงิน หรือรายงานสรุปการเงินการใช้จ่ายงบประมาณ",
          },
          {
            key: "19",
            title: "O19 แผนการจัดซื้อจัดจ้าง/จัดหาพัสดุ",
            note: "แสดงแผนการจัดซื้อจัดจ้างประจำปีงบประมาณ",
          },
          {
            key: "20",
            title: "O20 ประกาศต่าง ๆ เกี่ยวกับการจัดซื้อจัดจ้าง",
            note: "ประกาศประกวดราคา หรือประกาศผลการจัดซื้อจัดจ้างตามระเบียบ",
          },
          {
            key: "21",
            title: "O21 สรุปผลการจัดซื้อจัดจ้างรายเดือน",
            note: "รายงาน สขร.1 หรือสรุปผลการจัดซื้อจัดจ้างในแต่ละเดือน",
          },
          {
            key: "22",
            title: "O22 แผนการจัดซื้อจัดจ้าง/จัดหาพัสดุ",
            note: "รายงานผลการวิเคราะห์และสรุปผลการจัดซื้อจัดจ้างในปีงบประมาณที่ผ่านมา",
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
          },
          {
            key: "24",
            title: "O24 หลักเกณฑ์การบริหารและพัฒนา",
            note: "ระเบียบ ประกาศ หรือหลักเกณฑ์การประเมิน เลื่อนขั้น เลื่อนตำแหน่ง",
          },
          {
            key: "25",
            title: "O25 รายงานผลการพัฒนาทรัพยากรบุคคล",
            note: "รายงานสรุปผลการดำเนินงานด้านทรัพยากรบุคคลประจำปี",
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
          },
          {
            key: "27",
            title: "O27 ช่องทางแจ้งเรื่องร้องเรียนการทุจริต",
            note: "ระบบรับเรื่องร้องเรียนออนไลน์ หรือแบบฟอร์มส่งข้อมูลลับ",
          },
          {
            key: "28",
            title: "O28 ข้อมูลเชิงสถิติเรื่องร้องเรียน",
            note: "รายงานสรุปสถิติจำนวนเรื่องร้องเรียนและผลการดำเนินการแต่ละข้อ",
          },
          {
            key: "29",
            title: "O29 การเปิดโอกาสให้เกิดการมีส่วนร่วม",
            note: "ภาพถ่าย หรือกิจกรรมที่เปิดโอกาสให้บุคคลภายนอกร่วมวางแผน/ตัดสินใจ",
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
          },
          {
            key: "31",
            title: "O31 การมีส่วนร่วมของผู้บริหาร",
            note: "กิจกรรมที่ผู้บริหารสูงสุดร่วมประกาศนโยบาย No Gift Policy หรือสร้างจริยธรรม",
          },
          {
            key: "32",
            title: "O32 การประเมินผลควบคุมภายใน",
            note: "รายงานวิเคราะห์และประเมินผลการดำเนินการเพื่อควบคุมหรือลดความเสี่ยงทุจริต",
          },
          {
            key: "33",
            title: "O33 การเสริมสร้างวัฒนธรรมองค์กร",
            note: "โครงการ กิจกรรม หรืองานอบรมสร้างจิตสำนึกสุจริตให้บุคลากรและนักเรียน",
          },
          {
            key: "34",
            title: "O34 โครงการป้องกันการทุจริต",
            note: "แผนงานป้องกันและส่งเสริมคุณธรรมจริยธรรมประจำปี",
          },
          {
            key: "35",
            title: "O35 รายงานผลการป้องกันการทุจริต",
            note: "สรุปผลการดำเนินงานโครงการในแผนปฏิบัติการทุจริตที่ทำสำเร็จ",
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
          },
          {
            key: "37",
            title: "O37 การดําเนินการตามมาตรการ",
            note: "รายงานสรุปการตรวจสอบ การเปิดเผยข้อมูล หรือผลการบังคับใช้ข้อตกลงธรรมาภิบาล",
          },
        ],
      },
    ];
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-500/20 text-slate-800 dark:text-slate-200">
      <CleanHeader selectedYear={selectedYear} years={years} setSelectedYear={setSelectedYear} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Main Title Section */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900/40 mb-4">
            <BookOutlined /> ITA Online Portal
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
              ท่านสามารถเลือกปีงบประมาณและคลิกเพื่อเปิดดูรายละเอียดตัวชี้วัดความโปร่งใส (O1 - O37)
              และเข้าถึงข้อมูลอ้างอิงอย่างเป็นทางการได้ทันที
            </p>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-6">
          {topicGroups.map((group) => (
            <CategorySection key={`${selectedYear}-${group.id}`} group={group} dbItems={dbItems} />
          ))}
        </div>
      </div>
    </div>
  );
}
