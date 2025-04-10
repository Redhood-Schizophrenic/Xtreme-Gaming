"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import {
  Users,
  MonitorSmartphone,
  ShoppingBag,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  DollarSign
} from "lucide-react"

// Import Recharts components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

export default function StaticDashboardPage() {
  // Static data for the dashboard
  const stats = {
    totalUsers: 42,
    totalDevices: 15,
    activeDevices: 8,
    totalSnacks: 24,
    lowStockItems: 3,
    activeSessions: 6,
    totalRevenue: 1245.89
  }

  // Static data for active sessions
  const activeSessions = [
    { device_name: "PC-1", in_time: "2023-04-10T14:30:00", duration: "2h 15m" },
    { device_name: "PC-4", in_time: "2023-04-10T15:45:00", duration: "1h 00m" },
    { device_name: "PS-2", in_time: "2023-04-10T16:20:00", duration: "0h 25m" },
    { device_name: "PC-7", in_time: "2023-04-10T13:10:00", duration: "3h 35m" },
    { device_name: "PS-1", in_time: "2023-04-10T16:00:00", duration: "0h 45m" }
  ]

  // Static data for recent logins
  const recentLogins = [
    { user: { name: "John Doe", role: "Admin" }, login: "2023-04-10T16:30:00" },
    { user: { name: "Jane Smith", role: "Staff" }, login: "2023-04-10T15:45:00" },
    { user: { name: "Mike Johnson", role: "User" }, login: "2023-04-10T15:20:00" },
    { user: { name: "Sarah Williams", role: "User" }, login: "2023-04-10T14:55:00" },
    { user: { name: "David Brown", role: "Staff" }, login: "2023-04-10T14:30:00" }
  ]

  // Chart data
  const pieChartData = [
    { name: 'PC Stations', value: 65 },
    { name: 'PS Stations', value: 35 }
  ]

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 7000 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 8000 },
    { name: 'Jul', revenue: 10000 }
  ]

  const transactionData = [
    { name: 'Mon', sessions: 20, snacks: 10 },
    { name: 'Tue', sessions: 15, snacks: 12 },
    { name: 'Wed', sessions: 25, snacks: 15 },
    { name: 'Thu', sessions: 22, snacks: 20 },
    { name: 'Fri', sessions: 30, snacks: 22 },
    { name: 'Sat', sessions: 40, snacks: 30 },
    { name: 'Sun', sessions: 35, snacks: 25 }
  ]

  const userGrowthData = [
    { name: 'Jan', users: 10 },
    { name: 'Feb', users: 15 },
    { name: 'Mar', users: 20 },
    { name: 'Apr', users: 25 },
    { name: 'May', users: 35 },
    { name: 'Jun', users: 42 }
  ]

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin
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
              +12.5% from last month
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
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{session.device_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Started: {new Date(session.in_time).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {session.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
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
              <div className="space-y-4">
                {recentLogins.map((log, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{log.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.user.role}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(log.login).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest sales and bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="sessions" name="Gaming Sessions" fill="#8884d8" />
                  <Bar dataKey="snacks" name="Snack Sales" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
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
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userGrowthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="users" name="Total Users" stroke="#ff7300" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
