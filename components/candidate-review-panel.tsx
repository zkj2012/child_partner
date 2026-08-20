"use client";

import { useCallback, useState } from "react";

type Candidate = {
  id: string;
  title: string;
  summary: string | null;
  district: string | null;
  source: string;
  status: string;
  fetchedAt: string;
  rawPayload: {
    keyword?: string;
    address?: string;
    type?: string;
  } | null;
};

type Counts = Record<string, number>;

const SECRET_KEY = "child-partner-admin-secret";

export function CandidateReviewPanel() {
  const [secret, setSecret] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return sessionStorage.getItem(SECRET_KEY) ?? "";
  });
  const [inputSecret, setInputSecret] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCandidates = useCallback(
    async (nextSecret: string, nextStatus = statusFilter) => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const response = await fetch(
          `/api/admin/candidates?status=${nextStatus}`,
          {
            headers: {
              Authorization: `Bearer ${nextSecret}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "密钥不对，请用本地 .env 里的 CRON_SECRET"
              : "加载候选失败",
          );
        }

        const payload = (await response.json()) as {
          candidates: Candidate[];
          counts: Counts;
        };

        setCandidates(payload.candidates);
        setCounts(payload.counts ?? {});
        sessionStorage.setItem(SECRET_KEY, nextSecret);
        setSecret(nextSecret);
        setLoaded(true);
      } catch (loadError) {
        setError(
          loadError instanceof Error ? loadError.message : "加载失败，请稍后重试",
        );
      } finally {
        setLoading(false);
      }
    },
    [statusFilter],
  );

  async function handleAction(
    id: string,
    action: "approve" | "reject",
    publish = true,
  ) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/candidates/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, publish }),
      });

      if (!response.ok) {
        throw new Error("操作失败");
      }

      const payload = (await response.json()) as {
        activity?: { title: string; publishStatus: string };
      };

      if (action === "approve") {
        setMessage(
          `已通过「${payload.activity?.title ?? "候选"}」，状态：${
            payload.activity?.publishStatus === "published" ? "已上线" : "草稿"
          }`,
        );
      } else {
        setMessage("已拒绝该候选");
      }

      await loadCandidates(secret, statusFilter);
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "操作失败",
      );
    }
  }

  if (!secret) {
    return (
      <div className="rounded-[32px] border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">管理员入口</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          输入本地或 Vercel 里配置的{" "}
          <code className="rounded bg-slate-100 px-1">CRON_SECRET</code>
          ，才能查看并审核高德抓取的候选地点。
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
          onClick={() => void loadCandidates(inputSecret.trim())}
          disabled={!inputSecret.trim() || loading}
          className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:bg-slate-300"
        >
          {loading ? "验证中…" : "进入审核"}
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        {(["pending", "approved", "rejected", "all"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setStatusFilter(status);
              void loadCandidates(secret, status);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              statusFilter === status
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {status === "pending"
              ? `待审核 (${counts.pending ?? 0})`
              : status === "approved"
                ? `已通过 (${counts.approved ?? 0})`
                : status === "rejected"
                  ? `已拒绝 (${counts.rejected ?? 0})`
                  : "全部"}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void loadCandidates(secret)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
        >
          刷新
        </button>
      </div>

      {message ? (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!loaded && !loading ? (
        <div className="rounded-[32px] border border-dashed border-orange-200 bg-white/70 px-6 py-12 text-center">
          <p className="text-slate-600">已记住管理员密钥，点下面加载候选列表。</p>
          <button
            type="button"
            onClick={() => void loadCandidates(secret)}
            className="mt-4 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            加载候选
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[32px] border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center text-slate-500">
          加载中…
        </div>
      ) : null}

      {loaded && !loading && candidates.length === 0 ? (
        <div className="rounded-[32px] border border-dashed border-orange-200 bg-white/70 px-6 py-16 text-center text-slate-500">
          这一栏暂时没有候选。可先跑一次 <code>npm run ingest</code>。
        </div>
      ) : null}

      {loaded && !loading && candidates.length > 0 ? (
        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-rose-500">
                    {candidate.source} · {candidate.status}
                  </div>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    {candidate.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {candidate.summary}
                  </p>
                </div>
                <div className="rounded-full bg-slate-50 px-3 py-1 text-sm text-slate-600">
                  {candidate.district ?? "上海"}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {candidate.rawPayload?.keyword ? (
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                    关键词：{candidate.rawPayload.keyword}
                  </span>
                ) : null}
                {candidate.rawPayload?.type ? (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                    {candidate.rawPayload.type}
                  </span>
                ) : null}
                <span className="rounded-full bg-slate-50 px-3 py-1">
                  抓取于 {new Date(candidate.fetchedAt).toLocaleString("zh-CN")}
                </span>
              </div>

              {candidate.status === "pending" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleAction(candidate.id, "approve", true)}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    通过并上线
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAction(candidate.id, "approve", false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700"
                  >
                    通过为草稿
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleAction(candidate.id, "reject")}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600"
                  >
                    拒绝
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
