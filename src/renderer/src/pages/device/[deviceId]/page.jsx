'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { useParams } from 'react-router'
import { toast } from 'sonner'
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
import { useCollection } from '@renderer/hooks/pbCollection'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'

function DeviceDialog() {
  const { deviceId } = useParams() // Using name param as deviceId
  const { data: devices, loading, error } = useCollection('devices')
  const [device, setDevice] = useState(null)

  useEffect(() => {
    if (devices && deviceId) {
      console.log('Devices:', devices)
      console.log('Looking for device with ID:', deviceId)
      console.log('Devices:', devices.id)
      const foundDevice = devices.find((d) => d.id === deviceId)
      if (foundDevice) {
        console.log('Found device:', foundDevice)
        setDevice(foundDevice)
      } else {
        toast.error(`Device with ID ${deviceId} not found`)
      }
    }
  }, [devices, deviceId])

  const handleStartSession = async () => {
    if (device?.status === 'Available') {
      try {
        await window.api.customDialog(`bookings/add/${device.id}`)
        await window.api.customDialogClose()
      } catch (error) {
        toast.error(`Error starting session: ${error.message}`)
      }
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

  const handleClose = async () => {
    try {
      const result = await window.api.customDialogClose()
      console.log('Dialog closed:', result)
    } catch (error) {
      console.error('Error closing dialog:', error)
      // Even if there's an error, we should try to close the dialog
      // This is a fallback in case the main process handler fails
      if (window.close) {
        window.close()
      }
    }
  }

  // Add debugging information
  console.log('Device Dialog State:', { loading, error, device, deviceId })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-background">
        <p>Loading device information...</p>
        <span>{device.id}</span>
        <Button onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-background">
        <p className="text-red-500">Error loading device: {error.message}</p>
        <Button onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    )
  }

  if (!device) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-background">
        <p>Device not found with ID: {deviceId}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Available devices: {devices?.map((d) => `${d.name} (${d.id})`).join(', ')}
        </p>
        <Button onClick={handleClose} className="mt-4">
          Close
        </Button>
      </div>
    )
  }

  return (
    <>
      <h1>Test</h1>
      <div className="p-4 h-full flex flex-col bg-background">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
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
                      This is a {device.type} device used for gaming and entertainment purposes. It
                      is currently {device.status.toLowerCase()}.
                    </p>
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
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default DeviceDialog
