"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ChoiceChip } from "@/components/choice-chip";
import { profilePrompts } from "@/lib/prompts";
import { readProfile, saveProfile } from "@/lib/storage";
import type { ProfileAnswers } from "@/lib/types";

type ProfileFormProps = {
  redirectTo?: string;
};

export function ProfileForm({ redirectTo = "/ask" }: ProfileFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<ProfileAnswers>(() => readProfile() ?? {});
  const activeQuestionRef = useRef<HTMLDivElement>(null);

  const activePrompt = profilePrompts[currentStep];
  const canContinue = Boolean(answers[activePrompt.id as keyof ProfileAnswers]);
  const answeredPrompts = useMemo(
    () => profilePrompts.slice(0, currentStep + 1),
    [currentStep],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      activeQuestionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [currentStep]);

  function updateAnswer(value: string) {
    setAnswers((prev) => ({
      ...prev,
      [activePrompt.id]: value,
    }));
  }

  function goNext() {
    if (!canContinue) {
      return;
    }

    if (currentStep === profilePrompts.length - 1) {
      saveProfile(answers as ProfileAnswers);
      router.push(redirectTo);
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
        这些信息只需填一次，以后抽卡时不会再问。随时可以回来修改。
      </div>

      <div className="space-y-4 pb-24">
        {answeredPrompts.map((prompt, index) => {
          const value = answers[prompt.id as keyof ProfileAnswers];
          const selectedOption = prompt.options.find((option) => option.value === value);
          const isActive = index === currentStep;

          return (
            <div
              key={prompt.id}
              ref={isActive ? activeQuestionRef : null}
              className="scroll-mt-24 space-y-3"
            >
              <div className="max-w-xl rounded-3xl rounded-bl-md bg-slate-900 px-5 py-4 text-white shadow-sm">
                <div className="text-sm text-orange-200">基础信息 {index + 1}</div>
                <div className="mt-1 text-base font-medium">{prompt.question}</div>
              </div>

              {selectedOption && !isActive ? (
                <div className="ml-auto max-w-md rounded-3xl rounded-br-md bg-rose-100 px-5 py-4 text-right text-slate-900">
                  <div className="font-semibold">{selectedOption.label}</div>
                  <div className="mt-1 text-sm text-slate-500">{selectedOption.hint}</div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {prompt.options.map((option) => (
                    <ChoiceChip
                      key={option.value}
                      option={option}
                      selected={value === option.value}
                      onSelect={updateAnswer}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky-action-bar">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
          <div className="text-sm text-slate-500">
            {currentStep + 1} / {profilePrompts.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((step) => step - 1)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
              >
                上一题
              </button>
            ) : null}
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {currentStep === profilePrompts.length - 1 ? "保存并继续" : "下一题"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
