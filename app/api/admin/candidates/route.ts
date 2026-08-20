import { NextResponse } from "next/server";

import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export async function GET(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "未配置 DATABASE_URL" },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "pending";

  const candidates = await prisma.activityCandidate.findMany({
    where: status === "all" ? undefined : { status: status as "pending" | "approved" | "rejected" },
    orderBy: { fetchedAt: "desc" },
    take: 100,
  });

  const counts = await prisma.activityCandidate.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  return NextResponse.json({
    candidates,
    counts: Object.fromEntries(
      counts.map((item) => [item.status, item._count._all]),
    ),
  });
}
