"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

/** 避免 SSR / 客户端 hydration 不一致导致手机白屏 */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
