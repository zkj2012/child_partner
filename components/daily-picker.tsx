"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChoiceChip } from "@/components/choice-chip";
import { dailyPrompts } from "@/lib/prompts";
import {
  isProfileComplete,
  mergeAnswers,
  readProfile,
  saveDaily,
} from "@/lib/storage";
import type { DailyAnswers } from "@/lib/types";

export function DailyPicker() {
  const router = useRouter();
  const [answers, setAnswers] = useState<DailyAnswers>({});

  useEffect(() => {
    if (!isProfileComplete(readProfile())) {
      router.replace("/profile?next=/ask");
    }
  }, [router]);

  function updateAnswer(key: keyof DailyAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function startDraw() {
    const profile = readProfile();
    if (!isProfileComplete(profile) || !answers.scene) {
      return;
    }

    const daily: DailyAnswers = {
      scene: answers.scene,
      duration: answers.duration ?? "half",
    };

    saveDaily(daily);

    const merged = mergeAnswers(profile, daily);
    const query = new URLSearchParams(merged as Record<string, string>);
    router.push(`/draw?${query.toString()}`);
  }

  const profile = readProfile();
  if (!isProfileComplete(profile)) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center text-slate-500">
        加载中…
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

      <div className="space-y-3">
        <div className="max-w-xl rounded-3xl rounded-bl-md bg-slate-900 px-5 py-4 text-white shadow-sm">
          <div className="text-sm text-orange-200">今天</div>
          <div className="mt-1 text-lg font-medium">{scenePrompt.question}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
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
        <div className="space-y-3">
          <div className="max-w-xl rounded-3xl rounded-bl-md bg-slate-800 px-5 py-4 text-white shadow-sm">
            <div className="text-sm text-orange-200">可选</div>
            <div className="mt-1 text-base font-medium">{durationPrompt.question}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
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

      <div className="flex items-center justify-between rounded-3xl border border-orange-100 bg-white px-4 py-4">
        <div className="text-sm text-slate-500">
          {answers.scene ? "选好了就抽卡" : "先选一种带娃方式"}
        </div>
        <button
          type="button"
          onClick={startDraw}
          disabled={!answers.scene}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          开始抽卡
        </button>
      </div>
    </div>
  );
}
