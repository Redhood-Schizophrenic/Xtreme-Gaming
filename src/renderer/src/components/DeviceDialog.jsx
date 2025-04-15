/* eslint-disable react/prop-types */
'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'
import {
  Monitor,
  Play,
  Pause,
  Cookie,
  LogIn,
  Settings,
  BarChart,
  MessageSquare,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

export function DeviceDialog({ device, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Handle actions
  const handleStartSession = () => {
    if (device?.status === 'Available') {
      toast.success(`Starting session for ${device.name}`)
      // Implement actual start session logic here
    } else {
      toast.warning(`${device.name} is not available`)
    }
  }

  const handleStopSession = () => {
    if (device?.status === 'Occupied') {
      toast.success(`Stopping session for ${device.name}`)
      // Implement actual stop session logic here
    } else {
      toast.warning(`No active session on ${device.name}`)
    }
  }

  const handleResumeSession = () => {
    if (device?.status === 'Paused') {
      toast.success(`Resuming session for ${device.name}`)
      // Implement actual resume session logic here
    } else {
      toast.warning(`No paused session on ${device.name}`)
    }
  }

  const handleClientLogin = () => {
    toast.success(`Login to ${device.name}`)
    // Implement client login logic here
  }

  const handleClientSnack = () => {
    if (device?.status === 'Occupied') {
      toast.success(`Adding snack for ${device.name}`)
      // Implement snack ordering logic here
    } else {
      toast.warning(`No active session on ${device.name} to add snacks`)
    }
  }

  if (!device) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            <span>{device.name}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                device.status === 'Available'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {device.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="overview"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="control" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span>Control</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p>{device.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p>{device.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">IP Address</p>
                  <p>192.168.1.{Math.floor(Math.random() * 255)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Maintenance</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-sm text-muted-foreground">
                  This is a {device.type} device used for gaming and entertainment purposes. It is
                  currently {device.status}.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Device ID</p>
                <p className="text-sm font-mono bg-muted p-1 rounded">{device.id}</p>
              </div>
            </div>
          </TabsContent>

          {/* Control Tab */}
          <TabsContent value="control" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleStartSession}
                  disabled={device.status !== 'Available'}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Session</span>
                </Button>
                <Button
                  onClick={handleStopSession}
                  disabled={device.status !== 'Occupied'}
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  <span>Stop Session</span>
                </Button>
                <Button
                  onClick={handleResumeSession}
                  disabled={device.status !== 'Paused'}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume Session</span>
                </Button>
                <Button onClick={handleClientLogin} className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button
                  onClick={handleClientSnack}
                  disabled={device.status !== 'Occupied'}
                  className="flex items-center gap-2"
                >
                  <Cookie className="h-4 w-4" />
                  <span>Client Snack</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Activity Logs</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {new Date(Date.now() - i * 3600000).toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Date.now() - i * 3600000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {
                        [
                          `User logged in to ${device.name}`,
                          `Session started on ${device.name}`,
                          `Session paused on ${device.name}`,
                          `Session resumed on ${device.name}`,
                          `Session ended on ${device.name}`,
                          `Maintenance performed on ${device.name}`,
                          `Software updated on ${device.name}`,
                          `Reboot initiated for ${device.name}`,
                          `Network issue detected on ${device.name}`,
                          `System check completed for ${device.name}`
                        ][i % 10]
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Messages</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">System</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {
                        [
                          `Scheduled maintenance for ${device.name} on ${new Date(Date.now() + 7 * 86400000).toLocaleDateString()}`,
                          `Software update available for ${device.name}`,
                          `Please restart ${device.name} to apply pending updates`,
                          `Performance optimization recommended for ${device.name}`,
                          `Disk space running low on ${device.name}`
                        ][i % 5]
                      }
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Device Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Auto Shutdown</p>
                    <p className="text-sm text-muted-foreground">Enabled</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Power Saving Mode</p>
                    <p className="text-sm text-muted-foreground">Disabled</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Remote Access</p>
                    <p className="text-sm text-muted-foreground">Enabled</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maintenance Schedule</p>
                    <p className="text-sm text-muted-foreground">Weekly</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
