import withPWAInit from "@ducanh2912/next-pwa";
import path from "path";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // ✅ All sensitive data must be set in .env file
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sakcat.vercel.app" }],
        destination: "https://sakcat.vercel.app/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sakcat.site" }],
        destination: "https://sakcat.vercel.app/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "sakcat.site" }],
        destination: "https://sakcat.vercel.app/:path*",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    const apiTarget = process.env.NEXT_PUBLIC_API_URL;
    const rules = [];

    // If an API target is configured, proxy ALL /api requests to it!
    if (apiTarget) {
      rules.push({
        source: "/api/:path*",
        destination: `${apiTarget}/api/:path*`,
      });
    }

    // Static assets mapped to media API
    rules.push(
      {
        source: "/uploads/:path*",
        destination: apiTarget ? `${apiTarget}/api/media/uploads/:path*` : "/api/media/uploads/:path*",
      },
      {
        source: "/attendance_photos/:path*",
        destination: apiTarget ? `${apiTarget}/api/media/attendance_photos/:path*` : "/api/media/attendance_photos/:path*",
      },
      {
        source: "/images/:path*",
        destination: apiTarget ? `${apiTarget}/api/media/images/:path*` : "/api/media/images/:path*",
      },
      {
        source: "/pdf/:path*",
        destination: apiTarget ? `${apiTarget}/api/media/pdf/:path*` : "/api/media/pdf/:path*",
      },
      {
        source: "/sakcat_drive/:path*",
        destination: apiTarget ? `${apiTarget}/api/media/sakcat_drive/:path*` : "/api/media/sakcat_drive/:path*",
      }
    );

    return {
      beforeFiles: rules,
    };
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
      allowedOrigins: [
        "sakcat.vercel.app",
        "sskcat.vercel.app",
        "sakcat.site",
        "ktltc.site",
        "localhost:3000"
      ],
    },
  },
  outputFileTracingExcludes: {
    "*": ["public/images/**/*", "public/pdf/**/*", "public/uploads/**/*"],
  },

  serverExternalPackages: ["sharp", "mongodb"],

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ktltc.site",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      tailwindcss: path.resolve(process.cwd(), "node_modules/tailwindcss"),
    },
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.resolve(process.cwd(), "node_modules/tailwindcss"),
    };
    return config;
  },

  compress: true,
  devIndicators: {
    appIsrStatus: false,
  },
};

export default withPWA(nextConfig);
