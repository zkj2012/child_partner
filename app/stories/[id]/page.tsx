import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StoryPlayer } from "@/components/stories/story-player";
import { getStory, stories } from "@/lib/stories";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ id: story.id }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = getStory(id);

  if (!story) {
    return { title: "互动故事" };
  }

  return {
    title: `${story.title} · 互动故事`,
    description: story.blurb,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = getStory(id);

  if (!story) {
    notFound();
  }

  const nextStory = stories.find((item) => item.id !== story.id) ?? null;

  return (
    <StoryPlayer
      story={story}
      nextStory={nextStory ? { id: nextStory.id, title: nextStory.title } : null}
    />
  );
}
