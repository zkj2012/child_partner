import type { DailyKey, ProfileKey, PromptConfig } from "@/lib/types";

/** 只需填写一次：孩子与家庭基础偏好 */
export const profilePrompts: PromptConfig<ProfileKey>[] = [
  {
    id: "ageGroup",
    question: "宝宝现在大概处在哪个年龄段？",
    options: [
      { value: "18-24", label: "1.5-2 岁", hint: "更重视安全、节奏和感官体验" },
      { value: "24-36", label: "2-3 岁", hint: "喜欢模仿、跑跳和重复游戏" },
      { value: "36-60", label: "3-5 岁", hint: "可以接受更完整的任务和规则" },
    ],
  },
  {
    id: "energy",
    question: "孩子平时更偏哪种节奏？",
    options: [
      { value: "calm", label: "安静观察型", hint: "喜欢慢慢看、轻互动" },
      { value: "balanced", label: "有互动但别太累", hint: "动静结合最舒服" },
      { value: "active", label: "爱跑爱跳", hint: "需要更多放电机会" },
    ],
  },
  {
    id: "travelRadius",
    question: "出门的话，你们家通常愿意跑多远？",
    options: [
      { value: "near", label: "尽量近一点", hint: "优先家附近和商圈" },
      { value: "mid", label: "市区 30-40 分钟内", hint: "适合经典城市亲子点" },
      { value: "far", label: "愿意去近郊", hint: "可以考虑公园、农场、自然场景" },
    ],
  },
  {
    id: "budget",
    question: "你们家带娃预算通常更偏向哪种？",
    options: [
      { value: "low", label: "尽量省一点", hint: "公园、居家、低材料成本" },
      { value: "medium", label: "中等都可以", hint: "可以接受门票或简单材料" },
      { value: "high", label: "体验优先", hint: "不特别限制预算" },
    ],
  },
];

/** 每次抽卡前询问：今天想怎么带娃 */
export const dailyPrompts: PromptConfig<DailyKey>[] = [
  {
    id: "scene",
    question: "今天想怎么带娃？",
    options: [
      { value: "outing", label: "出去转转", hint: "优先上海周边地点" },
      { value: "home", label: "就在家里玩", hint: "优先手工和居家活动" },
      { value: "active", label: "最好能放电", hint: "优先运动和高互动玩法" },
    ],
  },
  {
    id: "duration",
    question: "今天大概有多久？",
    options: [
      { value: "short", label: "30 分钟左右", hint: "轻量活动，快速开始" },
      { value: "half", label: "半天", hint: "适合一段完整安排" },
      { value: "long", label: "大半天", hint: "适合外出或自然探索" },
    ],
  },
];

/** @deprecated 使用 profilePrompts + dailyPrompts */
export const prompts = [...profilePrompts, ...dailyPrompts];
