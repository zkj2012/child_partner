import { activities as staticActivities } from "@/data/activities";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import type { Activity } from "@/lib/types";

function mapRecordToActivity(record: {
  slug: string;
  title: string;
  category: string;
  summary: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  durationMinutes: number;
  budgetLevel: string;
  indoorOutdoor: string;
  energyLevel: string;
  preparationLevel: string;
  distanceBand: string;
  weatherTags: string[];
  district: string;
  locationHint: string;
  tagList: string[];
  materials: string[];
  steps: string[];
  safetyTips: string[];
  recommendationRaw: string[];
}): Activity {
  return {
    id: record.slug,
    slug: record.slug,
    title: record.title,
    category: record.category as Activity["category"],
    summary: record.summary,
    minAgeMonths: record.minAgeMonths,
    maxAgeMonths: record.maxAgeMonths,
    durationMinutes: record.durationMinutes,
    budgetLevel: record.budgetLevel as Activity["budgetLevel"],
    indoorOutdoor: record.indoorOutdoor as Activity["indoorOutdoor"],
    energyLevel: record.energyLevel as Activity["energyLevel"],
    preparationLevel: record.preparationLevel as Activity["preparationLevel"],
    weather: record.weatherTags as Activity["weather"],
    distanceBand: record.distanceBand as Activity["distanceBand"],
    district: record.district,
    locationHint: record.locationHint,
    tags: record.tagList,
    materials: record.materials,
    steps: record.steps,
    safetyTips: record.safetyTips,
    recommendationReasons: record.recommendationRaw,
  };
}

export async function getPublishedActivities(): Promise<Activity[]> {
  if (!isDatabaseConfigured()) {
    return staticActivities;
  }

  try {
    const records = await prisma.activity.findMany({
      where: { status: "published" },
      orderBy: [{ qualityScore: "desc" }, { updatedAt: "desc" }],
    });

    if (records.length === 0) {
      return staticActivities;
    }

    return records.map(mapRecordToActivity);
  } catch (error) {
    console.error("[activities-repo] 读取数据库失败，回退到静态内容", error);
    return staticActivities;
  }
}

export async function getActivityBySlug(slug: string): Promise<Activity | undefined> {
  if (!isDatabaseConfigured()) {
    return staticActivities.find((activity) => activity.slug === slug);
  }

  try {
    const record = await prisma.activity.findFirst({
      where: { slug, status: "published" },
    });

    if (record) {
      return mapRecordToActivity(record);
    }
  } catch (error) {
    console.error("[activities-repo] 按 slug 读取失败，回退到静态内容", error);
  }

  return staticActivities.find((activity) => activity.slug === slug);
}
