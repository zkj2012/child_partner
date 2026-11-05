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

    const onEnded = () => holdLastFrame(video);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
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
        key={src}
        className="block aspect-video w-full bg-[#f6f1e8] object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
