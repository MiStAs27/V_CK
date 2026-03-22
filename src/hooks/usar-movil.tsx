"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback)
  return () => {
    window.removeEventListener("resize", callback)
  }
}

const getSnapshot = () => {
  return window.innerWidth < MOBILE_BREAKPOINT
}

const getServerSnapshot = () => {
  return false // Always render the desktop layout on the server
}

export function useIsMobile() {
  // useSyncExternalStore is the recommended way to subscribe to external data sources
  // in a way that is compatible with server rendering and avoids hydration errors.
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
