import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { useCollection } from "@renderer/hooks/pbCollection"
import { useAuth } from "@renderer/contexts/AuthContext"

// Import components
import StatsOverview from "./components/StatsOverview"
import ActiveSessions from "./components/ActiveSessions"
import RecentLogins from "./components/RecentLogins"
import TransactionChart from "./components/TransactionChart"
import RevenueChart from "./components/RevenueChart"
import UserGrowthChart from "./components/UserGrowthChart"
import DeviceUsageChart from "./components/DeviceUsageChart"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const { data: users } = useCollection('users')
  const { data: devices } = useCollection('devices')
  const { data: sessions } = useCollection('sessions', {
    expand: 'device'
  })
  const { data: snacks } = useCollection('snacks')
  const { data: loginLogs } = useCollection('login_logs', { sort: '-created', expand: 'user' })

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    activeDevices: 0,
    totalSnacks: 0,
    lowStockItems: 0,
    activeSessions: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    // Calculate dashboard stats
    if (users && devices && snacks && sessions) {
      setStats({
        totalUsers: users.length,
        totalDevices: devices.length,
        activeDevices: devices.filter(device => device.status === 'Occupied').length,
        totalSnacks: snacks.length,
        lowStockItems: snacks.filter(snack => snack.status === 'Low Stock').length,
        // activeSessions: sessions.filter(session => !session.out_time).length,
        activeSessions: sessions.length,
        totalRevenue: sessions.reduce((total, session) => total + (session.amount || 0), 0)
      })
    }
  }, [users, devices, snacks, sessions])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name || 'User'}
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Tabs for different dashboard sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 grid grid-cols-3 gap-4">
          {/* Station Usage */}
          <DeviceUsageChart devices={devices} className='col-span-2' />

          {/* Active Sessions */}
          <ActiveSessions sessions={sessions} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <RecentLogins loginLogs={loginLogs} />

          <TransactionChart sessions={sessions} snacks={snacks} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <RevenueChart sessions={sessions} />

          <UserGrowthChart users={users} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
