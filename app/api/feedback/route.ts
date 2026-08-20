import { NextResponse } from "next/server";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { feedbackCopy } from "@/lib/tags";
import type { FeedbackAction, FeedbackEvent } from "@/lib/types";

const feedbackLog: FeedbackEvent[] = [];

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<FeedbackEvent>;

  if (
    !payload.activityId ||
    !payload.action ||
    !Array.isArray(payload.tags) ||
    !payload.category
  ) {
    return NextResponse.json(
      { message: "反馈字段不完整。" },
      { status: 400 },
    );
  }

  const event: FeedbackEvent = {
    activityId: payload.activityId,
    action: payload.action,
    tags: payload.tags,
    category: payload.category,
    createdAt: payload.createdAt ?? new Date().toISOString(),
  };

  feedbackLog.push(event);

  if (isDatabaseConfigured()) {
    try {
      await prisma.feedbackEvent.create({
        data: {
          activitySlug: event.activityId,
          action: event.action,
          tags: event.tags,
          category: event.category,
        },
      });
    } catch (error) {
      console.error("[feedback] 写入数据库失败", error);
    }
  }

  const action = payload.action as FeedbackAction;

  return NextResponse.json({
    ok: true,
    message: feedbackCopy[action],
    totalFeedback: feedbackLog.length,
  });
}
