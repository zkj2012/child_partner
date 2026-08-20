import { PrismaClient } from "@prisma/client";

import { activities } from "../data/activities";
import { activityToDbFields } from "../lib/ingest/mappers";

const prisma = new PrismaClient();

async function main() {
  for (const activity of activities) {
    const fields = activityToDbFields(activity);

    await prisma.activity.upsert({
      where: { slug: activity.slug },
      create: fields,
      update: {
        ...fields,
        status: "published",
      },
    });
  }

  console.log(`已导入 ${activities.length} 条精选活动到数据库。`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
