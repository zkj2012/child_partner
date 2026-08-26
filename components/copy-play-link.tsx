"use client";

import { useState } from "react";

type CopyPlayLinkProps = {
  path?: string;
  label?: string;
};

export function CopyPlayLink({
  path = "/play",
  label = "复制抽卡链接",
}: CopyPlayLinkProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    setFailed(false);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        input.setAttribute("readonly", "true");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFailed(true);
      window.prompt("复制下面的链接发给朋友", url);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
    >
      {failed ? "复制失败，已弹出链接" : copied ? "已复制，可发给朋友" : label}
    </button>
  );
}
