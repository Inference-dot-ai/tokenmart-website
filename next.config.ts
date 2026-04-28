import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.io", "*.ngrok.app"],
};

export default nextConfig;
