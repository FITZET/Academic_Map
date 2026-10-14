import { OpenAlexProvider } from "../src/lib/providers/openalex";

async function main() {
  const provider = new OpenAlexProvider();
  console.log(`[Academic Atlas] ${provider.name} sync adapter is ready.`);
  console.log("Connect Prisma teacher identities here after DATABASE_URL is configured.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
