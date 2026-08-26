import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "今天带娃抽什么",
  description: "已迁移到 /play，打开即可直接抽卡。",
};

/** 保留旧链接，统一跳到可分享的日常抽卡入口 */
export default function AskPage() {
  redirect("/play");
}
