"use client";

import { useState } from "react";

import { ActivityEntryForm } from "@/components/activity-entry-form";
import { CandidateReviewPanel } from "@/components/candidate-review-panel";

const SECRET_KEY = "child-partner-admin-secret";

export function AdminWorkbench() {
  const [secret, setSecret] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return sessionStorage.getItem(SECRET_KEY) ?? "";
  });
  const [inputSecret, setInputSecret] = useState("");
  const [tab, setTab] = useState<"review" | "create">("create");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function unlock(nextSecret: string) {
    setChecking(true);
    setError("");

    try {
      const response = await fetch("/api/admin/candidates?status=pending", {
        headers: { Authorization: `Bearer ${nextSecret}` },
      });

      if (!response.ok) {
        throw new Error("密钥不对，请用 CRON_SECRET");
      }

      sessionStorage.setItem(SECRET_KEY, nextSecret);
      setSecret(nextSecret);
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "验证失败");
    } finally {
      setChecking(false);
    }
  }

  if (!secret) {
    return (
      <div className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">管理员入口</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          输入 <code className="rounded bg-slate-100 px-1">CRON_SECRET</code> 后，可以审核候选，也可以主动录入好玩活动。
        </p>
        <input
          type="password"
          value={inputSecret}
          onChange={(event) => setInputSecret(event.target.value)}
          placeholder="粘贴 CRON_SECRET"
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
        <button
          type="button"
          onClick={() => void unlock(inputSecret.trim())}
          disabled={!inputSecret.trim() || checking}
          className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-slate-300"
        >
          {checking ? "验证中…" : "进入后台"}
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("create")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "create"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          主动录入
        </button>
        <button
          type="button"
          onClick={() => setTab("review")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            tab === "review"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-700"
          }`}
        >
          审核高德候选
        </button>
      </div>

      {tab === "create" ? (
        <div className="rounded-[32px] border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <ActivityEntryForm secret={secret} />
        </div>
      ) : (
        <CandidateReviewPanel />
      )}
    </div>
  );
}
