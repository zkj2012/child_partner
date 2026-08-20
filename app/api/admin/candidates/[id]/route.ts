import { NextResponse } from "next/server";

import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured } from "@/lib/db";
import {
  approveCandidate,
  rejectCandidate,
} from "@/lib/ingest/run-ingest";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "未配置 DATABASE_URL" },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const payload = (await request.json()) as {
    action?: "approve" | "reject";
    publish?: boolean;
  };

  if (payload.action === "reject") {
    const result = await rejectCandidate(id);
    if (!result) {
      return NextResponse.json({ message: "候选不存在或已处理" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (payload.action === "approve") {
    const activity = await approveCandidate(id, {
      publish: payload.publish ?? true,
    });
    if (!activity) {
      return NextResponse.json({ message: "候选不存在或已处理" }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      status: "approved",
      activity: {
        slug: activity.slug,
        title: activity.title,
        publishStatus: activity.status,
      },
    });
  }

  return NextResponse.json({ message: "未知操作" }, { status: 400 });
}
