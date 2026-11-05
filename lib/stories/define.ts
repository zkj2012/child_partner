import type { Story, StoryBeat } from "@/lib/stories/types";

export function defineBeats(list: StoryBeat[]): Record<string, StoryBeat> {
  const beats: Record<string, StoryBeat> = {};

  for (const beat of list) {
    if (beats[beat.id]) {
      throw new Error(`重复的故事幕：${beat.id}`);
    }
    beats[beat.id] = beat;
  }

  return beats;
}

function exits(beat: StoryBeat) {
  return [
    beat.next,
    beat.redo?.to,
    ...(beat.choices?.map((choice) => choice.next) ?? []),
  ].filter((id): id is string => Boolean(id));
}

export function assertStory(story: Story) {
  if (!story.beats[story.start]) {
    throw new Error(`${story.id} 的开头 ${story.start} 不存在`);
  }

  for (const [key, beat] of Object.entries(story.beats)) {
    if (key !== beat.id) {
      throw new Error(`${story.id} 的幕键 ${key} 和 id ${beat.id} 不一致`);
    }

    const hasChoices = Boolean(beat.choices?.length);
    if (hasChoices && (beat.next || beat.ending)) {
      throw new Error(`${story.id} / ${beat.id} 不能同时有选项和线性出口`);
    }
    if (beat.next && beat.ending) {
      throw new Error(`${story.id} / ${beat.id} 不能同时继续和结束`);
    }
    if (!hasChoices && !beat.next && !beat.ending && !beat.redo) {
      throw new Error(`${story.id} / ${beat.id} 没有出路`);
    }

    for (const target of exits(beat)) {
      if (!story.beats[target]) {
        throw new Error(`${story.id} / ${beat.id} 指向了不存在的 ${target}`);
      }
    }
  }

  const seen = new Set<string>();
  const queue = [story.start];

  while (queue.length > 0) {
    const id = queue.pop();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const beat = story.beats[id];
    if (!beat) throw new Error(`${story.id} 找不到幕 ${id}`);
    queue.push(...exits(beat));
  }

  for (const id of Object.keys(story.beats)) {
    if (!seen.has(id)) {
      throw new Error(`${story.id} 的 ${id} 从开头走不到`);
    }
  }
}
