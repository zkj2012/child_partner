import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { runContentIngest } from "@/lib/ingest/run-ingest";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "未配置 DATABASE_URL，无法执行入库任务。" },
      { status: 503 },
    );
  }

  try {
    const summary = await runContentIngest();
    return NextResponse.json({ ok: true, ...summary });
  } catch (error) {
    await prisma.ingestRun.create({
      data: {
        source: "cron",
        success: false,
        itemCount: 0,
        errorMessage: error instanceof Error ? error.message : "未知错误",
      },
    }).catch(() => undefined);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "入库任务失败",
      },
      { status: 500 },
    );
  }
}
