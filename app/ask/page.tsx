import Link from "next/link";

import { DailyPicker } from "@/components/daily-picker";

export default function AskPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-6 space-y-4">
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-rose-500 shadow-sm">
            今天怎么带娃
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            选一下，就开始抽卡
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            孩子的年龄和你们的出行习惯已经记住了。今天只需要告诉我，你想出门、在家，还是放电。
          </p>
        </div>

        <div className="mt-8 rounded-[36px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
          <DailyPicker />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          信息有变化？
          <Link href="/profile" className="ml-1 font-medium text-slate-700 underline">
            修改基础设置
          </Link>
        </p>
      </div>
    </main>
  );
}
