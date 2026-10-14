import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fitzet.academicatlas",
  appName: "Academic Atlas",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
