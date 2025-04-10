"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { Input } from "@renderer/components/ui/input"
import { Button } from "@renderer/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@renderer/components/ui/table_1"
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
  ResponsiveContainer
} from "recharts"
import {
  Search,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  UserCheck,
  ShoppingCart,
  Monitor,
  Shield
} from "lucide-react"

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("today")
  const [selectedLogType, setSelectedLogType] = useState("all")

  // Static data for logs
  const userLogs = [
    { id: 1, user: "John Doe", action: "Login", status: "Success", timestamp: "2023-04-10T16:30:00", ip: "192.168.1.101", details: "Login from Chrome on Windows" },
    { id: 2, user: "Jane Smith", action: "Password Change", status: "Success", timestamp: "2023-04-10T15:45:00", ip: "192.168.1.102", details: "Password changed successfully" },
    { id: 3, user: "Mike Johnson", action: "Login", status: "Failed", timestamp: "2023-04-10T15:20:00", ip: "192.168.1.103", details: "Invalid password attempt" },
    { id: 4, user: "Sarah Williams", action: "Profile Update", status: "Success", timestamp: "2023-04-10T14:55:00", ip: "192.168.1.104", details: "Updated contact information" },
    { id: 5, user: "David Brown", action: "Logout", status: "Success", timestamp: "2023-04-10T14:30:00", ip: "192.168.1.105", details: "User logged out" },
    { id: 6, user: "Emily Davis", action: "Login", status: "Success", timestamp: "2023-04-10T13:45:00", ip: "192.168.1.106", details: "Login from Firefox on MacOS" },
    { id: 7, user: "Robert Wilson", action: "Password Reset", status: "Success", timestamp: "2023-04-10T13:15:00", ip: "192.168.1.107", details: "Password reset via email" },
    { id: 8, user: "Lisa Taylor", action: "Login", status: "Failed", timestamp: "2023-04-10T12:50:00", ip: "192.168.1.108", details: "Account locked after multiple attempts" },
    { id: 9, user: "Alex Johnson", action: "Account Creation", status: "Success", timestamp: "2023-04-10T12:30:00", ip: "192.168.1.109", details: "New user account created" },
    { id: 10, user: "Michael Chen", action: "Role Change", status: "Success", timestamp: "2023-04-10T12:15:00", ip: "192.168.1.110", details: "User role changed from User to Staff" },
    { id: 11, user: "Jessica Lee", action: "Login", status: "Success", timestamp: "2023-04-10T11:45:00", ip: "192.168.1.111", details: "Login from Safari on iPad" },
    { id: 12, user: "Kevin Wang", action: "Profile Picture Update", status: "Success", timestamp: "2023-04-10T11:30:00", ip: "192.168.1.112", details: "User profile picture updated" },
    { id: 13, user: "Amanda Miller", action: "Email Verification", status: "Success", timestamp: "2023-04-10T11:15:00", ip: "192.168.1.113", details: "User verified email address" },
    { id: 14, user: "Brian Taylor", action: "Login", status: "Failed", timestamp: "2023-04-10T10:45:00", ip: "192.168.1.114", details: "Username not found" },
    { id: 15, user: "Sophia Garcia", action: "Password Change", status: "Failed", timestamp: "2023-04-10T10:30:00", ip: "192.168.1.115", details: "Current password incorrect" }
  ]

  const transactionLogs = [
    { id: 1, user: "John Doe", type: "Gaming Session", amount: 25.00, status: "Completed", timestamp: "2023-04-10T16:30:00", details: "2 hours on PC-1" },
    { id: 2, user: "Jane Smith", type: "Snack Purchase", amount: 5.50, status: "Completed", timestamp: "2023-04-10T15:45:00", details: "Chips and soda" },
    { id: 3, user: "Mike Johnson", type: "Gaming Session", amount: 15.00, status: "Completed", timestamp: "2023-04-10T15:20:00", details: "1 hour on PS-2" },
    { id: 4, user: "Sarah Williams", type: "Wallet Recharge", amount: 50.00, status: "Completed", timestamp: "2023-04-10T14:55:00", details: "Credit card payment" },
    { id: 5, user: "David Brown", type: "Gaming Session", amount: 30.00, status: "Refunded", timestamp: "2023-04-10T14:30:00", details: "System crash during session" },
    { id: 6, user: "Emily Davis", type: "Snack Purchase", amount: 3.75, status: "Completed", timestamp: "2023-04-10T13:45:00", details: "Energy drink" },
    { id: 7, user: "Robert Wilson", type: "Gaming Session", amount: 45.00, status: "Completed", timestamp: "2023-04-10T13:15:00", details: "3 hours on PC-5" },
    { id: 8, user: "Lisa Taylor", type: "Membership Fee", amount: 20.00, status: "Pending", timestamp: "2023-04-10T12:50:00", details: "Monthly membership renewal" },
    { id: 9, user: "Alex Johnson", type: "Gaming Session", amount: 18.50, status: "Completed", timestamp: "2023-04-10T12:30:00", details: "1.5 hours on PS-1" },
    { id: 10, user: "Michael Chen", type: "Snack Purchase", amount: 7.25, status: "Completed", timestamp: "2023-04-10T12:15:00", details: "Sandwich and juice" },
    { id: 11, user: "Jessica Lee", type: "Wallet Recharge", amount: 100.00, status: "Completed", timestamp: "2023-04-10T11:45:00", details: "PayPal transfer" },
    { id: 12, user: "Kevin Wang", type: "Gaming Session", amount: 60.00, status: "Completed", timestamp: "2023-04-10T11:30:00", details: "4 hours on PC-8" },
    { id: 13, user: "Amanda Miller", type: "Membership Fee", amount: 50.00, status: "Completed", timestamp: "2023-04-10T11:15:00", details: "Premium membership upgrade" },
    { id: 14, user: "Brian Taylor", type: "Snack Purchase", amount: 12.50, status: "Failed", timestamp: "2023-04-10T10:45:00", details: "Payment declined" },
    { id: 15, user: "Sophia Garcia", type: "Gaming Session", amount: 22.50, status: "Refunded", timestamp: "2023-04-10T10:30:00", details: "Customer complaint about noise" }
  ]

  const systemLogs = [
    { id: 1, component: "Server", action: "Restart", status: "Success", timestamp: "2023-04-10T16:30:00", details: "Scheduled maintenance restart" },
    { id: 2, component: "Database", action: "Backup", status: "Success", timestamp: "2023-04-10T15:45:00", details: "Daily backup completed" },
    { id: 3, component: "PC-3", action: "Error", status: "Error", timestamp: "2023-04-10T15:20:00", details: "Hardware failure detected" },
    { id: 4, component: "Network", action: "Outage", status: "Error", timestamp: "2023-04-10T14:55:00", details: "Internet connection lost for 5 minutes" },
    { id: 5, component: "PS-2", action: "Update", status: "Success", timestamp: "2023-04-10T14:30:00", details: "System software updated" },
    { id: 6, component: "Security", action: "Alert", status: "Warning", timestamp: "2023-04-10T13:45:00", details: "Multiple failed login attempts detected" },
    { id: 7, component: "PC-7", action: "Maintenance", status: "Success", timestamp: "2023-04-10T13:15:00", details: "Disk cleanup performed" },
    { id: 8, component: "Inventory", action: "Alert", status: "Warning", timestamp: "2023-04-10T12:50:00", details: "Low stock for energy drinks" },
    { id: 9, component: "PC-5", action: "Reboot", status: "Success", timestamp: "2023-04-10T12:30:00", details: "System reboot after software update" },
    { id: 10, component: "Server", action: "Update", status: "Success", timestamp: "2023-04-10T12:15:00", details: "Security patches applied" },
    { id: 11, component: "PC-2", action: "Error", status: "Error", timestamp: "2023-04-10T11:45:00", details: "Blue screen error during game session" },
    { id: 12, component: "Network", action: "Performance", status: "Warning", timestamp: "2023-04-10T11:30:00", details: "High latency detected" },
    { id: 13, component: "Database", action: "Optimization", status: "Success", timestamp: "2023-04-10T11:15:00", details: "Database indexes rebuilt" },
    { id: 14, component: "PS-4", action: "Error", status: "Error", timestamp: "2023-04-10T10:45:00", details: "Controller connectivity issues" },
    { id: 15, component: "Backup System", action: "Alert", status: "Warning", timestamp: "2023-04-10T10:30:00", details: "Backup storage reaching capacity" }
  ]

  // New log categories
  const securityLogs = [
    { id: 1, severity: "High", type: "Unauthorized Access", status: "Alert", timestamp: "2023-04-10T16:30:00", source: "192.168.1.201", details: "Attempted admin login from unknown IP" },
    { id: 2, severity: "Medium", type: "Suspicious Activity", status: "Warning", timestamp: "2023-04-10T15:45:00", source: "PC-5", details: "Multiple file system access attempts" },
    { id: 3, severity: "Low", type: "Policy Violation", status: "Info", timestamp: "2023-04-10T15:20:00", source: "User: John Doe", details: "Attempted to access restricted content" },
    { id: 4, severity: "High", type: "Brute Force", status: "Alert", timestamp: "2023-04-10T14:55:00", source: "192.168.1.105", details: "Multiple failed login attempts" },
    { id: 5, severity: "Medium", type: "Configuration Change", status: "Warning", timestamp: "2023-04-10T14:30:00", source: "Admin: Sarah Williams", details: "Firewall settings modified" },
    { id: 6, severity: "Low", type: "Software Update", status: "Info", timestamp: "2023-04-10T13:45:00", source: "System", details: "Security patches applied" },
    { id: 7, severity: "High", type: "Malware Detected", status: "Alert", timestamp: "2023-04-10T13:15:00", source: "PC-3", details: "Potential virus detected and quarantined" },
    { id: 8, severity: "Medium", type: "Unusual Behavior", status: "Warning", timestamp: "2023-04-10T12:50:00", source: "User: Mike Johnson", details: "Unusual login pattern detected" },
    { id: 9, severity: "Low", type: "Access Granted", status: "Info", timestamp: "2023-04-10T12:30:00", source: "Admin: David Brown", details: "Administrative access granted to new staff" },
    { id: 10, severity: "High", type: "Data Export", status: "Alert", timestamp: "2023-04-10T12:15:00", source: "User: Lisa Taylor", details: "Large data export initiated" }
  ]

  const inventoryLogs = [
    { id: 1, item: "Energy Drinks", action: "Stock Update", quantity: -10, status: "Success", timestamp: "2023-04-10T16:30:00", user: "Emily Davis", details: "Sold to customers" },
    { id: 2, item: "Chips", action: "Stock Update", quantity: -5, status: "Success", timestamp: "2023-04-10T15:45:00", user: "Jane Smith", details: "Sold to customers" },
    { id: 3, item: "Gaming Headsets", action: "New Inventory", quantity: 15, status: "Success", timestamp: "2023-04-10T15:20:00", user: "David Brown", details: "New shipment received" },
    { id: 4, item: "PS5 Controllers", action: "Stock Update", quantity: -2, status: "Success", timestamp: "2023-04-10T14:55:00", user: "Mike Johnson", details: "Sold to customers" },
    { id: 5, item: "Gaming Chairs", action: "New Inventory", quantity: 5, status: "Success", timestamp: "2023-04-10T14:30:00", user: "David Brown", details: "New shipment received" },
    { id: 6, item: "Energy Drinks", action: "Low Stock Alert", quantity: 3, status: "Warning", timestamp: "2023-04-10T13:45:00", user: "System", details: "Inventory below threshold" },
    { id: 7, item: "Mechanical Keyboards", action: "Stock Update", quantity: -1, status: "Success", timestamp: "2023-04-10T13:15:00", user: "Sarah Williams", details: "Sold to customer" },
    { id: 8, item: "Gaming Mice", action: "Inventory Check", quantity: 12, status: "Success", timestamp: "2023-04-10T12:50:00", user: "David Brown", details: "Monthly inventory verification" },
    { id: 9, item: "Sandwiches", action: "Expired Items", quantity: -3, status: "Warning", timestamp: "2023-04-10T12:30:00", user: "Emily Davis", details: "Items removed from inventory" },
    { id: 10, item: "Soft Drinks", action: "New Inventory", quantity: 24, status: "Success", timestamp: "2023-04-10T12:15:00", user: "David Brown", details: "New shipment received" }
  ]

  // Chart data for log activity
  const logActivityData = [
    { hour: '00:00', logins: 5, transactions: 2, system: 8, security: 3, inventory: 1 },
    { hour: '04:00', logins: 3, transactions: 1, system: 10, security: 2, inventory: 0 },
    { hour: '08:00', logins: 10, transactions: 8, system: 12, security: 5, inventory: 4 },
    { hour: '12:00', logins: 25, transactions: 20, system: 15, security: 8, inventory: 10 },
    { hour: '16:00', logins: 30, transactions: 25, system: 18, security: 12, inventory: 15 },
    { hour: '20:00', logins: 20, transactions: 15, system: 14, security: 7, inventory: 8 },
  ]

  // Function to get status badge
  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'success':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"><CheckCircle className="w-3 h-3 mr-1" /> {status}</span>
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"><XCircle className="w-3 h-3 mr-1" /> {status}</span>
      case 'warning':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"><AlertTriangle className="w-3 h-3 mr-1" /> {status}</span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"><Info className="w-3 h-3 mr-1" /> {status}</span>
      case 'refunded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"><RefreshCw className="w-3 h-3 mr-1" /> {status}</span>
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"><CheckCircle className="w-3 h-3 mr-1" /> {status}</span>
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"><XCircle className="w-3 h-3 mr-1" /> {status}</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{status}</span>
    }
  }

  // Function to get action icon
  const getActionIcon = (action, component) => {
    if (action === "Login" || action === "Logout" || action === "Password Change" || action === "Password Reset" || action === "Account Creation" || action === "Email Verification" || action === "Role Change") {
      return <UserCheck className="w-4 h-4 text-blue-500" />
    } else if (action === "Snack Purchase" || action === "Wallet Recharge" || action === "Gaming Session" || action === "Membership Fee") {
      return <ShoppingCart className="w-4 h-4 text-green-500" />
    } else if (component === "PC-3" || component === "PS-2" || component === "PC-7" || component === "PC-5" || component === "PC-2" || component === "PS-4" || action === "Reboot") {
      return <Monitor className="w-4 h-4 text-purple-500" />
    } else if (component === "Security" || action === "Alert" || action === "Unauthorized Access" || action === "Brute Force" || action === "Malware Detected" || action === "Suspicious Activity") {
      return <Shield className="w-4 h-4 text-red-500" />
    } else if (action === "Stock Update" || action === "New Inventory" || action === "Low Stock Alert" || action === "Inventory Check" || action === "Expired Items") {
      return <ShoppingBag className="w-4 h-4 text-orange-500" />
    } else {
      return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{`Time: ${label}`}</p>
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
        <h1 className="text-3xl font-bold">System Logs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLogType} onValueChange={setSelectedLogType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select log type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="user">User Activity</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="system">System Events</SelectItem>
                <SelectItem value="security">Security Logs</SelectItem>
                <SelectItem value="inventory">Inventory Logs</SelectItem>
                <SelectItem value="error">Errors Only</SelectItem>
                <SelectItem value="warning">Warnings Only</SelectItem>
              </SelectContent>
            </Select>
            <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Log Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Log Activity</CardTitle>
          <CardDescription>
            Number of log entries over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={logActivityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="logins" name="User Logins" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#82ca9d" />
              <Line type="monotone" dataKey="system" name="System Events" stroke="#ffc658" />
              <Line type="monotone" dataKey="security" name="Security Events" stroke="#ff8042" />
              <Line type="monotone" dataKey="inventory" name="Inventory Changes" stroke="#0088fe" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs for different log types */}
      <Tabs defaultValue="user" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user">User Activity</TabsTrigger>
          <TabsTrigger value="transaction">Transactions</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Logs</CardTitle>
              <CardDescription>
                Recent user actions and authentication events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {getActionIcon(log.action)}
                        {log.action}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.details}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Logs</CardTitle>
              <CardDescription>
                Financial transactions and purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {getActionIcon(log.type)}
                        {log.type}
                      </TableCell>
                      <TableCell>${log.amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.details}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Transaction Summary Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary</CardTitle>
              <CardDescription>
                Breakdown of transaction types
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Gaming Sessions', value: 115 },
                    { name: 'Snack Purchases', value: 85 },
                    { name: 'Wallet Recharges', value: 50 },
                    { name: 'Membership Fees', value: 20 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Event Logs</CardTitle>
              <CardDescription>
                System operations, errors, and maintenance events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.component}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        {getActionIcon(log.action, log.component)}
                        {log.action}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="max-w-[300px] truncate" title={log.details}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* System Events Summary */}
          <Card>
            <CardHeader>
              <CardTitle>System Events Summary</CardTitle>
              <CardDescription>
                Distribution of system events by status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Success', value: 45 },
                    { name: 'Warning', value: 15 },
                    { name: 'Error', value: 8 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>
                Security events, alerts, and policy violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        {log.severity === "High" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">High</span>
                        ) : log.severity === "Medium" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Medium</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">Low</span>
                        )}
                      </TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell className="max-w-[300px] truncate" title={log.details}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Security Events Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Security Events by Severity</CardTitle>
              <CardDescription>
                Distribution of security events by severity level
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High', value: 4 },
                      { name: 'Medium', value: 3 },
                      { name: 'Low', value: 3 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#ff0000" />
                    <Cell fill="#ffbb28" />
                    <Cell fill="#0088fe" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Logs</CardTitle>
              <CardDescription>
                Inventory changes, stock updates, and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{log.item}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <span className={log.quantity > 0 ? 'text-green-600' : log.quantity < 0 ? 'text-red-600' : ''}>
                          {log.quantity > 0 ? '+' : ''}{log.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={log.details}>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Inventory Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Activity</CardTitle>
              <CardDescription>
                Recent inventory changes by action type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Stock Update', value: 4 },
                    { name: 'New Inventory', value: 3 },
                    { name: 'Low Stock Alert', value: 1 },
                    { name: 'Expired Items', value: 1 },
                    { name: 'Inventory Check', value: 1 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
