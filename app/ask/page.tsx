import Link from "next/link";

import { DailyPicker } from "@/components/daily-picker";

export default function AskPage() {
  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-rose-500 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            今天怎么带娃
          </div>
          <h1 className="text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            选一下，就开始抽卡
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            孩子的年龄和你们的出行习惯已经记住了。今天只需要告诉我，你想出门、在家，还是放电。
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-[36px] sm:p-8">
          <DailyPicker />
        </div>

        <p className="mt-6 pb-2 text-center text-sm text-slate-500">
          信息有变化？
          <Link href="/profile" className="ml-1 font-medium text-slate-700 underline">
            修改基础设置
          </Link>
        </p>
      </div>
    </main>
  );
}
