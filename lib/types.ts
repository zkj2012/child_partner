export type ActivityCategory = "outing" | "craft" | "sport";

export type BudgetLevel = "low" | "medium" | "high";
export type EnergyLevel = "calm" | "balanced" | "active";
export type IndoorOutdoor = "indoor" | "outdoor" | "both";
export type PreparationLevel = "easy" | "medium";
export type DistanceBand = "near" | "mid" | "far";
export type WeatherTag = "sunny" | "cloudy" | "rainy" | "all";

export type ProfileKey = "ageGroup" | "travelRadius" | "energy" | "budget";

export type DailyKey = "scene" | "duration";

export type AnswerKey = ProfileKey | DailyKey;

export type ProfileAnswers = Partial<Record<ProfileKey, string>>;

export type DailyAnswers = Partial<Record<DailyKey, string>>;

export type UserAnswers = Partial<Record<AnswerKey, string>>;

export type FeedbackAction =
  | "liked"
  | "not_suitable"
  | "visited"
  | "reshuffle";

export type FeedbackEvent = {
  activityId: string;
  action: FeedbackAction;
  tags: string[];
  category: ActivityCategory;
  createdAt: string;
};

export type Activity = {
  id: string;
  slug: string;
  title: string;
  category: ActivityCategory;
  summary: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  durationMinutes: number;
  budgetLevel: BudgetLevel;
  indoorOutdoor: IndoorOutdoor;
  energyLevel: EnergyLevel;
  preparationLevel: PreparationLevel;
  weather: WeatherTag[];
  distanceBand: DistanceBand;
  district: string;
  locationHint: string;
  tags: string[];
  materials: string[];
  steps: string[];
  safetyTips: string[];
  recommendationReasons: string[];
};

export type ChoiceOption = {
  value: string;
  label: string;
  hint: string;
};

export type PromptConfig<T extends AnswerKey = AnswerKey> = {
  id: T;
  question: string;
  options: ChoiceOption[];
};

export type RecommendationResult = {
  activity: Activity;
  score: number;
  reasons: string[];
};
