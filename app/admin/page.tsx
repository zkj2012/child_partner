import Link from "next/link";

import { CandidateReviewPanel } from "@/components/candidate-review-panel";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-6 space-y-3">
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-sky-600 shadow-sm">
            内容审核
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            高德候选地点审核
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            定时任务抓到的地点会先停在这里。你确认后再上线，避免不适合 2 岁娃的内容直接进入抽卡推荐。
          </p>
        </div>

        <div className="mt-8">
          <CandidateReviewPanel />
        </div>
      </div>
    </main>
  );
}
