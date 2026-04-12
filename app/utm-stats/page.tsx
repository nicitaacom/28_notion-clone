import { selectDBUTMStatsAction } from "./actions/selectDBUTMStatsAction"
import { UTMDashboard } from "./components/UTMDashboard"

export default async function UTMStatsPage() {
  const utmStatsResponse = await selectDBUTMStatsAction()

  if (typeof utmStatsResponse === "string") return <h1 className="text-danger text-2xl">{utmStatsResponse}</h1>
  else return <UTMDashboard utmStatsResponse={utmStatsResponse} />
}
