"use client"

import { useEffect } from "react"
import { trackVisitAction } from "./actions/trackVisitAction"

export function UTMTracker({ userId }: { userId: string | undefined }) {
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries())
    // even if it's no params - still track visit as organic

    async function trackVisit() {
      await trackVisitAction(userId, params)
      const url = window.location.origin + window.location.pathname
      window.history.replaceState({}, "", url)
    }

    trackVisit()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
