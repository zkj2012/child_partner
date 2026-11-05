"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { StoryClip } from "@/components/stories/story-clip";
import { StoryStage } from "@/components/stories/story-stage";
import type { ChoiceTone, Story } from "@/lib/stories/types";

const primaryBtn =
  "inline-flex min-h-16 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-center text-xl font-bold text-white shadow-lg shadow-slate-900/10";

const secondaryBtn =
  "inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-center text-lg font-bold text-slate-800";

const toneClass: Record<ChoiceTone, string> = {
  brave: "border-sky-200 bg-sky-50",
  cozy: "border-amber-200 bg-amber-50",
  care: "border-emerald-200 bg-emerald-50",
  oops: "border-rose-200 bg-rose-50",
};

const choiceBtn =
  "flex min-h-32 items-center justify-center rounded-[28px] border-2 px-4 py-5 text-center text-2xl font-black leading-tight text-slate-950 shadow-sm active:scale-[0.98] sm:min-h-40 sm:text-4xl";

export function StoryPlayer({
  story,
  nextStory,
}: {
  story: Story;
  nextStory: { id: string; title: string } | null;
}) {
  const [beatId, setBeatId] = useState(story.start);
  const [history, setHistory] = useState<string[]>([]);
  const [saidIds, setSaidIds] = useState<string[]>([]);
  const beat = story.beats[beatId];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [beatId]);

  if (!beat) {
    return null;
  }

  const hasChoices = Boolean(beat.choices?.length);
  const said = saidIds.includes(beat.id);
  const unlockSay = Boolean(beat.concept) && !said && (hasChoices || Boolean(beat.ending));
  const advanceOnSay = Boolean(beat.concept) && !said && !hasChoices && !beat.ending;
  const choicePair = !advanceOnSay && !unlockSay && beat.choices?.length === 2 ? beat.choices : null;

  function go(next: string) {
    setHistory((current) => [...current, beat.id]);
    setBeatId(next);
  }

  function back() {
    const previous = history[history.length - 1];
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setBeatId(previous);
  }

  function restart() {
    setHistory([]);
    setSaidIds([]);
    setBeatId(story.start);
  }

  function markSaid() {
    setSaidIds((current) => (current.includes(beat.id) ? current : [...current, beat.id]));
  }

  const mediaFrame = choicePair
    ? "mx-auto w-full lg:w-[min(100%,calc((100dvh-16rem)*16/9))]"
    : "mx-auto w-full lg:w-[min(100%,calc((100dvh-10.5rem)*16/9))]";

  return (
    <main
      className={`${story.wash} min-h-dvh px-4 py-4 sm:px-6 sm:py-6 lg:flex lg:h-dvh lg:flex-col lg:overflow-hidden lg:px-8 lg:py-5`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col lg:min-h-0 lg:max-w-none lg:flex-1">
        <div className="flex shrink-0 items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <Link href="/stories">全部故事</Link>
          <div>{story.title}</div>
          <div>第 {history.length + 1} 幕</div>
        </div>

        <div
          className={
            choicePair
              ? "mt-4 lg:mt-4 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(8.5rem,11rem)_minmax(0,1fr)_minmax(8.5rem,11rem)] lg:items-center lg:gap-5"
              : "mt-4 grid items-center gap-5 lg:mt-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:gap-8"
          }
        >
          <div className={choicePair ? "lg:col-start-2 lg:row-start-1" : undefined} key={beat.id}>
            <div className={mediaFrame}>
              {beat.video ? (
                <StoryClip src={beat.video} label={beat.title} />
              ) : (
                <StoryStage scene={beat.scene} label={beat.title} />
              )}
            </div>
            {choicePair && beat.concept ? (
              <div className="mt-4 text-center">
                <div className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  {beat.concept.zh}
                </div>
                <div className="mt-2 text-3xl font-bold text-sky-700 sm:text-4xl">{beat.concept.en}</div>
              </div>
            ) : null}
          </div>

          {choicePair ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:contents">
              <button
                type="button"
                onClick={() => go(choicePair[0].next)}
                className={`${choiceBtn} ${toneClass[choicePair[0].tone]} lg:col-start-1 lg:row-start-1 lg:h-full lg:min-h-64`}
              >
                {choicePair[0].label}
              </button>
              <button
                type="button"
                onClick={() => go(choicePair[1].next)}
                className={`${choiceBtn} ${toneClass[choicePair[1].tone]} lg:col-start-3 lg:row-start-1 lg:h-full lg:min-h-64`}
              >
                {choicePair[1].label}
              </button>
            </div>
          ) : (
            <div aria-live="polite">
              {beat.concept ? (
                <div className="text-center">
                  <div className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                    {beat.concept.zh}
                  </div>
                  <div className="mt-2 text-3xl font-bold text-sky-700 sm:text-4xl">{beat.concept.en}</div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-3">
                {advanceOnSay && beat.next ? (
                  <button type="button" className={primaryBtn} onClick={() => go(beat.next!)}>
                    叫出来了，继续
                  </button>
                ) : null}

                {advanceOnSay && beat.redo ? (
                  <button type="button" className={primaryBtn} onClick={() => go(beat.redo!.to)}>
                    叫出来了，{beat.redo.label}
                  </button>
                ) : null}

                {unlockSay ? (
                  <button type="button" className={primaryBtn} onClick={markSaid}>
                    叫出来了
                  </button>
                ) : null}

                {!advanceOnSay && !unlockSay
                  ? beat.choices?.map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => go(choice.next)}
                        className={`${choiceBtn} ${toneClass[choice.tone]}`}
                      >
                        {choice.label}
                      </button>
                    ))
                  : null}

                {!advanceOnSay && !unlockSay && beat.next && !beat.ending ? (
                  <button type="button" className={primaryBtn} onClick={() => go(beat.next!)}>
                    继续
                  </button>
                ) : null}

                {!advanceOnSay && !unlockSay && beat.redo ? (
                  <button
                    type="button"
                    className={beat.ending ? secondaryBtn : primaryBtn}
                    onClick={() => go(beat.redo!.to)}
                  >
                    {beat.redo.label}
                  </button>
                ) : null}

                {!advanceOnSay && !unlockSay && beat.ending ? (
                  <>
                    <button type="button" className={beat.redo ? secondaryBtn : primaryBtn} onClick={restart}>
                      再玩一次
                    </button>
                    {nextStory ? (
                      <Link href={`/stories/${nextStory.id}`} className={secondaryBtn}>
                        看《{nextStory.title}》
                      </Link>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex shrink-0 items-center justify-between text-sm font-semibold text-slate-500 lg:mt-3">
          <button type="button" onClick={back} disabled={history.length === 0} className="disabled:opacity-30">
            上一步
          </button>
          <button type="button" onClick={restart}>
            重来
          </button>
          <Link href="/stories">故事列表</Link>
        </div>
      </div>
    </main>
  );
}
