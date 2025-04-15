import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"

// Import our custom components
import LogsHeader from "./components/LogsHeader"
import LogsActivityChart from "./components/LogsActivityChart"
import LogsStats from "./components/LogsStats"
import LogsTabsContainer from "./components/LogsTabsContainer"

// Import PocketBase hooks
import { useCollection } from "@renderer/hooks/pbCollection"

export default function LogsPage() {
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    dateRange: {
      from: new Date(),
      to: new Date()
    }
  })

  // Fetch data from PocketBase collections
  const { data: loginLogs, loading: loginLogsLoading } = useCollection('login_logs', {
    sort: '-created',
    expand: 'user'
  })

  const { data: sessionSnacksLogs, loading: snacksLogsLoading } = useCollection('session_snacks_logs', {
    sort: '-created',
    expand: 'session,snack,session.device'
  })

  const { data: snacksLogs, loading: inventoryLogsLoading } = useCollection('snacks_logs', {
    sort: '-created',
    expand: 'snack_id,user'
  })

  const { data: sessionLogs, loading: sessionLogsLoading } = useCollection('session_logs', {
    sort: '-created',
    expand: 'session_id,billed_by'
  })

  // State for filtered logs
  const [filteredLogs, setFilteredLogs] = useState({
    loginLogs: [],
    snacksSalesLogs: [],
    snacksMaintenanceLogs: [],
    sessionLogs: []
  })

  // Process and format the data from PocketBase
  const processLoginLogs = (logs) => {
    if (!logs) return []
    return logs.map(log => ({
      user: log.expand?.user?.name || 'Unknown User',
      login: log?.login,
      logout: log?.logout,
      timestamp: log?.created,
    }))
  }

  // Process sales logs (session_snacks_logs)
  const processSnacksSalesLogs = (logs) => {
    if (!logs) return []
    return logs.map(log => ({
      item: log.expand?.snack?.name || 'Unknown Item',
      action: 'Sale',
      quantity: log.quantity || 0,
      price: `Rs. ${log.price}` || 0,
      status: '-',
      timestamp: log.created,
      order: `ORD_${log.session?.slice(0, 10)}` || 'Unknown User',
      details: `Sold ${log.quantity || 0} ${log.expand?.snack?.name || 'items'} for Rs. ${log.each_price || 0}`
    }))
  }

  // Process maintenance logs (snacks_logs)
  const processSnacksMaintenanceLogs = (logs) => {
    if (!logs) return []
    return logs.map(log => ({
      item: log.expand?.snack_id?.name || 'Unknown Item',
      activity: log.status || 'Stock Update',
      quantity: `${log.quantity || 0} pcs`,
      timestamp: log.created,
      user: log.expand?.user?.name || 'User',
      details: log.reason || `${log.status || 'Updated'} ${log.quantity || 0} items`
    }))
  }

  const processSessionLogs = (logs) => {
    if (!logs) return []
    return logs.map(log => ({
      'billed By': log.expand?.billed_by?.name || 'System',
      type: log.type || 'Session',
      amount: log.session_amount || 0,
      timestamp: log.created,
      details: `Session ${log.type || 'updated'} - Amount: ₹${log.session_amount || 0}`
    }))
  }

  // Generate chart data based on logs
  const generateChartData = useCallback(() => {
    // Skip if data is still loading
    if (loginLogsLoading || snacksLogsLoading || inventoryLogsLoading || sessionLogsLoading) {
      return [
        { hour: '00:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
        { hour: '04:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
        { hour: '08:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
        { hour: '12:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
        { hour: '16:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
        { hour: '20:00', logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      ]
    }

    // Initialize data structure
    const hourlyData = {
      '00:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      '04:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      '08:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      '12:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      '16:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
      '20:00': { logins: 0, snacksSales: 0, snacksMaintenance: 0, sessions: 0 },
    }

    // Count login logs by hour
    loginLogs?.forEach(log => {
      const date = new Date(log.created)
      const hour = date.getHours()
      let timeSlot = '00:00'

      if (hour >= 4 && hour < 8) timeSlot = '04:00'
      else if (hour >= 8 && hour < 12) timeSlot = '08:00'
      else if (hour >= 12 && hour < 16) timeSlot = '12:00'
      else if (hour >= 16 && hour < 20) timeSlot = '16:00'
      else if (hour >= 20) timeSlot = '20:00'

      hourlyData[timeSlot].logins++
    })

    // Count snacks sales logs by hour (session_snacks_logs)
    sessionSnacksLogs?.forEach(log => {
      const date = new Date(log.created)
      const hour = date.getHours()
      let timeSlot = '00:00'

      if (hour >= 4 && hour < 8) timeSlot = '04:00'
      else if (hour >= 8 && hour < 12) timeSlot = '08:00'
      else if (hour >= 12 && hour < 16) timeSlot = '12:00'
      else if (hour >= 16 && hour < 20) timeSlot = '16:00'
      else if (hour >= 20) timeSlot = '20:00'

      hourlyData[timeSlot].snacksSales++
    })

    // Count snacks maintenance logs by hour (snacks_logs)
    snacksLogs?.forEach(log => {
      const date = new Date(log.created)
      const hour = date.getHours()
      let timeSlot = '00:00'

      if (hour >= 4 && hour < 8) timeSlot = '04:00'
      else if (hour >= 8 && hour < 12) timeSlot = '08:00'
      else if (hour >= 12 && hour < 16) timeSlot = '12:00'
      else if (hour >= 16 && hour < 20) timeSlot = '16:00'
      else if (hour >= 20) timeSlot = '20:00'

      hourlyData[timeSlot].snacksMaintenance++
    })

    // Count session logs by hour
    sessionLogs?.forEach(log => {
      const date = new Date(log.created)
      const hour = date.getHours()
      let timeSlot = '00:00'

      if (hour >= 4 && hour < 8) timeSlot = '04:00'
      else if (hour >= 8 && hour < 12) timeSlot = '08:00'
      else if (hour >= 12 && hour < 16) timeSlot = '12:00'
      else if (hour >= 16 && hour < 20) timeSlot = '16:00'
      else if (hour >= 20) timeSlot = '20:00'

      hourlyData[timeSlot].sessions++
    })

    // Convert to array format for chart
    return Object.entries(hourlyData).map(([hour, counts]) => ({
      hour,
      logins: counts.logins,
      snacksSales: counts.snacksSales,
      snacksMaintenance: counts.snacksMaintenance,
      sessions: counts.sessions
    }))
  }, [loginLogs, sessionSnacksLogs, snacksLogs, sessionLogs, loginLogsLoading, snacksLogsLoading, inventoryLogsLoading, sessionLogsLoading])

  // Chart data for log activity
  const logActivityData = generateChartData()

  // Stats data with trends
  const statsData = {
    loginLogs: loginLogs?.length || 0,
    loginLogsTrend: 5,
    snacksSalesLogs: sessionSnacksLogs?.length || 0,
    snacksSalesLogsTrend: 10,
    snacksMaintenanceLogs: snacksLogs?.length || 0,
    snacksMaintenanceLogsTrend: 6,
    sessionLogs: sessionLogs?.length || 0,
    sessionLogsTrend: 12
  }

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  // Handle search changes
  const handleSearchChange = useCallback((searchQuery) => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery
    }))

    // Apply search filter if needed
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()

      // Process the logs
      const processedLoginLogs = processLoginLogs(loginLogs)
      const processedSnacksSalesLogs = processSnacksSalesLogs(sessionSnacksLogs || [])
      const processedSnacksMaintenanceLogs = processSnacksMaintenanceLogs(snacksLogs || [])
      const processedSessionLogs = processSessionLogs(sessionLogs)

      // Filter logs based on search query
      const filteredLoginLogs = processedLoginLogs.filter(log =>
        log.user?.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query))
      )

      const filteredSnacksSalesLogs = processedSnacksSalesLogs.filter(log =>
        log.item?.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query)) ||
        log.action?.toLowerCase().includes(query) ||
        log.user?.toLowerCase().includes(query)
      )

      const filteredSnacksMaintenanceLogs = processedSnacksMaintenanceLogs.filter(log =>
        log.item?.toLowerCase().includes(query) ||
        (log.details && log.details.toLowerCase().includes(query)) ||
        log.action?.toLowerCase().includes(query)
      )

      const filteredSessionLogs = processedSessionLogs.filter(log =>
        (log.user && log.user.toLowerCase().includes(query)) ||
        (log.details && log.details.toLowerCase().includes(query)) ||
        (log.type && log.type.toLowerCase().includes(query))
      )

      // Update the filtered logs state
      setFilteredLogs({
        loginLogs: filteredLoginLogs,
        snacksSalesLogs: filteredSnacksSalesLogs,
        snacksMaintenanceLogs: filteredSnacksMaintenanceLogs,
        sessionLogs: filteredSessionLogs
      })
    }
  }, [loginLogs, sessionSnacksLogs, snacksLogs, sessionLogs])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Reload the data from PocketBase
    window.location.reload()
    toast.success("Logs refreshed successfully")
  }, [])

  // Handle export
  const handleExport = useCallback(() => {
    // Create a CSV file with all logs
    const processedLoginLogs = processLoginLogs(loginLogs)
    const processedSnacksSalesLogs = processSnacksSalesLogs(sessionSnacksLogs || [])
    const processedSnacksMaintenanceLogs = processSnacksMaintenanceLogs(snacksLogs || [])
    const processedSessionLogs = processSessionLogs(sessionLogs)

    // Combine all logs
    const allLogs = [
      ...processedLoginLogs.map(log => ({ ...log, type: 'Login Log' })),
      ...processedSnacksSalesLogs.map(log => ({ ...log, type: 'Snacks Sales Log' })),
      ...processedSnacksMaintenanceLogs.map(log => ({ ...log, type: 'Snacks Maintenance Log' })),
      ...processedSessionLogs.map(log => ({ ...log, type: 'Session Log' }))
    ]

    // Sort by timestamp (newest first)
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    // Convert to CSV
    const headers = ['Type', 'ID', 'User', 'Action', 'Status', 'Timestamp', 'Details']
    const csvContent = [
      headers.join(','),
      ...allLogs.map(log => [
        log.type,
        log.id,
        log.user || '',
        log.action || log.type || '',
        log.status || '',
        new Date(log.timestamp).toLocaleString(),
        `"${(log.details || '').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `logs_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Logs exported successfully")
  }, [loginLogs, sessionSnacksLogs, snacksLogs, sessionLogs])

  // Process and filter logs based on date range and search
  useEffect(() => {
    // Skip if data is still loading
    if (loginLogsLoading || snacksLogsLoading || inventoryLogsLoading || sessionLogsLoading) {
      return
    }

    // Process the logs
    const processedLoginLogs = processLoginLogs(loginLogs)
    const processedSnacksSalesLogs = processSnacksSalesLogs(sessionSnacksLogs || [])
    const processedSnacksMaintenanceLogs = processSnacksMaintenanceLogs(snacksLogs || [])
    const processedSessionLogs = processSessionLogs(sessionLogs)

    // Apply date filtering if needed
    const fromDate = filters.dateRange.from
    const toDate = filters.dateRange.to

    // Set the time to include the full day
    fromDate.setHours(0, 0, 0, 0)
    toDate.setHours(23, 59, 59, 999)

    const filteredLoginLogs = processedLoginLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= fromDate && logDate <= toDate
    })

    const filteredSnacksSalesLogs = processedSnacksSalesLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= fromDate && logDate <= toDate
    })

    const filteredSnacksMaintenanceLogs = processedSnacksMaintenanceLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= fromDate && logDate <= toDate
    })

    const filteredSessionLogs = processedSessionLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= fromDate && logDate <= toDate
    })

    // Update the filtered logs state
    setFilteredLogs({
      loginLogs: filteredLoginLogs,
      snacksSalesLogs: filteredSnacksSalesLogs,
      snacksMaintenanceLogs: filteredSnacksMaintenanceLogs,
      sessionLogs: filteredSessionLogs
    })
  }, [loginLogs, sessionSnacksLogs, snacksLogs, sessionLogs, filters.dateRange, loginLogsLoading, snacksLogsLoading, inventoryLogsLoading, sessionLogsLoading])

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-background/80 min-h-screen">
      {/* Header */}
      <LogsHeader onRefresh={handleRefresh} onExport={handleExport} handleDateFilterChange={handleFilterChange} />

      {/* Stats Overview */}
      <LogsStats stats={statsData} />

      {/* Activity Chart */}
      <LogsActivityChart data={logActivityData} />

      {/* Logs Tabs and Tables */}
      <LogsTabsContainer
        loginLogs={filteredLogs.loginLogs}
        snacksSalesLogs={filteredLogs.snacksSalesLogs}
        snacksMaintenanceLogs={filteredLogs.snacksMaintenanceLogs}
        sessionLogs={filteredLogs.sessionLogs}
      />
    </div>
  )
}
