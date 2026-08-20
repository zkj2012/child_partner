import { runContentIngest } from "@/lib/ingest/run-ingest";
import { isDatabaseConfigured, prisma } from "@/lib/db";

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("请先配置 DATABASE_URL");
    process.exit(1);
  }

  const summary = await runContentIngest();
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
