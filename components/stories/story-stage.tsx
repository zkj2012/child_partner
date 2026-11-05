import type { ReactNode } from "react";

import { metroDrawers } from "@/components/stories/scenes-metro";
import { toyDrawers } from "@/components/stories/scenes-toy";
import type { SceneId } from "@/lib/stories/types";

const drawers = {
  ...metroDrawers,
  ...toyDrawers,
} satisfies Record<SceneId, () => ReactNode>;

export function StoryStage({ scene, label, bare = false }: { scene: SceneId; label: string; bare?: boolean }) {
  const draw = drawers[scene];

  return (
    <div
      className={
        bare
          ? "overflow-hidden bg-white"
          : "overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/5 sm:rounded-[36px]"
      }
    >
      <svg
        viewBox="0 0 800 460"
        className="block h-auto w-full"
        role="img"
        aria-label={label}
        fontFamily="inherit"
      >
        {draw()}
      </svg>
    </div>
  );
}
