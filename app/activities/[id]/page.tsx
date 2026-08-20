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
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/draw" className="text-sm font-medium text-slate-500">
          ← 返回抽卡结果
        </Link>

        <div className="mt-6 rounded-[36px] border border-orange-100 bg-white p-7 shadow-sm">
          <div className="text-sm font-semibold text-rose-500">
            {categoryLabels[activity.category]}
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {activity.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{activity.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
              适龄 {Math.floor(activity.minAgeMonths / 12)}-{
                Math.ceil(activity.maxAgeMonths / 12)
              } 岁
            </span>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
              {activity.durationMinutes} 分钟
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {activity.district}
            </span>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <section className="rounded-3xl bg-slate-50 p-5">
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

            <section className="rounded-3xl bg-slate-50 p-5">
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

          <section className="mt-5 rounded-3xl bg-rose-50 p-5">
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
