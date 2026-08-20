import { tagGroups } from "@/lib/tags";
import type {
  Activity,
  FeedbackEvent,
  RecommendationResult,
  UserAnswers,
} from "@/lib/types";

function parseAgeRange(ageGroup?: string) {
  if (!ageGroup) {
    return { min: 24, max: 36 };
  }

  const [min, max] = ageGroup.split("-").map(Number);

  return {
    min: Number.isFinite(min) ? min : 24,
    max: Number.isFinite(max) ? max : 36,
  };
}

function durationTarget(duration?: string) {
  switch (duration) {
    case "short":
      return 45;
    case "half":
      return 120;
    case "long":
      return 180;
    default:
      return 90;
  }
}

function budgetRank(budget?: string) {
  switch (budget) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    default:
      return 2;
  }
}

function distanceRank(distance?: string) {
  switch (distance) {
    case "near":
      return 1;
    case "mid":
      return 2;
    case "far":
      return 3;
    default:
      return 2;
  }
}

function matchesScene(activity: Activity, scene?: string) {
  if (scene === "outing") {
    return activity.category === "outing";
  }

  if (scene === "home") {
    return activity.category !== "outing";
  }

  if (scene === "active") {
    return activity.energyLevel === "active" || activity.category === "sport";
  }

  return true;
}

function getFeedbackAffinity(feedback: FeedbackEvent[]) {
  const tagWeights = new Map<string, number>();
  const categoryWeights = new Map<string, number>();
  const blockedActivities = new Set<string>();

  for (const event of feedback) {
    const score =
      event.action === "liked"
        ? 3
        : event.action === "visited"
          ? 2
          : event.action === "not_suitable"
            ? -4
            : 0;

    if (event.action === "visited" || event.action === "not_suitable") {
      blockedActivities.add(event.activityId);
    }

    categoryWeights.set(
      event.category,
      (categoryWeights.get(event.category) ?? 0) + score,
    );

    for (const tag of event.tags) {
      tagWeights.set(tag, (tagWeights.get(tag) ?? 0) + score);
    }
  }

  return { tagWeights, categoryWeights, blockedActivities };
}

function explainScore(activity: Activity, answers: UserAnswers, score: number) {
  const reasons = new Set<string>();

  if (answers.travelRadius === "near" && activity.distanceBand === "near") {
    reasons.add("离你预期的出行半径更近，更容易马上出发。");
  }

  if (answers.scene === "home" && activity.indoorOutdoor !== "outdoor") {
    reasons.add("今天不想折腾出门，这个方案在家就能开始。");
  }

  if (answers.scene === "outing" && activity.category === "outing") {
    reasons.add("更符合今天想出去转转的状态。");
  }

  if (answers.energy === activity.energyLevel) {
    reasons.add("活动节奏和你今天想要的带娃强度更匹配。");
  }

  if (answers.budget === "low" && activity.budgetLevel === "low") {
    reasons.add("准备成本和预算压力都比较低。");
  }

  if (score > 16) {
    reasons.add("综合匹配度很高，适合拿来做今天的首选。");
  }

  for (const baseReason of activity.recommendationReasons) {
    reasons.add(baseReason);
    if (reasons.size >= 3) {
      break;
    }
  }

  return Array.from(reasons).slice(0, 3);
}

export function recommendActivities(
  activityPool: Activity[],
  answers: UserAnswers,
  feedback: FeedbackEvent[] = [],
  excludeIds: string[] = [],
) {
  const ageRange = parseAgeRange(answers.ageGroup);
  const durationPreference = durationTarget(answers.duration);
  const budgetPreference = budgetRank(answers.budget);
  const distancePreference = distanceRank(answers.travelRadius);
  const { tagWeights, categoryWeights, blockedActivities } =
    getFeedbackAffinity(feedback);

  const sceneTags = (
    tagGroups.scenes[answers.scene as keyof typeof tagGroups.scenes] ?? []
  ) as readonly string[];
  const energyTags = (
    tagGroups.energy[answers.energy as keyof typeof tagGroups.energy] ?? []
  ) as readonly string[];

  const results: RecommendationResult[] = activityPool
    .filter((activity) => !excludeIds.includes(activity.id))
    .filter((activity) => !blockedActivities.has(activity.id))
    .filter(
      (activity) =>
        activity.maxAgeMonths >= ageRange.min &&
        activity.minAgeMonths <= ageRange.max,
    )
    .filter((activity) => matchesScene(activity, answers.scene))
    .filter(
      (activity) => budgetRank(activity.budgetLevel) <= budgetPreference + 1,
    )
    .filter(
      (activity) =>
        activity.category !== "outing" ||
        distanceRank(activity.distanceBand) <= distancePreference,
    )
    .map((activity) => {
      let score = 10;

      score += Math.max(0, 4 - Math.abs(activity.durationMinutes - durationPreference) / 30);

      if (activity.energyLevel === answers.energy) {
        score += 4;
      }

      if (activity.distanceBand === answers.travelRadius) {
        score += 3;
      }

      if (activity.budgetLevel === answers.budget) {
        score += 3;
      }

      for (const tag of activity.tags) {
        if (sceneTags.includes(tag)) {
          score += 2;
        }

        if (energyTags.includes(tag)) {
          score += 1.5;
        }

        score += tagWeights.get(tag) ?? 0;
      }

      score += categoryWeights.get(activity.category) ?? 0;

      if (activity.preparationLevel === "easy") {
        score += 1;
      }

      return {
        activity,
        score,
        reasons: explainScore(activity, answers, score),
      };
    })
    .sort((left, right) => right.score - left.score);

  return results.slice(0, 3);
}
