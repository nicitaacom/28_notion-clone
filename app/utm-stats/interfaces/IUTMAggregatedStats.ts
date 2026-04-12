export interface IUTMAggregatedStats {
  totalVisits: number
  uniqueUsers: number
  sourceStats: Array<{ name: string; count: number }>
  mediumStats: Array<{ name: string; count: number }>
  campaignStats: Array<{ name: string; count: number }>
  recentVisits: number
  rawStats: Array<any>
  chartData: { date: string; visits: number }[]
}
