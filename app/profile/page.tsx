import Link from "next/link";

import { ProfileForm } from "@/components/profile-form";

type ProfilePageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { next } = await searchParams;
  const redirectTo = next && next.startsWith("/") ? next : "/ask";

  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-sky-600 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
            一次性设置
          </div>
          <h1 className="text-[1.75rem] font-black tracking-tight text-slate-950 sm:text-4xl">
            先认识一下你们家
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            告诉我孩子的年龄段、日常节奏和出行习惯。这些信息会保存在本机，以后抽卡时不会再重复询问。
          </p>
        </div>

        <div className="mt-6 rounded-[28px] border border-orange-100 bg-white p-4 shadow-sm sm:mt-8 sm:rounded-[36px] sm:p-8">
          <ProfileForm redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
