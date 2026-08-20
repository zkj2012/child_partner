import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { fetchAmapCandidates } from "@/lib/ingest/poi-amap";
import { fetchShanghaiWeather } from "@/lib/ingest/weather";

export type IngestSummary = {
  weather: { condition: string; tempC: number | null };
  candidatesCreated: number;
  candidatesSkippedReason: string | null;
  runs: Array<{ source: string; success: boolean; itemCount: number; error?: string }>;
};

export async function runContentIngest(): Promise<IngestSummary> {
  const runs: IngestSummary["runs"] = [];
  let candidatesCreated = 0;
  let candidatesSkippedReason: string | null = null;

  const weather = await fetchShanghaiWeather();
  await prisma.weatherSnapshot.create({
    data: weather,
  });
  runs.push({ source: "open-meteo", success: true, itemCount: 1 });

  const poiResult = await fetchAmapCandidates();
  if (poiResult.skipped) {
    candidatesSkippedReason = poiResult.reason;
    runs.push({ source: "amap", success: true, itemCount: 0 });
  } else {
    for (const item of poiResult.items) {
      await prisma.activityCandidate.upsert({
        where: {
          source_externalId: {
            source: "amap",
            externalId: item.externalId,
          },
        },
        create: {
          source: "amap",
          externalId: item.externalId,
          title: item.title,
          summary: item.summary,
          district: item.district,
          category: "outing",
          rawPayload: item.rawPayload as Prisma.InputJsonValue,
          status: "pending",
        },
        update: {
          title: item.title,
          summary: item.summary,
          district: item.district,
          rawPayload: item.rawPayload as Prisma.InputJsonValue,
          fetchedAt: new Date(),
        },
      });
      candidatesCreated += 1;
    }

    await prisma.ingestRun.create({
      data: {
        source: "amap",
        success: true,
        itemCount: poiResult.items.length,
      },
    });
    runs.push({ source: "amap", success: true, itemCount: poiResult.items.length });
  }

  await prisma.ingestRun.create({
    data: {
      source: "open-meteo",
      success: true,
      itemCount: 1,
    },
  });

  return {
    weather: { condition: weather.condition, tempC: weather.tempC },
    candidatesCreated,
    candidatesSkippedReason,
    runs,
  };
}

/** 将审核通过的候选地点转为正式活动（draft 状态，待补充步骤） */
export async function approveCandidate(candidateId: string) {
  const candidate = await prisma.activityCandidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate || candidate.status !== "pending") {
    return null;
  }

  const slug = `amap-${candidate.externalId ?? candidate.id}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const activity = await prisma.activity.upsert({
    where: { slug },
    create: {
      slug,
      title: candidate.title,
      category: candidate.category ?? "outing",
      summary: candidate.summary ?? "待补充详细介绍。",
      minAgeMonths: 24,
      maxAgeMonths: 60,
      durationMinutes: 120,
      budgetLevel: "medium",
      indoorOutdoor: "outdoor",
      energyLevel: "balanced",
      preparationLevel: "easy",
      distanceBand: "mid",
      weatherTags: ["sunny", "cloudy"],
      district: candidate.district ?? "上海",
      locationHint: "来自地图候选，建议出发前再确认开放信息。",
      tagList: ["outing", "map-candidate"],
      materials: ["水壶", "防晒帽", "推车"],
      steps: [
        "出发前确认营业时间和人流情况。",
        "到了之后先找适合低龄孩子的区域。",
        "控制停留时长，避免孩子过度疲劳。",
      ],
      safetyTips: ["全程牵护。", "热门区域注意防走失。"],
      recommendationRaw: ["来自网络候选库，待你补充后会更好用。"],
      source: candidate.source,
      sourceUrl: typeof candidate.rawPayload === "object" && candidate.rawPayload !== null && "location" in candidate.rawPayload
        ? String((candidate.rawPayload as { location?: string }).location ?? "")
        : null,
      status: "draft",
      qualityScore: 50,
    },
    update: {
      title: candidate.title,
      summary: candidate.summary ?? undefined,
      district: candidate.district ?? undefined,
      updatedAt: new Date(),
    },
  });

  await prisma.activityCandidate.update({
    where: { id: candidateId },
    data: { status: "approved" },
  });

  return activity;
}
