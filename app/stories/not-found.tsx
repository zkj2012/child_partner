import Link from "next/link";

export default function StoryNotFound() {
  return (
    <main className="page-shell bg-[#fffaf5]">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">这条故事还没有</h1>
        <p className="mt-3 text-base leading-7 text-slate-600">回到列表，选一条已经准备好的。</p>
        <Link
          href="/stories"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-base font-bold text-white"
        >
          全部故事
        </Link>
      </div>
    </main>
  );
}
