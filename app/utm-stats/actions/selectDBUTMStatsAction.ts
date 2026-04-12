"use server"

import { IUTMAggregatedStats } from "../interfaces/IUTMAggregatedStats"
import supabaseAdmin from "@/libs/supabaseAdmin"

/**
 * Fetches raw UTM stats from the database as an array of objects matching the IDBUTMStats structure
 * (each with fields like id, user_id, visited_at, utm_source, etc.).
 * Processes this data to compute aggregates: total visits, unique users, grouped counts for sources/mediums/campaigns,
 * recent visits in last 30 days, and a slice of raw stats.
 * Returns an aggregated object with these computed values if successful, or a string error message on failure.
 * Note: The return type differs from the raw database type - it's a custom aggregated stats object for dashboard use.
 */
export async function selectDBUTMStatsAction(): Promise<IUTMAggregatedStats | string> {
  try {
    // 1. Get all UTM stats
    const { data: stats, error } = await supabaseAdmin
      .from("utm_stats")
      .select("*")
      .order("visited_at", { ascending: false })
    if (error) return `Error fetching UTM stats: ${error.message}`
    // 2. Calculate aggregated data
    const totalVisits = stats?.length || 0
    if (!totalVisits)
      return {
        totalVisits: 0,
        uniqueUsers: 0,
        recentVisits: 0,
        sourceStats: [],
        mediumStats: [],
        campaignStats: [],
        rawStats: [],
        chartData: [],
      }
    const uniqueUsers = new Set(stats.map(stat => stat.user_id)).size
    const sourceStatsObj = stats.reduce((acc: { [key: string]: number }, stat) => {
      const source = stat.utm_source || "direct"
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})
    const mediumStatsObj = stats.reduce((acc: { [key: string]: number }, stat) => {
      const medium = stat.utm_medium || "none"
      acc[medium] = (acc[medium] || 0) + 1
      return acc
    }, {})
    const campaignStatsObj = stats.reduce((acc: { [key: string]: number }, stat) => {
      const campaign = stat.utm_campaign || "no-campaign"
      acc[campaign] = (acc[campaign] || 0) + 1
      return acc
    }, {})
    // 3. Get recent visits (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentVisitsArray = stats.filter(stat => new Date(stat.visited_at) >= thirtyDaysAgo)
    const recentVisits = recentVisitsArray.length

    // 4. Compute chartData (daily visits)
    const chartDataMap = new Map<string, number>()
    for (const stat of stats) {
      const date = new Date(stat.visited_at).toISOString().split("T")[0]
      chartDataMap.set(date, (chartDataMap.get(date) || 0) + 1)
    }
    const chartData = Array.from(chartDataMap, ([date, visits]) => ({ date, visits })).sort((a, b) =>
      a.date.localeCompare(b.date),
    )

    const toArray = (obj: { [key: string]: number }): { name: string; count: number }[] =>
      Object.entries(obj).map(([name, count]) => ({ name, count }))
    return {
      totalVisits,
      uniqueUsers,
      sourceStats: toArray(sourceStatsObj),
      mediumStats: toArray(mediumStatsObj),
      campaignStats: toArray(campaignStatsObj),
      recentVisits,
      rawStats: stats.slice(0, 10),
      chartData,
    }
  } catch (error) {
    return `Error processing UTM stats: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}
