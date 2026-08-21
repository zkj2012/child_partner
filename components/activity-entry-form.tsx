"use client";

import { useMemo, useState, type FormEvent } from "react";

type ActivityEntryFormProps = {
  secret: string;
};

const emptyForm = {
  sourceUrl: "",
  title: "",
  summary: "",
  category: "outing",
  district: "上海",
  durationMinutes: "60",
  materials: "",
  steps: "",
  safetyTips: "全程陪同\n注意适龄与防滑",
  tags: "fun,manual",
  publish: true,
};

export function ActivityEntryForm({ secret }: ActivityEntryFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdPath, setCreatedPath] = useState("");
  const [copied, setCopied] = useState(false);

  const absoluteLink = useMemo(() => {
    if (!createdPath || typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}${createdPath}`;
  }, [createdPath]);

  function updateField(key: keyof typeof emptyForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/admin/activities", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          durationMinutes: Number(form.durationMinutes),
        }),
      });

      const payload = (await response.json()) as {
        message?: string;
        activity?: { path: string; title: string };
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "保存失败");
      }

      setCreatedPath(payload.activity?.path ?? "");
      setForm(emptyForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "保存失败");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!absoluteLink) {
      return;
    }

    await navigator.clipboard.writeText(absoluteLink);
    setCopied(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-3xl bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
        看到好玩的笔记/活动页，先把链接贴进来当来源，再自己改写成适合 2 岁的玩法后发布。
        不会自动抓全文，保证内容质量由你把关。
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">来源链接（可粘贴）</span>
        <input
          value={form.sourceUrl}
          onChange={(event) => updateField("sourceUrl", event.target.value)}
          placeholder="https://..."
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">标题（要有钩子）</span>
        <input
          required
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="例如：客厅黑暗探险：手电筒找宝藏"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">简介</span>
        <textarea
          required
          value={form.summary}
          onChange={(event) => updateField("summary", event.target.value)}
          rows={3}
          placeholder="一句话说明为什么好玩、适不适合今天"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">类型</span>
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            <option value="outing">出去玩</option>
            <option value="craft">手工/假装玩</option>
            <option value="sport">运动放电</option>
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">区域</span>
          <input
            value={form.district}
            onChange={(event) => updateField("district", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">时长（分钟）</span>
          <input
            type="number"
            min={10}
            value={form.durationMinutes}
            onChange={(event) => updateField("durationMinutes", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">材料（一行一个）</span>
        <textarea
          value={form.materials}
          onChange={(event) => updateField("materials", event.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">怎么玩（一行一步）</span>
        <textarea
          value={form.steps}
          onChange={(event) => updateField("steps", event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">安全提醒（一行一条）</span>
        <textarea
          value={form.safetyTips}
          onChange={(event) => updateField("safetyTips", event.target.value)}
          rows={2}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.publish}
          onChange={(event) => updateField("publish", event.target.checked)}
        />
        保存后立刻上线（进入抽卡推荐）
      </label>

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white disabled:bg-slate-300"
      >
        {loading ? "保存中…" : "保存活动"}
      </button>

      {error ? (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {createdPath ? (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="font-semibold">已保存成功</div>
          <div className="mt-2 break-all">{absoluteLink || createdPath}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white"
            >
              {copied ? "已复制链接" : "复制详情链接"}
            </button>
            <a
              href={createdPath}
              className="rounded-full border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-800"
            >
              打开详情页
            </a>
          </div>
        </div>
      ) : null}
    </form>
  );
}
