"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type TouchEvent } from "react";

import { DrawCard } from "@/components/draw-card";
import { dailyPrompts, profilePrompts } from "@/lib/prompts";
import type {
  FeedbackAction,
  FeedbackEvent,
  RecommendationResult,
  UserAnswers,
} from "@/lib/types";

const FEEDBACK_KEY = "child-partner-feedback";
const SWIPE_THRESHOLD = 72;

type DrawExperienceProps = {
  answers: UserAnswers;
  initialResults: RecommendationResult[];
};

function readFeedback(): FeedbackEvent[] {
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
  const router = useRouter();
  const [feedback, setFeedback] = useState<FeedbackEvent[]>([]);
  const [results, setResults] = useState<RecommendationResult[]>(initialResults);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  const dragOffset = useRef(0);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const animating = useRef(false);

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

  const current = results[currentIndex] ?? null;
  const remaining = Math.max(results.length - currentIndex, 0);

  function currentFeedback() {
    return feedback.length > 0 ? feedback : readFeedback();
  }

  function recordFeedback(action: FeedbackAction, item: RecommendationResult) {
    const nextFeedback = [
      ...currentFeedback(),
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

    void fetch("/api/feedback", {
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
    setExitDirection(null);
    setDragX(0);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          feedback: currentFeedback(),
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
      setCurrentIndex(0);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "暂时没抽出结果，请稍后再试。",
      );
    } finally {
      setLoading(false);
      animating.current = false;
    }
  }

  function advanceAfterSkip() {
    if (currentIndex >= results.length - 1) {
      void reshuffle();
      return;
    }
    setCurrentIndex((index) => index + 1);
    setExitDirection(null);
    setDragX(0);
    animating.current = false;
  }

  function skipCurrent() {
    if (!current || animating.current || loading) {
      return;
    }

    animating.current = true;
    recordFeedback("not_suitable", current);
    setExitDirection("left");
    window.setTimeout(() => {
      advanceAfterSkip();
    }, 180);
  }

  function wantCurrent() {
    if (!current || animating.current || loading) {
      return;
    }

    animating.current = true;
    recordFeedback("liked", current);
    setExitDirection("right");
    window.setTimeout(() => {
      router.push(`/activities/${current.activity.slug}`);
    }, 160);
  }

  function onTouchStart(event: TouchEvent) {
    if (animating.current || loading) {
      return;
    }
    touchStartX.current = event.touches[0]?.clientX ?? null;
    dragOffset.current = 0;
  }

  function onTouchMove(event: TouchEvent) {
    if (touchStartX.current === null || animating.current) {
      return;
    }
    const x = event.touches[0]?.clientX ?? touchStartX.current;
    const delta = x - touchStartX.current;
    dragOffset.current = delta;
    setDragX(delta);
  }

  function onTouchEnd() {
    if (touchStartX.current === null || animating.current) {
      return;
    }

    const delta = dragOffset.current;
    touchStartX.current = null;
    dragOffset.current = 0;

    if (delta <= -SWIPE_THRESHOLD) {
      skipCurrent();
      return;
    }
    if (delta >= SWIPE_THRESHOLD) {
      wantCurrent();
      return;
    }

    setDragX(0);
  }

  const cardTransform =
    exitDirection === "left"
      ? "translateX(-120%) rotate(-8deg)"
      : exitDirection === "right"
        ? "translateX(120%) rotate(8deg)"
        : `translateX(${dragX}px) rotate(${dragX / 28}deg)`;

  return (
    <>
      <div className="mt-5 rounded-[24px] border border-orange-100 bg-white/80 p-3.5 text-sm leading-6 text-slate-600 shadow-sm sm:mt-6 sm:rounded-[32px] sm:p-4">
        本轮基于这些条件：
        <span className="mt-1 block font-medium text-slate-900 sm:ml-2 sm:mt-0 sm:inline">
          {answerSummary}
        </span>
      </div>

      {/* 桌面：一次看三张 */}
      <div className="mt-4 hidden flex-wrap gap-2 lg:mt-6 lg:flex lg:gap-3">
        <Link
          href="/play"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          换种带娃方式
        </Link>
        <button
          type="button"
          onClick={() => void reshuffle()}
          disabled={loading || results.length === 0}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:bg-slate-300"
        >
          {loading ? "重新洗牌中..." : "再来三个"}
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-[28px] border border-red-200 bg-red-50 px-4 py-8 text-red-700 sm:mt-6 sm:rounded-[36px] sm:px-6 sm:py-10">
          {error}
        </div>
      ) : null}

      {/* 移动端：单卡决策 */}
      <div className="mt-5 lg:hidden">
        {current && !error ? (
          <>
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
              <span>还剩 {remaining} 张可看</span>
              <button
                type="button"
                onClick={() => void reshuffle()}
                disabled={loading}
                className="font-medium text-slate-700 underline-offset-2 disabled:text-slate-300"
              >
                {loading ? "洗牌中…" : "换一批"}
              </button>
            </div>

            <div
              className="relative touch-pan-y overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
            >
              <div
                className="transition-transform duration-200 ease-out"
                style={{
                  transform: cardTransform,
                  opacity: exitDirection ? 0.35 : 1 - Math.min(Math.abs(dragX) / 280, 0.35),
                }}
              >
                <DrawCard
                  index={currentIndex}
                  total={results.length}
                  item={current}
                  compactActions
                />
              </div>

              {dragX > 24 ? (
                <div className="pointer-events-none absolute left-4 top-6 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white shadow">
                  想去
                </div>
              ) : null}
              {dragX < -24 ? (
                <div className="pointer-events-none absolute right-4 top-6 rounded-full bg-slate-500 px-3 py-1 text-sm font-semibold text-white shadow">
                  下一条
                </div>
              ) : null}
            </div>

            <div className="sticky-action-bar mt-4">
              <div className="grid grid-cols-[1fr_1.35fr] gap-2">
                <button
                  type="button"
                  onClick={skipCurrent}
                  disabled={loading}
                  className="min-h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  下一条
                </button>
                <button
                  type="button"
                  onClick={wantCurrent}
                  disabled={loading}
                  className="min-h-12 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white disabled:bg-slate-300"
                >
                  想去
                </button>
              </div>
              <div className="mt-2 text-center">
                <Link href="/play" className="text-xs text-slate-500 underline">
                  换种带娃方式
                </Link>
              </div>
            </div>
          </>
        ) : null}

        {!loading && !error && results.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-orange-200 bg-white/70 px-4 py-10 text-center text-slate-500">
            这轮没有合适结果，试试换种带娃方式或再抽一批。
            <div className="mt-4 flex justify-center gap-3">
              <Link
                href="/play"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                重选方式
              </Link>
              <button
                type="button"
                onClick={() => void reshuffle()}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                再抽一批
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* 桌面：三列卡片 */}
      <div className="card-rail mt-6 hidden lg:mt-10 lg:grid">
        {results.map((item, index) => (
          <div key={item.activity.id} className="space-y-3">
            <DrawCard index={index} total={results.length} item={item} />
            <button
              type="button"
              onClick={() => {
                recordFeedback("not_suitable", item);
              }}
              className="w-full rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600"
            >
              这次不太适合
            </button>
          </div>
        ))}
      </div>

      {!loading && !error && results.length === 0 ? (
        <div className="mt-8 hidden rounded-[36px] border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center text-slate-500 lg:block">
          这轮没有抽到合适结果，试试重新答题或再来三个。
        </div>
      ) : null}
    </>
  );
}
