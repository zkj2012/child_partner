import Link from "next/link";
import { notFound } from "next/navigation";

import { getActivityBySlug } from "@/lib/activities-repo";
import { categoryLabels } from "@/lib/tags";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const activity = await getActivityBySlug(id);

  if (!activity) {
    notFound();
  }

  return (
    <main className="page-shell bg-[#fffdf8]">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/draw" className="text-sm font-medium text-slate-500">
          ← 返回抽卡结果
        </Link>

        <div className="mt-5 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:mt-6 sm:rounded-[36px] sm:p-7">
          <div className="text-sm font-semibold text-rose-500">
            {categoryLabels[activity.category]}
          </div>
          <h1 className="mt-2 text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            {activity.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:mt-4 sm:text-base sm:leading-8">
            {activity.summary}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-sm sm:mt-5">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
              适龄 {Math.floor(activity.minAgeMonths / 12)}-
              {Math.ceil(activity.maxAgeMonths / 12)} 岁
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
              {activity.durationMinutes} 分钟
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {activity.district}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2">
            <section className="rounded-2xl bg-slate-50 p-4 sm:rounded-3xl sm:p-5">
              <h2 className="text-lg font-bold text-slate-900">准备什么</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {activity.locationHint}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                {activity.materials.map((material) => (
                  <li key={material}>• {material}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-slate-50 p-4 sm:rounded-3xl sm:p-5">
              <h2 className="text-lg font-bold text-slate-900">怎么玩</h2>
              <ol className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
                {activity.steps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-4 rounded-2xl bg-rose-50 p-4 sm:mt-5 sm:rounded-3xl sm:p-5">
            <h2 className="text-lg font-bold text-slate-900">安全提醒</h2>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
              {activity.safetyTips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
