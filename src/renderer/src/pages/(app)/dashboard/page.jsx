"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { useCollection } from "@renderer/hooks/pbCollection"
import { useAuth } from "@renderer/contexts/AuthContext"
import {
  BarChart,
  LineChart,
  PieChart,
  Users,
  MonitorSmartphone,
  ShoppingBag,
  Clock,
  TrendingUp,
  Activity,
  DollarSign
} from "lucide-react"

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const { data: users } = useCollection('users')
  const { data: devices } = useCollection('devices')
  const { data: sessions } = useCollection('sessions')
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
        activeSessions: sessions.filter(session => !session.out_time).length,
        // This is a placeholder - you would calculate actual revenue from sessions and sales
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all user types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gaming Stations</CardTitle>
            <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeDevices} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSnacks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems} items low in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all sessions and sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different dashboard sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Currently active gaming sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.activeSessions > 0 ? (
                <div className="space-y-4">
                  {sessions
                    .filter(session => !session.out_time)
                    .slice(0, 5)
                    .map((session, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{session.device_name || 'Unknown Device'}</p>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(session.in_time).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {session.duration || 'Ongoing'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Activity className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No active sessions</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Station Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Station Usage</CardTitle>
              <CardDescription>
                Current utilization of gaming stations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <PieChart className="h-10 w-10" />
                <span>Station Usage Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Logins</CardTitle>
              <CardDescription>
                User login activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginLogs && loginLogs.length > 0 ? (
                <div className="space-y-4">
                  {loginLogs.slice(0, 5).map((log, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{log.expand?.user?.name || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.expand?.user?.role || 'User'}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.login).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No recent login activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest sales and bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-10 w-10" />
                <span>Transaction History Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <BarChart className="h-10 w-10" />
                <span>Revenue Analytics Chart</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <LineChart className="h-10 w-10" />
                <span>User Growth Chart</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
