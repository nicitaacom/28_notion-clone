import { NextResponse } from "next/server"

import { TURNSTILE_COOKIE_MAX_AGE, TURNSTILE_COOKIE_NAME, TURNSTILE_COOKIE_VALUE } from "@/lib/turnstile"

interface TurnstileVerifyResponse {
  success: boolean
  "error-codes"?: string[]
}

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { token } = ((await request.json().catch(() => ({}))) as { token?: string }) ?? {}
    const cleanToken = token?.trim()

    if (!cleanToken) {
      return NextResponse.json({ error: "Please complete the Cloudflare challenge first." }, { status: 400 })
    }

    if (!process.env.TURNSTILE_SECRET_KEY) {
      return NextResponse.json({ error: "Turnstile secret key is missing." }, { status: 500 })
    }

    const formData = new FormData()
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY)
    formData.append("response", cleanToken)

    const remoteIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

    if (remoteIp) {
      formData.append("remoteip", remoteIp)
    }

    const cloudflareResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST",
    })
    const cloudflareBody = (await cloudflareResponse.json()) as TurnstileVerifyResponse

    if (!cloudflareBody.success) {
      return NextResponse.json(
        {
          error: "Cloudflare verification failed. Please try the challenge again.",
          codes: cloudflareBody["error-codes"] ?? [],
        },
        { status: 400 },
      )
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      httpOnly: true,
      maxAge: TURNSTILE_COOKIE_MAX_AGE,
      name: TURNSTILE_COOKIE_NAME,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      value: TURNSTILE_COOKIE_VALUE,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify the Cloudflare challenge." },
      { status: 500 },
    )
  }
}
