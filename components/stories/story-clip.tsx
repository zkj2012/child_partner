"use client";

import { useEffect, useRef } from "react";

function holdLastFrame(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  video.currentTime = Math.max(0, video.duration - 0.05);
  video.pause();
}

export function StoryClip({ src, label, bare = false }: { src: string; label: string; bare?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let started = false;
    const onEnded = () => holdLastFrame(video);
    const tryPlay = () => {
      if (cancelled || started) return;
      started = true;
      void video.play().catch(() => {
        started = false;
      });
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("canplay", tryPlay);
    video.preload = "auto";
    video.src = src;
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();

    return () => {
      cancelled = true;
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("canplay", tryPlay);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  return (
    <div
      className={
        bare
          ? "overflow-hidden bg-[#f6f1e8]"
          : "overflow-hidden rounded-[28px] bg-[#f6f1e8] shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/5 sm:rounded-[36px]"
      }
    >
      <video
        ref={videoRef}
        className="block aspect-video w-full bg-[#f6f1e8] object-cover"
        muted
        playsInline
        preload="none"
        aria-label={label}
      />
    </div>
  );
}
