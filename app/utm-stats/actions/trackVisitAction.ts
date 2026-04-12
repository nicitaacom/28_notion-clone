"use server"

import { headers } from "next/headers"
import supabaseAdmin from "@/libs/supabaseAdmin"

const extractUTMParams = (searchParams: { [key: string]: string | string[] | undefined } = {}) => ({
  utm_source: Array.isArray(searchParams.utm_source) ? searchParams.utm_source[0] : searchParams.utm_source,
  utm_medium: Array.isArray(searchParams.utm_medium) ? searchParams.utm_medium[0] : searchParams.utm_medium,
  utm_campaign: Array.isArray(searchParams.utm_campaign) ? searchParams.utm_campaign[0] : searchParams.utm_campaign,
  utm_term: Array.isArray(searchParams.utm_term) ? searchParams.utm_term[0] : searchParams.utm_term,
  utm_content: Array.isArray(searchParams.utm_content) ? searchParams.utm_content[0] : searchParams.utm_content,
})

export async function trackVisitAction(
  userId: string | undefined,
  searchParams: { [key: string]: string | string[] | undefined } = {},
) {
  if (!userId) return console.log(20, "no user id to track visit")
  const utmParams = extractUTMParams(searchParams)
  const hasUTMParams = Object.values(utmParams).some(param => param !== undefined)

  const today = new Date().toISOString().split("T")[0]
  const { data: recentVisit } = await supabaseAdmin
    .from("utm_stats")
    .select("id, visited_at")
    .eq("user_id", userId)
    .gte("visited_at", `${today}T00:00:00.000Z`)
    .lte("visited_at", `${today}T23:59:59.999Z`)
    .order("visited_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recentVisit) return

  const finalParams = hasUTMParams
    ? utmParams
    : {
        utm_source: "organic",
        utm_medium: "direct",
        utm_campaign: undefined,
        utm_term: undefined,
        utm_content: undefined,
      }

  const userAgent = headers().get("user-agent") ?? "unknown"
  const insertDBUTMVisitResponse = await insertDBUTMVisitAction(userId, finalParams, userAgent)
  if (typeof insertDBUTMVisitResponse === "string") console.log(52, "insert failed - ", insertDBUTMVisitResponse)
}

interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

async function insertDBUTMVisitAction(userId: string, utmParams: UTMParams, userAgent: string | null) {
  try {
    const { error } = await supabaseAdmin.from("utm_stats").insert({
      user_id: userId,
      visited_at: new Date().toISOString(),
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      user_agent: userAgent,
    })
    if (error) throw Error(error.message)
  } catch (error) {
    return `Error tracking UTM visit: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}
