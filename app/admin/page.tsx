import Link from "next/link";

import { AdminWorkbench } from "@/components/admin-workbench";

export default function AdminPage() {
  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-5 space-y-3 sm:mt-6">
          <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-600 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            内容后台
          </div>
          <h1 className="text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            录入好玩活动 / 审核候选
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            可以粘贴小红书/公众号链接当来源，自己改写成适合 2 岁的玩法后上线；也可以审核高德抓来的地点候选。
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <AdminWorkbench />
        </div>
      </div>
    </main>
  );
}
