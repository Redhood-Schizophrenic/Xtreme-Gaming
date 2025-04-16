'use client'

import { useState, useMemo } from 'react'
import DateFilter from "../dashboard/components/DateFilter"
import ActiveUsersCard from "./components/ActiveUsersCard"
import PeakHoursChart from "./components/PeakHoursChart"
import RevenueOverviewChart from "./components/RevenueOverviewChart"
import TodaysSummary from "./components/TodaysSummary"
import TopSpendingUsers from "./components/TopSpendingUsers"
import OfferPerformanceTable from "./components/OfferPerformanceTable"
import { useCollection } from "@renderer/hooks/pbCollection"

export default function ReportsPage() {
  // State for date range filter
  const [dateRange, setDateRange] = useState(() => {
    // Initialize with today's date range
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    return {
      from: startOfDay,
      to: endOfDay
    }
  })

  // Fetch data from PocketBase collections
  const { data: sessions, loading: sessionsLoading } = useCollection('sessions', {
    sort: '-created',
    expand: 'device,customer'
  })

  const { data: sessionSnacksLogs, loading: snacksLogsLoading } = useCollection('session_snacks_logs', {
    sort: '-created',
    expand: 'session,snack,session.device'
  })

  const { data: customers, loading: customersLoading } = useCollection('customers', {
    sort: '-created'
  })

  const { data: snacks, loading: snacksLoading } = useCollection('snacks', {
    sort: '-created'
  })

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!sessions || !sessionSnacksLogs) return { sessions: [], sessionSnacksLogs: [] }

    const fromDate = dateRange.from.getTime()
    const toDate = dateRange.to.getTime()

    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.created).getTime()
      return sessionDate >= fromDate && sessionDate <= toDate
    })

    const filteredSnacksLogs = sessionSnacksLogs.filter(log => {
      const logDate = new Date(log.created).getTime()
      return logDate >= fromDate && logDate <= toDate
    })

    return { sessions: filteredSessions, sessionSnacksLogs: filteredSnacksLogs }
  }, [sessions, sessionSnacksLogs, dateRange])

  const handleDateFilterChange = (newDateRange) => {
    setDateRange(newDateRange)
  }

  // Loading state
  const isLoading = sessionsLoading || snacksLogsLoading || customersLoading || snacksLoading

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <div className="flex gap-2">
          <DateFilter onFilterChange={handleDateFilterChange} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-12">
        {/* Active Users Card */}
        <div className="col-span-12 md:col-span-3">
          <ActiveUsersCard
            sessions={filteredData.sessions}
            isLoading={isLoading}
          />
        </div>

        {/* Revenue Overview Chart */}
        <div className="col-span-12 md:col-span-6">
          <RevenueOverviewChart
            sessions={filteredData.sessions}
            sessionSnacksLogs={filteredData.sessionSnacksLogs}
            isLoading={isLoading}
          />
        </div>

        {/* Today's Summary */}
        <div className="col-span-12 md:col-span-3">
          <TodaysSummary
            sessions={filteredData.sessions}
            sessionSnacksLogs={filteredData.sessionSnacksLogs}
            isLoading={isLoading}
          />
        </div>

        {/* Peak Hours Chart */}
        <div className="col-span-12 md:col-span-3">
          <PeakHoursChart
            sessions={filteredData.sessions}
            isLoading={isLoading}
          />
        </div>

        {/* Top Spending Users */}
        <div className="col-span-12 md:col-span-9">
          <TopSpendingUsers
            sessions={filteredData.sessions}
            customers={customers}
            isLoading={isLoading}
          />
        </div>

        {/* Offer Performance Table */}
        <div className="col-span-12">
          <OfferPerformanceTable
            sessions={filteredData.sessions}
            sessionSnacksLogs={filteredData.sessionSnacksLogs}
            snacks={snacks}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
