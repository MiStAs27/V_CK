"use client"

import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => {
    window.removeEventListener("resize", callback)
  }
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false // For server-side rendering, default to desktop.
}

export function useIsMobile() {
  // useSyncExternalStore is the idiomatic way to subscribe to external, mutable
  // data sources to avoid hydration mismatches.
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
