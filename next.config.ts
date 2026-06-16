import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  experimental: {
    outputFileTracingIncludes: {
      "/api/proposals/[id]/export": [
        "./node_modules/@sparticuz/chromium/**/*"
      ]
    }
  }
}

export default nextConfig
