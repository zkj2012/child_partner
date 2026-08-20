import type { DailyAnswers, ProfileAnswers, UserAnswers } from "@/lib/types";

export const PROFILE_KEY = "child-partner-profile";
export const DAILY_KEY = "child-partner-daily";
export const FEEDBACK_KEY = "child-partner-feedback";

export function readProfile(): ProfileAnswers | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ProfileAnswers) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ProfileAnswers) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function readDaily(): DailyAnswers | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? (JSON.parse(raw) as DailyAnswers) : null;
  } catch {
    return null;
  }
}

export function saveDaily(daily: DailyAnswers) {
  localStorage.setItem(DAILY_KEY, JSON.stringify(daily));
}

export function mergeAnswers(
  profile: ProfileAnswers,
  daily: DailyAnswers,
): UserAnswers {
  return { ...profile, ...daily };
}

export function isProfileComplete(profile: ProfileAnswers | null): profile is ProfileAnswers {
  return Boolean(
    profile?.ageGroup &&
      profile?.energy &&
      profile?.travelRadius &&
      profile?.budget,
  );
}
