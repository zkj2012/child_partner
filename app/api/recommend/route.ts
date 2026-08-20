import { NextResponse } from "next/server";

import { getPublishedActivities } from "@/lib/activities-repo";
import { recommendActivities } from "@/lib/recommendation";
import type { FeedbackEvent, UserAnswers } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    answers?: UserAnswers;
    feedback?: FeedbackEvent[];
    excludeIds?: string[];
  };

  if (!payload.answers) {
    return NextResponse.json(
      { message: "缺少推荐所需的回答信息。" },
      { status: 400 },
    );
  }

  const activityPool = await getPublishedActivities();
  const recommendations = recommendActivities(
    activityPool,
    payload.answers,
    payload.feedback ?? [],
    payload.excludeIds ?? [],
  );

  return NextResponse.json({
    recommendations,
  });
}
