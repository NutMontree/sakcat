import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "วิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ",
    short_name: "SSKCAT",
    description: "ระบบบริหารจัดการข่าวสารและข้อมูลวิทยาลัยเกษตรและเทคโนโลยีศรีสะเกษ",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/images/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}