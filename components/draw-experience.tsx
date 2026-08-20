"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { DrawCard } from "@/components/draw-card";
import { dailyPrompts, profilePrompts } from "@/lib/prompts";
import type {
  FeedbackAction,
  FeedbackEvent,
  RecommendationResult,
  UserAnswers,
} from "@/lib/types";

const FEEDBACK_KEY = "child-partner-feedback";

type DrawExperienceProps = {
  answers: UserAnswers;
  initialResults: RecommendationResult[];
};

function readFeedback() {
  if (typeof window === "undefined") {
    return [] as FeedbackEvent[];
  }

  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as FeedbackEvent[]) : [];
  } catch {
    return [];
  }
}

export function DrawExperience({
  answers,
  initialResults,
}: DrawExperienceProps) {
  const [feedback, setFeedback] = useState<FeedbackEvent[]>(readFeedback);
  const [results, setResults] = useState<RecommendationResult[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const answerSummary = useMemo(() => {
    const dailyLabel = dailyPrompts
      .map((prompt) => {
        const selectedValue = answers[prompt.id as keyof typeof answers];
        return prompt.options.find((option) => option.value === selectedValue)?.label;
      })
      .filter(Boolean)
      .join(" · ");

    const profileHint = profilePrompts
      .map((prompt) => {
        const selectedValue = answers[prompt.id as keyof typeof answers];
        return prompt.options.find((option) => option.value === selectedValue)?.label;
      })
      .filter(Boolean)
      .slice(0, 2)
      .join(" · ");

    return dailyLabel + (profileHint ? `（${profileHint}…）` : "");
  }, [answers]);

  async function handleFeedback(action: FeedbackAction, item: RecommendationResult) {
    const nextFeedback = [
      ...feedback,
      {
        activityId: item.activity.id,
        action,
        tags: item.activity.tags,
        category: item.activity.category,
        createdAt: new Date().toISOString(),
      },
    ];

    setFeedback(nextFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(nextFeedback));

    await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nextFeedback[nextFeedback.length - 1]),
    }).catch(() => undefined);
  }

  async function reshuffle() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          feedback,
          excludeIds: results.map((result) => result.activity.id),
        }),
      });

      if (!response.ok) {
        throw new Error("推荐接口暂时不可用");
      }

      const payload = (await response.json()) as {
        recommendations: RecommendationResult[];
      };

      setResults(payload.recommendations);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "暂时没抽出结果，请稍后再试。",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mt-6 rounded-[32px] border border-orange-100 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
        本轮基于这些条件抽卡：
        <span className="ml-2 font-medium text-slate-900">{answerSummary}</span>
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/ask"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          换种带娃方式
        </Link>
        <button
          type="button"
          onClick={reshuffle}
          disabled={loading || results.length === 0}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:bg-slate-300"
        >
          {loading ? "重新洗牌中..." : "再来三个"}
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-[36px] border border-red-200 bg-red-50 px-6 py-10 text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {results.map((item, index) => (
          <DrawCard
            key={item.activity.id}
            index={index}
            item={item}
            onFeedback={handleFeedback}
          />
        ))}
      </div>

      {!loading && !error && results.length === 0 ? (
        <div className="mt-10 rounded-[36px] border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center text-slate-500">
          这轮没有抽到合适结果，试试重新答题或再来三个。
        </div>
      ) : null}
    </>
  );
}
