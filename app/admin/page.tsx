import Link from "next/link";

import { CandidateReviewPanel } from "@/components/candidate-review-panel";

export default function AdminPage() {
  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-5 space-y-3 sm:mt-6">
          <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-600 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            内容审核
          </div>
          <h1 className="text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            高德候选地点审核
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            定时任务抓到的地点会先停在这里。你确认后再上线，避免不适合 2 岁娃的内容直接进入抽卡推荐。
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <CandidateReviewPanel />
        </div>
      </div>
    </main>
  );
}
