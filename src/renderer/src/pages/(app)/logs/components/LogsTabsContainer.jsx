import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { UserCheck, ShoppingCart, Monitor, Package, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"
import LogsTable from "./LogsTable"

export default function LogsTabsContainer({
  loginLogs,
  snacksSalesLogs,
  snacksMaintenanceLogs,
  sessionLogs
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="login" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span>Login Logs</span>
          </TabsTrigger>
          <TabsTrigger value="snacksSales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Snacks Sales</span>
          </TabsTrigger>
          <TabsTrigger value="snacksMaintenance" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Inventory Logs</span>
          </TabsTrigger>
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Session Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-6">
          <LogsTable
            title="Login Logs"
            description="User login activity and authentication events"
            logs={loginLogs}
            searchColumn="user"
            searchPlaceholder="Search by user..."
            exportFileName="LoginLogs.pdf"
          />
        </TabsContent>

        <TabsContent value="snacksSales" className="space-y-6">
          <LogsTable
            title="Snacks Sales Logs"
            description="Snack purchases by customers"
            logs={snacksSalesLogs}
            searchColumn="item"
            searchPlaceholder="Search by item..."
            exportFileName="SnacksSalesLogs.pdf"
          />
        </TabsContent>

        <TabsContent value="snacksMaintenance" className="space-y-6">
          <LogsTable
            title="Snacks Inventory Logs"
            description="Inventory maintenance, stock updates, and alerts"
            logs={snacksMaintenanceLogs}
            searchColumn="item"
            searchPlaceholder="Search by item..."
            exportFileName="SnacksInventoryLogs.pdf"
          />
        </TabsContent>

        <TabsContent value="session" className="space-y-6">
          <LogsTable
            title="Session Logs"
            description="Gaming session activity and billing events"
            logs={sessionLogs}
            searchColumn="user"
            searchPlaceholder="Search by user..."
            exportFileName="SessionLogs.pdf"
          />
        </TabsContent>

      </Tabs>
    </motion.div>
  )
}
