"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

interface TurnstileGateProps {
  initialVerified: boolean
}

export function TurnstileGate({ initialVerified }: TurnstileGateProps) {
  const turnstileRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const isDev = process.env.NODE_ENV !== "production"
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY
  const isBypassed = isDev || !siteKey

  const [isVerified, setIsVerified] = useState(initialVerified || isBypassed)
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">(
    initialVerified || isBypassed ? "verified" : "idle",
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const clearStateFn = useCallback(() => {
    if (isBypassed) {
      setIsVerified(true)
      setStatus("verified")
      setErrorMessage(null)
      return
    }

    setIsVerified(false)
    setStatus("idle")
    setErrorMessage(null)
  }, [isBypassed])

  const resetTurnstileFn = useCallback(() => {
    clearStateFn()

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [clearStateFn])

  useEffect(() => {
    if (initialVerified || isBypassed) {
      setIsVerified(true)
      setStatus("verified")
      setErrorMessage(null)
      return
    }

    const turnstileNode = turnstileRef.current

    if (!turnstileNode) {
      return
    }

    let cancelled = false
    let intervalId: number | undefined

    const renderTurnstile = () => {
      if (!window.turnstile || widgetIdRef.current) {
        return false
      }

      turnstileNode.innerHTML = ""
      widgetIdRef.current = window.turnstile.render(turnstileNode, {
        sitekey: siteKey,
        theme: "light",
        callback: async token => {
          setStatus("verifying")
          setErrorMessage(null)

          try {
            const response = await fetch("/api/turnstile/verify", {
              body: JSON.stringify({ token }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            })
            const responseBody = (await response.json().catch(() => ({}))) as { error?: string }

            if (!response.ok) {
              if (!cancelled) {
                setIsVerified(false)
                setStatus("error")
                setErrorMessage(responseBody.error ?? "Cloudflare verification failed. Please try again.")
                window.turnstile?.reset(widgetIdRef.current ?? undefined)
              }
              return
            }

            if (!cancelled) {
              setIsVerified(true)
              setStatus("verified")
            }
          } catch (_error) {
            if (!cancelled) {
              setIsVerified(false)
              setStatus("error")
              setErrorMessage("Robot check could not be completed right now.")
              window.turnstile?.reset(widgetIdRef.current ?? undefined)
            }
          }
        },
        "error-callback": () => {
          if (!cancelled) {
            setIsVerified(false)
            setStatus("error")
            setErrorMessage("Cloudflare Turnstile could not load correctly. Please try again.")
          }
        },
        "expired-callback": () => {
          if (!cancelled) {
            setIsVerified(false)
            setStatus("idle")
            setErrorMessage("Challenge expired. Please complete it again.")
            window.turnstile?.reset(widgetIdRef.current ?? undefined)
          }
        },
      })

      return true
    }

    if (!renderTurnstile()) {
      intervalId = window.setInterval(() => {
        if (renderTurnstile() && intervalId) {
          window.clearInterval(intervalId)
        }
      }, 250)
    }

    return () => {
      cancelled = true

      if (intervalId) {
        window.clearInterval(intervalId)
      }

      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }

      turnstileNode.innerHTML = ""
    }
  }, [initialVerified, isBypassed, siteKey])

  if (isBypassed || isVerified) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-background/92 px-4 py-6 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_42%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.16),transparent_30%)]" />
      <div className="relative w-full max-w-xl rounded-[28px] border bg-card/95 p-6 shadow-[0_28px_120px_rgba(0,0,0,0.24)] md:p-8">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Security Check</p>
          <h1 className="text-3xl font-semibold text-foreground">Verify before entering Jotion</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Complete the Cloudflare Turnstile challenge in full screen before using the workspace.
          </p>
        </div>

        <div className="mt-6 space-y-4 rounded-[24px] border bg-background/80 p-4">
          <div className="rounded-2xl border bg-card p-3 shadow-sm">
            <div ref={turnstileRef} className="min-h-[70px]" />
          </div>

          {status === "verifying" ? <p className="text-center text-sm text-primary">Verifying challenge...</p> : null}
          {status === "verified" ? <p className="text-center text-sm text-emerald-600">Verification complete.</p> : null}
          {errorMessage ? <p className="text-center text-sm text-destructive">{errorMessage}</p> : null}
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={resetTurnstileFn} type="button" variant="outline">
            Retry challenge
          </Button>
        </div>
      </div>
    </div>
  )
}
