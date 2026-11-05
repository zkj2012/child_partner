import { assertStory } from "@/lib/stories/define";
import { sayItStory } from "@/lib/stories/say-it";
import { shareToyStory } from "@/lib/stories/share-toy";
import { subwayStory } from "@/lib/stories/subway";
import type { Story } from "@/lib/stories/types";

export const stories: Story[] = [subwayStory, shareToyStory, sayItStory];

for (const story of stories) {
  assertStory(story);
}

export function getStory(id: string) {
  return stories.find((story) => story.id === id);
}

export type {
  ChoiceTone,
  SceneId,
  Story,
  StoryBeat,
  StoryChoice,
  StoryConcept,
} from "@/lib/stories/types";
