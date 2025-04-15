'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'
import {
  Monitor,
  Info,
  Clock,
  MessageSquare,
  Settings,
  Play,
  Pause,
  LogIn,
  Cookie,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { useCollection } from '@renderer/hooks/pbCollection'

function DeviceInfoPage() {
  const { deviceId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [device, setDevice] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Collection hooks
  const { data: devices } = useCollection('devices')
  const { data: sessions } = useCollection('sessions')
  const { data: groups } = useCollection('groups')
  const { updateItem: updateDevice } = useCollection('devices')
  const { updateItem: updateSession } = useCollection('sessions')
  const { createItem: createSessionLog } = useCollection('session_logs')

  // Load device data
  useEffect(() => {
    if (devices && deviceId) {
      const foundDevice = devices.find((d) => d.id === deviceId)
      if (foundDevice) {
        setDevice(foundDevice)
      } else {
        toast.error(`Device with ID ${deviceId} not found`)
      }
    }
  }, [devices, deviceId])

  // Find active session for this device
  useEffect(() => {
    if (sessions && device) {
      const foundSession = sessions.find(
        (s) =>
          s.device_id === device.id && (device.status === 'Available' || device.status === 'Booked')
      )
      setActiveSession(foundSession || null)
      console.log('Active session:', foundSession)
    }
  }, [sessions, device])

  // Handle window close
  const handleClose = async () => {
    try {
      await window.api.customDialogClose()
    } catch (error) {
      console.error('Error closing window:', error)
      // Fallback if the API call fails
      if (window.close) {
        window.close()
      }
    }
  }

  // Handle start session
  const handleStartSession = async () => {
    if (!device) return

    if (device.status === 'Available') {
      try {
        // Open the session booking window
        await window.api.customDialog(`session-booking/${device.id}`)
        handleClose() // Close this window
      } catch (error) {
        toast.error(`Error opening session booking window: ${error.message}`)
      }
    } else {
      toast.warning(`${device.name} is not available`)
    }
  }

  // Handle stop session
  const handleStopSession = async () => {
    if (!device || !activeSession) {
      toast.warning(`No active session to stop on ${device?.name || 'this device'}`)
      return
    }

    setIsLoading(true)

    try {
      // Calculate session duration and amount
      const inTime = new Date(activeSession.in_time)
      const outTime = new Date()
      const durationMs = outTime - inTime

      // Calculate duration in hours with 2 decimal precision
      const durationHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2))

      // Get hourly rate from device group
      let hourlyRate = 60 // Default rate if no group is found
      if (device.group && groups) {
        const deviceGroup = groups.find((g) => g.id === device.group)
        if (deviceGroup && deviceGroup.price) {
          hourlyRate = deviceGroup.price
        }
      }

      const sessionAmount = durationHours * hourlyRate

      // Update session status to Closed
      await updateSession(activeSession.id, {
        status: 'Closed',
        out_time: outTime.toISOString(),
        duration: durationHours,
        session_total: sessionAmount,
        total_amount: sessionAmount + (activeSession.snacks_total || 0)
      })

      // Update device status to Available
      await updateDevice(device.id, {
        status: 'Available'
      })

      // Create session log
      await createSessionLog({
        session_id: activeSession.id,
        type: 'Close',
        session_amount: sessionAmount
      })

      toast.success(`Session closed successfully for ${device.name}`)
      handleClose() // Close this window
    } catch (error) {
      console.error('Error closing session:', error)
      toast.error(`Failed to close session: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle client login
  const handleClientLogin = async () => {
    if (!device) return

    toast.info('Client login functionality will be implemented here')
  }

  // Handle client snack
  const handleClientSnack = async () => {
    if (!device || !activeSession) {
      toast.warning(`No active session to add snacks on ${device?.name || 'this device'}`)
      return
    }

    try {
      // Open the snack selection window
      await window.api.customDialog(`session-snacks/${activeSession.id}`)
    } catch (error) {
      toast.error(`Error opening snack selection window: ${error.message}`)
    }
  }

  if (!device) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
        <p>Loading device information...</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Monitor className="h-6 w-6" />
          {device.name}
          <span
            className={`text-xs px-2 py-1 rounded-full ${device.status === 'Available'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
          >
            {device.status}
          </span>
        </h1>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <Clock className="h-4 w-4" />
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
            <TabsContent value="overview" className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Device Type</h3>
                    <p>{device.type || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <p>{device.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">IP Address</h3>
                    <p>{device.ip_address || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">MAC Address</h3>
                    <p>{device.mac_address || 'Not specified'}</p>
                  </div>
                </div>

                {activeSession && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <h3 className="text-sm font-medium mb-2">Active Session</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Start Time:</div>
                      <div>{new Date(activeSession.in_time).toLocaleString()}</div>

                      <div>Expected End:</div>
                      <div>{new Date(activeSession.out_time).toLocaleString()}</div>

                      <div>Duration:</div>
                      <div>{activeSession.duration} hour(s)</div>

                      <div>Status:</div>
                      <div>{activeSession.status}</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Control Tab */}
            <TabsContent value="control" className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleStartSession}
                  disabled={device.status !== 'Available' || isLoading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Session
                </Button>

                <Button
                  onClick={handleStopSession}
                  disabled={!activeSession || isLoading}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Stop Session
                </Button>

                <Button
                  onClick={handleClientLogin}
                  disabled={!activeSession || isLoading}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Client Login
                </Button>

                <Button
                  onClick={handleClientSnack}
                  disabled={!activeSession || isLoading}
                  className="flex items-center gap-2"
                >
                  <Cookie className="h-4 w-4" />
                  Add Snacks
                </Button>
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="p-4">
              <p>Session logs will be displayed here.</p>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="p-4">
              <p>Device messages will be displayed here.</p>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-4">
              <p>Device settings will be configured here.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default DeviceInfoPage
