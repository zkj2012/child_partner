"use client";

import Link from "next/link";

import { categoryLabels } from "@/lib/tags";
import type { RecommendationResult } from "@/lib/types";

type DrawCardProps = {
  index: number;
  total: number;
  item: RecommendationResult;
  /** 移动端由外层操作栏负责主按钮时隐藏卡片内 CTA */
  compactActions?: boolean;
};

export function DrawCard({
  index,
  total,
  item,
  compactActions = false,
}: DrawCardProps) {
  return (
    <article className="flex h-full min-h-[380px] flex-col rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:min-h-[400px] sm:rounded-[32px] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-rose-500">
            {categoryLabels[item.activity.category]}
            <span className="ml-2 font-normal text-slate-400">
              {index + 1}/{total}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
            {item.activity.title}
          </h3>
        </div>
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
        <div className="text-sm font-semibold text-slate-900">为什么适合今天</div>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
          {item.reasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      </div>

      {!compactActions ? (
        <div className="mt-auto pt-5">
          <Link
            href={`/activities/${item.activity.slug}`}
            className="flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            想去，看详细玩法
          </Link>
        </div>
      ) : (
        <div className="mt-auto pt-4 text-center text-xs text-slate-400">
          左右滑也可：左滑下一条 · 右滑想去
        </div>
      )}
    </article>
  );
}
