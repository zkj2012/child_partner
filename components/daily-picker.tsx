"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChoiceChip } from "@/components/choice-chip";
import { dailyPrompts } from "@/lib/prompts";
import { useIsClient } from "@/lib/use-is-client";
import {
  isProfileComplete,
  mergeAnswers,
  readProfile,
  saveDaily,
} from "@/lib/storage";
import type { DailyAnswers } from "@/lib/types";

type DailyPickerProps = {
  /** 分享入口路径，基础设置完成后会回到这里 */
  entryPath?: string;
};

export function DailyPicker({ entryPath = "/play" }: DailyPickerProps) {
  const router = useRouter();
  const isClient = useIsClient();
  const [answers, setAnswers] = useState<DailyAnswers>({});
  const durationRef = useRef<HTMLDivElement>(null);
  const profilePath = `/profile?next=${encodeURIComponent(entryPath)}`;
  const profile = isClient ? readProfile() : null;
  const profileReady = isProfileComplete(profile);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (!isProfileComplete(readProfile())) {
      router.replace(profilePath);
    }
  }, [isClient, router, profilePath]);

  useEffect(() => {
    if (!answers.scene) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      durationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [answers.scene]);

  function updateAnswer(key: keyof DailyAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function startDraw() {
    const latest = readProfile();
    if (!isProfileComplete(latest) || !answers.scene) {
      return;
    }

    const daily: DailyAnswers = {
      scene: answers.scene,
      duration: answers.duration ?? "half",
    };

    saveDaily(daily);

    const merged = mergeAnswers(latest, daily);
    const query = new URLSearchParams(merged as Record<string, string>);
    router.push(`/draw?${query.toString()}`);
  }

  if (!isClient) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center text-slate-500">
        正在打开…
      </div>
    );
  }

  if (!profileReady) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center text-slate-600">
        <p>第一次使用，先花 20 秒设置一下孩子信息。</p>
        <Link
          href={profilePath}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          去设置
        </Link>
      </div>
    );
  }

  const scenePrompt = dailyPrompts[0];
  const durationPrompt = dailyPrompts[1];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        基础信息已记住，今天只需选一下想怎么带娃，马上就能抽卡。
      </div>

      <div className="space-y-6 pb-24">
        <div className="space-y-3">
          <div className="max-w-xl rounded-3xl rounded-bl-md bg-slate-900 px-5 py-4 text-white shadow-sm">
            <div className="text-sm text-orange-200">今天</div>
            <div className="mt-1 text-lg font-medium">{scenePrompt.question}</div>
          </div>
          <div className="grid gap-3">
            {scenePrompt.options.map((option) => (
              <ChoiceChip
                key={option.value}
                option={option}
                selected={answers.scene === option.value}
                onSelect={(value) => updateAnswer("scene", value)}
              />
            ))}
          </div>
        </div>

        {answers.scene ? (
          <div ref={durationRef} className="scroll-mt-24 space-y-3">
            <div className="max-w-xl rounded-3xl rounded-bl-md bg-slate-800 px-5 py-4 text-white shadow-sm">
              <div className="text-sm text-orange-200">可选</div>
              <div className="mt-1 text-base font-medium">{durationPrompt.question}</div>
            </div>
            <div className="grid gap-3">
              {durationPrompt.options.map((option) => (
                <ChoiceChip
                  key={option.value}
                  option={option}
                  selected={(answers.duration ?? "half") === option.value}
                  onSelect={(value) => updateAnswer("duration", value)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="sticky-action-bar">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
          <div className="min-w-0 text-sm text-slate-500">
            {answers.scene ? "选好了就抽卡" : "先选一种带娃方式"}
          </div>
          <button
            type="button"
            onClick={startDraw}
            disabled={!answers.scene}
            className="shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            开始抽卡
          </button>
        </div>
      </div>
    </div>
  );
}
