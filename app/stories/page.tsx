import type { Metadata } from "next";
import Link from "next/link";

import { StoryClip } from "@/components/stories/story-clip";
import { StoryStage } from "@/components/stories/story-stage";
import { stories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "互动故事",
  description: "短故事，点一张卡片就开始。",
};

export default function StoriesPage() {
  return (
    <main className="page-shell bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#fff7ed_40%,#fffaf5_100%)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link href="/" className="text-sm font-semibold text-slate-500">
          返回首页
        </Link>

        <div className="grid gap-6 lg:grid-cols-2">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-orange-100"
            >
              {story.coverVideo ? (
                <StoryClip src={story.coverVideo} label={story.title} bare />
              ) : (
                <StoryStage scene={story.cover} label={story.title} bare />
              )}
              <h2 className="px-5 py-4 text-2xl font-black tracking-tight text-slate-950 sm:px-6 sm:py-5 sm:text-3xl">
                {story.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
