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
    <div className="relative min-h-[420px] rounded-[32px] border border-orange-100 bg-white p-5 shadow-sm">
      {!flipped ? (
        <button
          type="button"
          onClick={() => setFlipped(true)}
          className="flex h-full min-h-[380px] w-full flex-col items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fff7ed_0%,#ffe4e6_100%)] text-center"
        >
          <div className="rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-rose-500">
            第 {index + 1} 张卡
          </div>
          <div className="mt-5 text-3xl font-black tracking-wide text-slate-900">
            点我翻牌
          </div>
          <div className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
            可能是上海周边的去处，也可能是在家就能立刻开始的小玩法。
          </div>
        </button>
      ) : (
        <div className="flex h-full min-h-[380px] flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-rose-500">
                {categoryLabels[item.activity.category]}
              </div>
              <h3 className="mt-1 text-2xl font-bold text-slate-950">
                {item.activity.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500"
            >
              盖回去
            </button>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{item.activity.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
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

          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">为什么会抽到它</div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
              {item.reasons.map((reason) => (
                <li key={reason}>• {reason}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto space-y-3 pt-5">
            <Link
              href={`/activities/${item.activity.slug}`}
              className="flex justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              看详细玩法
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "liked",
                  "not_suitable",
                  "visited",
                ] as const
              ).map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onFeedback(action, item)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700"
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
