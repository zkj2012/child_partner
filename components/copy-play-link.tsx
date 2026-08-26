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

  async function handleCopy() {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
    >
      {copied ? "已复制，可发给朋友" : label}
    </button>
  );
}
