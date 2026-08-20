import type { Activity } from "@/lib/types";

export function activityToDbFields(activity: Activity) {
  return {
    slug: activity.slug,
    title: activity.title,
    category: activity.category,
    summary: activity.summary,
    minAgeMonths: activity.minAgeMonths,
    maxAgeMonths: activity.maxAgeMonths,
    durationMinutes: activity.durationMinutes,
    budgetLevel: activity.budgetLevel,
    indoorOutdoor: activity.indoorOutdoor,
    energyLevel: activity.energyLevel,
    preparationLevel: activity.preparationLevel,
    distanceBand: activity.distanceBand,
    weatherTags: activity.weather,
    district: activity.district,
    locationHint: activity.locationHint,
    tagList: activity.tags,
    materials: activity.materials,
    steps: activity.steps,
    safetyTips: activity.safetyTips,
    recommendationRaw: activity.recommendationReasons,
    source: "seed",
    status: "published" as const,
    qualityScore: 85,
  };
}
