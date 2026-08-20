export const tagGroups = {
  scenes: {
    outing: ["park", "museum", "aquarium", "mall", "nature", "riverfront"],
    home: ["craft", "home", "sensory", "pretend-play", "music"],
    active: ["active", "gross-motor", "throwing", "vehicle", "parent-child"],
  },
  energy: {
    calm: ["calm", "observation", "sensory", "learning"],
    balanced: ["balanced", "parent-child", "scenery", "music"],
    active: ["active", "gross-motor", "throwing", "open-space"],
  },
  budget: {
    low: ["low-prep", "easy", "park", "home"],
    medium: ["museum", "aquarium", "nature"],
    high: ["experience"],
  },
} as const;

export const categoryLabels = {
  outing: "出去玩",
  craft: "手工小游戏",
  sport: "亲子运动",
};

export const feedbackCopy = {
  liked: "这张卡很对味",
  not_suitable: "这次不太适合",
  visited: "已经玩过了",
  reshuffle: "再来三个",
} as const;
