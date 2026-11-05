export type ChoiceTone = "brave" | "cozy" | "care" | "oops";

export type SceneId =
  | "metro-morning"
  | "metro-platform"
  | "metro-walk"
  | "metro-wind"
  | "metro-safe"
  | "metro-seat"
  | "metro-sit"
  | "metro-thanks"
  | "metro-carry"
  | "metro-tunnel"
  | "metro-look"
  | "metro-map"
  | "metro-window"
  | "toy-yard"
  | "toy-ask"
  | "toy-share"
  | "toy-choice"
  | "toy-turns"
  | "toy-road"
  | "toy-cry"
  | "toy-police"
  | "toy-sorry"
  | "toy-mend"
  | "toy-bye"
  | "feel-play"
  | "feel-fall"
  | "feel-choose"
  | "feel-listen"
  | "feel-hurt"
  | "feel-ride"
  | "feel-tell"
  | "feel-hug"
  | "feel-build"
  | "feel-hit"
  | "feel-ambulance"
  | "feel-hospital"
  | "feel-sorry";

export type StoryConcept = {
  zh: string;
  en: string;
  note: string;
};

export type StoryChoice = {
  id: string;
  label: string;
  hint: string;
  next: string;
  tone: ChoiceTone;
};

export type StoryEnding = {
  tone: "warm" | "repair";
  badge: string;
};

export type StoryBeat = {
  id: string;
  scene: SceneId;
  kicker: string;
  title: string;
  narration: string;
  concept?: StoryConcept;
  choices?: StoryChoice[];
  next?: string;
  redo?: {
    label: string;
    to: string;
  };
  ending?: StoryEnding;
  parentNote?: string;
  video?: string;
};

export type Story = {
  id: string;
  title: string;
  subtitle: string;
  blurb: string;
  minutes: string;
  age: string;
  fork: string;
  wash: string;
  chipClass: string;
  cover: SceneId;
  coverVideo?: string;
  start: string;
  beats: Record<string, StoryBeat>;
};
