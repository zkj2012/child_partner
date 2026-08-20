import Link from "next/link";

import { ProfileForm } from "@/components/profile-form";

type ProfilePageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { next } = await searchParams;
  const redirectTo = next && next.startsWith("/") ? next : "/ask";

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/" className="text-sm font-medium text-slate-500">
          ← 返回首页
        </Link>

        <div className="mt-6 space-y-4">
          <div className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-sky-600 shadow-sm">
            一次性设置
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            先认识一下你们家
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            告诉我孩子的年龄段、日常节奏和出行习惯。这些信息会保存在本机，以后抽卡时不会再重复询问。
          </p>
        </div>

        <div className="mt-8 rounded-[36px] border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
          <ProfileForm redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}
