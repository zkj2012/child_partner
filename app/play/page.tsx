import type { Metadata } from "next";
import Link from "next/link";

import { CopyPlayLink } from "@/components/copy-play-link";
import { DailyPicker } from "@/components/daily-picker";

export const metadata: Metadata = {
  title: "今天带娃抽什么",
  description: "直接开始抽卡：选一下今天怎么带娃，马上给出 3 个适合的亲子活动。",
  openGraph: {
    title: "今天带娃抽什么",
    description: "不用看介绍页，打开就能抽今天的 3 张遛娃灵感卡。",
  },
};

export default function PlayPage() {
  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-rose-500 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            日常抽卡
          </div>
          <CopyPlayLink />
        </div>

        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <h1 className="text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            今天带娃抽什么？
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            直接开始。选一下今天想出门、在家还是放电，马上抽出 3 个可执行选项。
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-[36px] sm:p-8">
          <DailyPicker entryPath="/play" />
        </div>

        <p className="mt-6 pb-2 text-center text-sm text-slate-500">
          第一次用会先记一次孩子年龄等信息；之后打开这个链接就能直接抽。
          <br />
          <Link href="/profile?next=/play" className="font-medium text-slate-700 underline">
            修改基础设置
          </Link>
          <span className="mx-2 text-slate-300">·</span>
          <Link href="/" className="font-medium text-slate-700 underline">
            看看介绍页
          </Link>
        </p>
      </div>
    </main>
  );
}
