"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { IoChevronDown, IoCalendar, IoTrendingUp } from "react-icons/io5"

import { IUTMAggregatedStats } from "../interfaces/IUTMAggregatedStats"

const CHART_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

// Managed by Grok 4

// Mock data generator based on selected period
const getMockData = (year: number, month: number): IUTMAggregatedStats => {
  // 1. Generate base multiplier based on month (0 = entire year)
  const monthMultipliers = [12, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4, 1.5, 1.2, 1.1, 0.9, 1.6, 1.8] // Index 0 = entire year
  const yearMultiplier = year === 2025 ? 1 : year === 2024 ? 0.85 : year === 2023 ? 0.7 : 0.6
  const baseMultiplier = monthMultipliers[month] * yearMultiplier

  // 2. Base numbers that will be multiplied
  const baseVisits = 1200
  const baseUsers = 800
  const baseRecent = 300

  // 3. Calculate totals
  const totalVisits = Math.round(baseVisits * baseMultiplier)
  const uniqueUsers = Math.round(baseUsers * baseMultiplier)
  const recentVisits = Math.round(baseRecent * baseMultiplier)

  // 4. Generate source stats with variation
  const sourceBases = [
    { name: "Google", base: 360 },
    { name: "Facebook", base: 240 },
    { name: "Twitter", base: 130 },
    { name: "LinkedIn", base: 80 },
  ]
  const sourceStats = sourceBases.map(source => ({
    name: source.name,
    count: Math.round(source.base * baseMultiplier * (0.8 + Math.random() * 0.4)),
  }))

  // 5. Generate medium stats with variation
  const mediumBases = [
    { name: "Organic", base: 470 },
    { name: "Paid", base: 290 },
    { name: "Social", base: 240 },
    { name: "Email", base: 100 },
  ]
  const mediumStats = mediumBases.map(medium => ({
    name: medium.name,
    count: Math.round(medium.base * baseMultiplier * (0.8 + Math.random() * 0.4)),
  }))

  // 6. Generate campaign stats with seasonal variations
  const campaigns =
    month === 0
      ? [
          "Summer Sale",
          "Winter Promo",
          "Black Friday",
          "Spring Launch",
          "Holiday Special",
          "Back to School",
          "Valentine's Day",
          "Easter Sale",
        ]
      : month <= 3
        ? ["Winter Promo", "Valentine's Day", "Spring Launch", "Easter Sale"]
        : month <= 6
          ? ["Spring Launch", "Summer Sale", "Back to School", "Mid-Year Sale"]
          : month <= 9
            ? ["Summer Sale", "Back to School", "Fall Collection", "Halloween Sale"]
            : ["Black Friday", "Holiday Special", "Winter Promo", "Cyber Monday"]

  const campaignStats = campaigns
    .map((name, index) => ({
      name,
      count: Math.round((100 + index * 50) * baseMultiplier * (0.7 + Math.random() * 0.6)),
    }))
    .sort((a, b) => b.count - a.count)

  // 7. Generate daily chart data for the selected period
  const chartData: { date: string; visits: number }[] = []
  if (month === 0) {
    // Entire year - generate monthly data points
    for (let m = 1; m <= 12; m++) {
      const date = new Date(year, m - 1, 15).toISOString().split("T")[0]
      const monthlyMultiplier = monthMultipliers[m] * yearMultiplier
      chartData.push({
        date,
        visits: Math.round(baseVisits * monthlyMultiplier * (0.8 + Math.random() * 0.4)),
      })
    }
  } else {
    // Specific month - generate daily data points
    const daysInMonth = new Date(year, month, 0).getDate()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split("T")[0]
      const dailyVariation = 0.7 + Math.random() * 0.6
      chartData.push({
        date,
        visits: Math.round((totalVisits / daysInMonth) * dailyVariation),
      })
    }
  }

  // 8. Generate raw stats with appropriate dates
  const sources = ["google", "facebook", "twitter", "linkedin", "direct"]
  const mediums = ["cpc", "social", "organic", "email", "none"]
  const rawStats = Array.from({ length: Math.min(20, Math.round(baseMultiplier * 5)) }, _ => ({
    utm_source: sources[Math.floor(Math.random() * sources.length)],
    utm_medium: mediums[Math.floor(Math.random() * mediums.length)],
    utm_campaign: campaigns[Math.floor(Math.random() * campaigns.length)] || "",
    visited_at: chartData[Math.floor(Math.random() * chartData.length)]?.date || new Date().toISOString().split("T")[0],
  }))

  return {
    totalVisits,
    uniqueUsers,
    recentVisits,
    sourceStats,
    mediumStats,
    campaignStats: campaignStats.slice(0, 8),
    rawStats,
    chartData,
  }
}

// Generate smooth curved path connecting all points
const generateSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return ""
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`

  // For 2 points, use a simple line
  if (points.length === 2) {
    return `${path} L ${points[1].x} ${points[1].y}`
  }

  // For 3+ points, use smooth curves
  for (let i = 1; i < points.length; i++) {
    const current = points[i]
    const previous = points[i - 1]

    if (i === 1) {
      // First curve - use quadratic
      const midX = (previous.x + current.x) / 2
      const midY = (previous.y + current.y) / 2
      path += ` Q ${midX} ${previous.y}, ${midX} ${midY}`
      path += ` Q ${midX} ${current.y}, ${current.x} ${current.y}`
    } else {
      // Subsequent curves - use smooth cubic
      const cp1x = previous.x + (current.x - previous.x) * 0.3
      const cp1y = previous.y
      const cp2x = current.x - (current.x - previous.x) * 0.3
      const cp2y = current.y
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${current.x} ${current.y}`
    }
  }

  return path
}

// Generate Y-axis ticks
const generateYTicks = (maxValue: number): number[] => {
  if (maxValue === 0) return [0, 100, 200, 300, 400, 500]
  const tickCount = 5
  const step = Math.ceil(maxValue / tickCount)
  const roundedStep =
    Math.pow(10, Math.floor(Math.log10(step))) * Math.ceil(step / Math.pow(10, Math.floor(Math.log10(step))))
  const ticks = []
  for (let i = 0; i <= Math.ceil(maxValue / roundedStep); i++) {
    ticks.push(i * roundedStep)
  }
  return ticks
}

function DailyVisitsChart({ data }: { data: { date: string; visits: number }[] }) {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; visits: number; date: string } | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-subTitle">
        <IoTrendingUp className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm opacity-75">Chart data will appear here</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.visits))
  const yTicks = generateYTicks(maxValue)
  const maxYValue = Math.max(...yTicks)

  const chartHeight = 260
  const chartWidth = 760

  // 1. Calculate points for the line chart
  const points = data.map((day, index) => {
    const x = index * (chartWidth / Math.max(data.length - 1, 1))
    const y = chartHeight - (day.visits / maxYValue) * chartHeight
    return { x, y, visits: day.visits, date: day.date }
  })

  const pathData = generateSmoothPath(points)

  return (
    <div className="bg-background/40 backdrop-blur-sm rounded-lg border border-border-color/20 p-4 relative overflow-hidden">
      <div className="h-80 flex relative">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between pr-4 py-8 w-20">
          {yTicks
            .slice()
            .reverse()
            .map(tick => (
              <div key={tick} className="text-sm text-title/60 font-medium text-right leading-none">
                {tick.toLocaleString()}
              </div>
            ))}
        </div>

        {/* Chart Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full relative">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {yTicks.map(tick => (
                <div
                  key={tick}
                  className="absolute w-full border-t border-border-color/10"
                  style={{ bottom: `${(tick / maxYValue) * 100}%` }}
                />
              ))}
            </div>

            {/* Chart SVG */}
            <div className="h-full relative py-8">
              <div className="absolute inset-0 w-full h-full">
                <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} 320`} preserveAspectRatio="none">
                  <defs>
                    <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
                    </filter>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="hsl(var(--info))" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Line */}
                  <motion.path
                    d={pathData}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.9 }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Data Points */}
                  {points.map((point, index) => (
                    <motion.circle
                      key={`point-${index}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="hsl(var(--brand))"
                      stroke="hsl(var(--background))"
                      strokeWidth="1"
                      filter="url(#dotShadow)"
                      style={{ filter: "blur(0.5px) drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                  ))}

                  {/* Hover Tooltip */}
                  {hoveredPoint && (
                    <g>
                      {/* Tooltip Background */}
                      <motion.rect
                        x={hoveredPoint.x - 60}
                        y={hoveredPoint.y - 55}
                        width="120"
                        height="40"
                        rx="6"
                        fill="hsl(var(--foreground))"
                        stroke="hsl(var(--border-color))"
                        strokeWidth="1"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      {/* Tooltip Text - Visits */}
                      <text
                        x={hoveredPoint.x}
                        y={hoveredPoint.y - 35}
                        textAnchor="middle"
                        fill="hsl(var(--title))"
                        fontSize="12"
                        fontWeight="bold">
                        {hoveredPoint.visits.toLocaleString()}
                      </text>
                      {/* Tooltip Text - Date */}
                      <text
                        x={hoveredPoint.x}
                        y={hoveredPoint.y - 20}
                        textAnchor="middle"
                        fill="hsl(var(--subTitle))"
                        fontSize="10">
                        {new Date(hoveredPoint.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UTMDashboard({ utmStatsResponse }: { utmStatsResponse: IUTMAggregatedStats }) {
  // 1. State management for date selection
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(1) // Changed to 1 (January) instead of 0
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentData, setCurrentData] = useState<IUTMAggregatedStats | null>(null)
  const [forceRender, setForceRender] = useState(0) // Force re-render trigger

  // 2. Initialize data on component mount
  useEffect(() => {
    const initialData = utmStatsResponse.totalVisits > 0 ? utmStatsResponse : getMockData(selectedYear, selectedMonth)
    setCurrentData(initialData)
  }, [utmStatsResponse, selectedYear, selectedMonth])

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

  // 3. Date handling functions
  const months = [
    "Entire Year",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: 6 }, (_, i) => 2025 - i)

  const handleDateChange = async (year: number, month: number) => {
    setIsAnimating(true)
    setSelectedYear(year)
    setSelectedMonth(month)
    setIsDatePickerOpen(false)

    // 4. Simulate data fetch and force re-render
    setTimeout(() => {
      // Refresh data based on new date selection
      const refreshedData = utmStatsResponse.totalVisits > 0 ? utmStatsResponse : getMockData(year, month)
      setCurrentData(refreshedData)
      setIsAnimating(false)
      setForceRender(prev => prev + 1) // Force component re-render
    }, 300)
  }

  // 5. Empty state component
  const EmptyState = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-subTitle">
      <IoTrendingUp className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-lg font-medium">No data available</p>
      <p className="text-sm opacity-75">{title} data will appear here</p>
    </div>
  )

  // Don't render until data is loaded
  if (!currentData) return null

  const stats = currentData

  return (
    <div className="min-h-screen bg-background p-4 mobile:p-6">
      <motion.div
        key={forceRender} // Force re-render when this changes
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto">
        {/* Header with Date Picker */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col mobile:flex-row mobile:items-center mobile:justify-between gap-4">
            <div>
              <h1 className="text-3xl mobile:text-4xl font-bold text-title mb-2">UTM Analytics Dashboard</h1>
              <p className="text-subTitle">
                Track your marketing campaign performance {utmStatsResponse.totalVisits === 0 ? "(mock data)" : ""}
              </p>
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="bg-brand text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
                <IoCalendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {months[selectedMonth]} {selectedYear}
                </span>
                <IoChevronDown className={`w-4 h-4 transition-transform ${isDatePickerOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isDatePickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 bg-foreground border border-border-color rounded-lg shadow-xl z-50 min-w-[200px]">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="text-xs font-medium text-subTitle mb-2 block">Year</label>
                        <div className="grid grid-cols-3 gap-1">
                          {years.map(year => (
                            <button
                              key={year}
                              onClick={() => handleDateChange(year, selectedMonth)}
                              className={`px-2 py-1 text-sm rounded transition-colors ${
                                year === selectedYear ? "bg-brand text-white" : "text-title hover:bg-active-color"
                              }`}>
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-subTitle mb-2 block">Period</label>
                        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-border-color scrollbar-track-transparent">
                          {months.map((month, index) => (
                            <button
                              key={index}
                              onClick={() => handleDateChange(selectedYear, index)}
                              className={`px-2 py-1 text-sm text-left rounded transition-colors ${
                                index === selectedMonth ? "bg-brand text-white" : "text-title hover:bg-active-color"
                              }`}>
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 mobile:grid-cols-2 laptop:grid-cols-4 gap-4 mobile:gap-6 mb-8">
          {[
            { title: "Total Visits", value: stats.totalVisits, bgClass: "bg-brand text-white" },
            {
              title: "Unique Users",
              value: stats.uniqueUsers,
              bgClass: "bg-foreground text-title border border-border-color",
            },
            { title: "Recent Visits (30d)", value: stats.recentVisits, bgClass: "bg-info text-white" },
            {
              title: "Campaigns",
              value: stats.campaignStats.length,
              bgClass: "bg-foreground text-title border border-border-color",
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className={`${metric.bgClass} p-4 mobile:p-6 rounded-xl shadow-lg`}>
              <h3 className="text-xs mobile:text-sm font-medium opacity-90">{metric.title}</h3>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="text-2xl mobile:text-3xl font-bold mt-2">
                {isAnimating ? "..." : metric.value.toLocaleString()}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 mobile:gap-8">
          {/* UTM Sources Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-foreground border border-border-color p-4 mobile:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg mobile:text-xl font-bold text-title mb-4">Traffic Sources</h3>
            {stats.sourceStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.sourceStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-color) / 0.3)" />
                  <XAxis dataKey="name" stroke="hsl(var(--subTitle))" fontSize={12} />
                  <YAxis stroke="hsl(var(--subTitle))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--foreground))",
                      border: "1px solid hsl(var(--border-color))",
                      borderRadius: "8px",
                      color: "hsl(var(--title))",
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="Traffic sources" />
            )}
          </motion.div>

          {/* UTM Medium Pie Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-foreground border border-border-color p-4 mobile:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg mobile:text-xl font-bold text-title mb-4">Traffic Medium</h3>
            {stats.mediumStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.mediumStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    labelLine={false}
                    label={(props: any) => {
                      const percent = props.percent || 0
                      return `${props.name}: ${(percent * 100).toFixed(0)}%`
                    }}>
                    {stats.mediumStats.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--foreground))",
                      border: "1px solid hsl(var(--border-color))",
                      borderRadius: "8px",
                      color: "hsl(var(--title))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="Traffic medium" />
            )}
          </motion.div>
        </motion.div>

        {/* Daily Visits Chart - Full Width */}
        <motion.div
          variants={itemVariants}
          className="bg-foreground border border-border-color p-4 mobile:p-6 rounded-xl shadow-lg mt-6 mobile:mt-8">
          <h3 className="text-lg mobile:text-xl font-bold text-title mb-4">
            {selectedMonth === 0 ? "Monthly Visits Trend" : "Daily Visits"}
          </h3>
          <DailyVisitsChart data={stats.chartData || []} />
        </motion.div>
      </motion.div>
    </div>
  )
}
