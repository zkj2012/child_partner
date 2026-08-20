import Link from "next/link";

import { DrawExperience } from "@/components/draw-experience";
import { getPublishedActivities } from "@/lib/activities-repo";
import { dailyPrompts, profilePrompts } from "@/lib/prompts";
import { recommendActivities } from "@/lib/recommendation";
import type { UserAnswers } from "@/lib/types";

type DrawPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DrawPage({ searchParams }: DrawPageProps) {
  const resolvedParams = await searchParams;
  const allPrompts = [...profilePrompts, ...dailyPrompts];
  const answers = allPrompts.reduce<UserAnswers>((accumulator, prompt) => {
    const value = resolvedParams[prompt.id];
    if (typeof value === "string") {
      accumulator[prompt.id as keyof UserAnswers] = value;
    }
    return accumulator;
  }, {});
  const hasAnswers =
    Object.keys(answers).length >= profilePrompts.length + 1 &&
    Boolean(answers.scene);
  const activityPool = hasAnswers ? await getPublishedActivities() : [];
  const initialResults = hasAnswers
    ? recommendActivities(activityPool, answers)
    : [];

  return (
    <main className="page-shell bg-[linear-gradient(180deg,#fffdf8_0%,#fff7ed_50%,#fff1f2_100%)]">
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <Link href="/" className="text-sm font-medium text-slate-500">
            ← 返回首页
          </Link>
          <h1 className="mt-3 text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            今天适合你家的 3 张卡
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-3 sm:text-base sm:leading-8">
            先翻卡，再决定今天去哪玩或做什么。手机上可左右滑动查看。
          </p>
        </div>

        {!hasAnswers ? (
          <div className="mt-8 rounded-[28px] border border-dashed border-orange-200 bg-white/70 px-4 py-10 text-center text-slate-600 sm:mt-10 sm:rounded-[36px] sm:px-6 sm:py-12">
            还没有今天的抽卡条件，先选一下今天想怎么带娃吧。
            <div className="mt-5">
              <Link
                href="/ask"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                去选今天怎么带娃
              </Link>
            </div>
          </div>
        ) : null}

        {hasAnswers ? (
          <DrawExperience answers={answers} initialResults={initialResults} />
        ) : null}
      </div>
    </main>
  );
}
