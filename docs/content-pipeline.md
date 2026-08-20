# 内容积累流水线

本文说明活动数据如何从「手工维护」逐步升级为「定时抓取 + 人工审核 + 正式发布」。

## 当前架构

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  静态种子数据    │────▶│  PostgreSQL       │────▶│  推荐 / 抽卡     │
│ data/activities │     │  Activity 表      │     │  lib/recommend  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               ▲
                               │
┌─────────────────┐     ┌──────────────────┐
│  Open-Meteo     │────▶│ ActivityCandidate │───▶ 人工审核 ──▶ draft Activity
│  (天气)         │     │  (待审核候选)      │
└─────────────────┘     └──────────────────┘
                               ▲
┌─────────────────┐            │
│  高德地图 POI   │────────────┘
│  (可选)         │
└─────────────────┘
```

## 数据分层

| 层级 | 说明 |
|------|------|
| `data/activities.ts` | 兜底静态内容，没配数据库时直接使用 |
| `Activity` | 已发布 / 草稿的正式活动 |
| `ActivityCandidate` | 网络抓取的候选，默认 `pending` |
| `WeatherSnapshot` | 上海天气快照，供后续推荐加权 |
| `IngestRun` | 每次定时任务的执行日志 |

## 本地启动数据库流程

1. 复制环境变量：

```bash
cp .env.example .env
```

2. 填写 `DATABASE_URL`，指向本地或云端 PostgreSQL。

3. 同步表结构并导入种子：

```bash
npm run db:push
npm run db:seed
```

4. 启动站点：

```bash
npm run dev
```

配置数据库后，推荐会优先读 `Activity` 表中 `status = published` 的内容；数据库为空或连接失败时，自动回退到静态文件。

## 定时抓取

### 手动执行

```bash
npm run ingest
```

### 线上 Cron（Vercel）

部署后，`vercel.json` 会在 **每天 22:00 UTC（北京时间次日 06:00）** 调用：

```
GET /api/cron/ingest
Authorization: Bearer <CRON_SECRET>
```

### 抓取内容

1. **天气（Open-Meteo，免费无需 Key）**
   - 写入 `WeatherSnapshot`
   - 后续可用于：雨天优先室内、高温优先短时长活动

2. **地点候选（高德地图，需 `AMAP_API_KEY`）**
   - 搜索关键词：亲子公园、儿童博物馆、亲子乐园、动物园
   - 写入 `ActivityCandidate`，状态为 `pending`
   - **不会自动上线**，避免低质量内容直接进入推荐

## 审核候选并上线

候选通过后，可调用 `approveCandidate(id)` 生成 `status = draft` 的活动，再人工补充步骤和安全提示，改为 `published`。

后续可加一个简单的 `/admin` 审核页；当前可通过 Prisma Studio：

```bash
npx prisma studio
```

## 推荐逻辑与反馈

- 用户反馈写入 `FeedbackEvent`（按 `activitySlug` 关联）
- 反馈仍会在客户端 `localStorage` 缓存，用于即时调整排序
- 数据库中的反馈可用于长期分析

## 建议的迭代顺序

1. ✅ 静态内容 + 数据库双通道
2. ✅ 天气 + POI 定时抓取骨架
3. 🔜 管理后台：浏览 `pending` 候选、一键发布
4. 🔜 推荐引擎读取最新天气，动态加权 indoor/outdoor
5. 🔜 用户反馈聚合，自动降低低分活动权重

## 数据源说明

| 来源 | 费用 | 用途 |
|------|------|------|
| Open-Meteo | 免费 | 上海天气 |
| 高德地图 Web 服务 | 需申请 Key | 上海 POI 候选 |
| 手工维护 | - | 高质量玩法、步骤、安全提示 |

**不建议**直接爬小红书/点评内容：版权风险高、结构混乱、2 岁娃内容质量难保证。更好的做法是：地图 API 发现「去哪里」，玩法细节仍由家长向内容维护。
