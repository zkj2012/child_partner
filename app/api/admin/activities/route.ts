import { NextResponse } from "next/server";

import { isAuthorizedAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured, prisma } from "@/lib/db";

function slugify(input: string) {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return base || `activity-${Date.now()}`;
}

function splitLines(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "未配置 DATABASE_URL，无法写入数据库。" },
      { status: 503 },
    );
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const title = String(payload.title ?? "").trim();
  const summary = String(payload.summary ?? "").trim();
  const category = String(payload.category ?? "outing");
  const sourceUrl = String(payload.sourceUrl ?? "").trim() || null;

  if (!title || !summary) {
    return NextResponse.json(
      { message: "标题和简介不能为空。" },
      { status: 400 },
    );
  }

  if (!["outing", "craft", "sport"].includes(category)) {
    return NextResponse.json({ message: "活动类型不正确。" }, { status: 400 });
  }

  const materials = splitLines(payload.materials);
  const steps = splitLines(payload.steps);
  const safetyTips = splitLines(payload.safetyTips);
  const tags = splitLines(payload.tags);
  const recommendationRaw = splitLines(payload.recommendationReasons);

  const preferredSlug = String(payload.slug ?? "").trim() || slugify(title);
  let slug = preferredSlug;
  const existing = await prisma.activity.findUnique({ where: { slug } });
  if (existing) {
    slug = `${preferredSlug}-${Date.now().toString(36)}`;
  }

  const publish = payload.publish !== false;

  const activity = await prisma.activity.create({
    data: {
      slug,
      title,
      category: category as "outing" | "craft" | "sport",
      summary,
      minAgeMonths: Number(payload.minAgeMonths ?? 24),
      maxAgeMonths: Number(payload.maxAgeMonths ?? 48),
      durationMinutes: Number(payload.durationMinutes ?? 60),
      budgetLevel: String(payload.budgetLevel ?? "low"),
      indoorOutdoor: String(payload.indoorOutdoor ?? "indoor"),
      energyLevel: String(payload.energyLevel ?? "balanced"),
      preparationLevel: String(payload.preparationLevel ?? "easy"),
      distanceBand: String(payload.distanceBand ?? "near"),
      weatherTags: splitLines(payload.weather).length
        ? splitLines(payload.weather)
        : ["sunny", "cloudy", "rainy"],
      district: String(payload.district ?? "上海").trim() || "上海",
      locationHint:
        String(payload.locationHint ?? "").trim() ||
        "来自主动录入，建议出发前再确认开放信息。",
      materials: materials.length ? materials : ["按原文准备即可"],
      steps: steps.length ? steps : ["按你记录的玩法开始。", "注意观察孩子状态。", "适时收尾。"],
      safetyTips: safetyTips.length ? safetyTips : ["全程陪同。", "注意年龄匹配。"],
      recommendationRaw: recommendationRaw.length
        ? recommendationRaw
        : ["来自你主动收藏的好玩内容。"],
      tagList: tags.length ? tags : ["manual", category],
      source: "manual",
      sourceUrl,
      status: publish ? "published" : "draft",
      qualityScore: publish ? 88 : 60,
    },
  });

  return NextResponse.json({
    ok: true,
    activity: {
      slug: activity.slug,
      title: activity.title,
      status: activity.status,
      path: `/activities/${activity.slug}`,
    },
  });
}
