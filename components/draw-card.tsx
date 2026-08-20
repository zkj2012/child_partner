"use client";

import Link from "next/link";
import { useState } from "react";

import { categoryLabels, feedbackCopy } from "@/lib/tags";
import type { FeedbackAction, RecommendationResult } from "@/lib/types";

type DrawCardProps = {
  index: number;
  item: RecommendationResult;
  onFeedback: (action: FeedbackAction, item: RecommendationResult) => void;
};

export function DrawCard({ index, item, onFeedback }: DrawCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative min-h-[360px] rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:min-h-[420px] sm:rounded-[32px] sm:p-5">
      {!flipped ? (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="flex h-full min-h-[320px] w-full flex-col items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#fff7ed_0%,#ffe4e6_100%)] px-3 text-center sm:min-h-[380px] sm:rounded-[28px]"
        >
          <div className="rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-rose-500">
            第 {index + 1} 张卡
          </div>
          <div className="mt-4 text-2xl font-black tracking-wide text-slate-900 sm:mt-5 sm:text-3xl">
            点我翻牌
          </div>
          <div className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            左右滑动看另外两张，点开查看玩法。
          </div>
        </button>
      ) : (
        <div className="flex h-full min-h-[320px] flex-col sm:min-h-[380px]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-rose-500">
                {categoryLabels[item.activity.category]}
              </div>
              <h3 className="mt-1 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
                {item.activity.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500"
            >
              盖回去
            </button>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4">
            {item.activity.summary}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-sm sm:mt-4">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
              {Math.round(item.activity.minAgeMonths / 12) || 1} 岁起
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
              {item.activity.durationMinutes} 分钟
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {item.activity.district}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3.5 sm:mt-5 sm:rounded-3xl sm:p-4">
            <div className="text-sm font-semibold text-slate-900">为什么会抽到它</div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
              {item.reasons.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto space-y-3 pt-4 sm:pt-5">
            <Link
              href={`/activities/${item.activity.slug}`}
              className="flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              看详细玩法
            </Link>
            <div className="grid grid-cols-3 gap-2">
              {(["liked", "not_suitable", "visited"] as const).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onFeedback(action, item)}
                  className="min-h-10 rounded-full border border-slate-200 px-2 py-2 text-xs text-slate-700 sm:text-sm"
                >
                  {feedbackCopy[action]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
