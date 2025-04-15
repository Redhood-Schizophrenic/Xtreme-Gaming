'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCollection } from '@renderer/hooks/pbCollection'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Monitor, Play, Pause, Cookie, LogIn } from 'lucide-react'
// We'll import useNavigate when needed for navigation
// import { useNavigate } from 'react-router'
import { initializeDevices } from '@renderer/lib/data/DevicesPB'
import { toast } from 'sonner'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@renderer/components/ui/context-menu'
import pb from '../../api/pocketbase'
// Device dialog now uses a separate window

function HomePage() {
  const { data: devices, loading, error, updateItem: updateDevice } = useCollection('devices')
  const { data: sessions, updateItem: updateSession } = useCollection('sessions', {
    sort: '-created',
  })
  const { createItem: createSessionLog } = useCollection('session_logs')
  const [selectedDevice, setSelectedDevice] = useState(null)
  const { data: groups } = useCollection('groups')

  useEffect(() => {
    initializeDevices()
  }, [])

  const handleDeviceSelect = (device) => {
    // Toggle selection - if already selected, deselect it
    if (selectedDevice === device.id) {
      setSelectedDevice(null)
    } else {
      setSelectedDevice(device.id)
    }
  }

  // Handle opening the device info window
  const handleOpenDeviceInfo = useCallback(async (device) => {
    try {
      // Open the device info window
      await window.api.customDialog(`device-info/${device.id}`)
    } catch (error) {
      toast.error(`Error opening device info window: ${error.message}`)
    }
  }, [])

  // These functions are no longer needed - using window instead of dialog

  // Handle double click on a device
  const handleDeviceDoubleClick = async (device) => {
    // Select the device
    handleDeviceSelect(device)

    // Check if device is available
    if (device.status === 'Available') {
      try {
        // Open the session booking window
        await window.api.customDialog(`session-booking/${device.id}`)
        console.log('Opening session booking window for device:', device)
      } catch (error) {
        toast.error(`Error opening session booking window: ${error.message}`)
      }
    } else if (device.status === 'Occupied') {
      toast.error(`Device ${device.name} is already ${device.status.toLowerCase()}`)
    } else if (device.status === 'Maintenance') {
      toast.info(`Device ${device.name} is on maintenance`)
    }
  }

  // Context menu actions
  const handleStartSession = async (device) => {
    if (device.status === 'Available') {
      try {
        // Open the session booking window
        await window.api.customDialog(`session-booking/${device.id}`)
      } catch (error) {
        toast.error(`Error opening session booking window: ${error.message}`)
      }
    } else {
      toast.warning(`${device.name} is not available`)
    }
  }

  const handleStopSession = async (device) => {
    const activeSession = sessions.find(
      (s) =>
        s.device === device.id && (device.status === 'Available' || device.status === 'Occupied')
    );
    if (!device.status === 'Occupied' || !activeSession) {
      toast.warning(`No active session to stop on ${device?.name || 'this device'}`)
      return
    }

    try {
      // Calculate session duration and amount
      const inTime = new Date(activeSession.in_time)
      const outTime = new Date()
      const durationMs = outTime - inTime

      // Calculate duration in hours with 2 decimal precision
      const durationHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2))

      // Get hourly rate from device group
      let hourlyRate = 70 // Default rate if no group is found
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
        type: 'Closed',
        billed_by: pb.authStore.record?.id,
        session_amount: sessionAmount
      })
      toast.success(`Session closed successfully for ${device.name}`)
    } catch (error) {
      console.error('Error closing session:', error)
      toast.error(`Failed to close session: ${error.message}`)
    }
  }

  const handleResumeSession = (device) => {
    if (device.status === 'Paused') {
      toast.success(`Resuming session for ${device.name}`)
      // Implement actual resume session logic here
    } else {
      toast.warning(`No paused session on ${device.name}`)
    }
  }

  const handleClientLogin = (device) => {
    toast.success(`Login to ${device.name}`)
    // Implement client login logic here
  }

  const handleClientSnack = (device) => {
    if (device.status === 'Occupied') {
      toast.success(`Adding snack for ${device.name}`)
      // Implement snack ordering logic here
    } else {
      toast.warning(`No active session on ${device.name} to add snacks`)
    }
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>

      {/* Device Info now uses a separate window */}

      {/* Session Booking now uses a separate window */}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading devices...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error loading devices: {error.message}</p>
        </div>
      ) : devices && devices.length > 0 ? (
        <div className="grid grid-cols-10 gap-4">
          {devices.map((device, index) => (
            <ContextMenu key={index}>
              <ContextMenuTrigger>
                <Card
                  className={`transition-all p-0 inline-flex flex-col items-center m-0 w-[80px] h-[80px] cursor-pointer
                    ${selectedDevice === device.id && device.status === 'Available' ? 'border-primary border-2' : ''}
                    ${device.status === 'Available' ? '' : device.status === 'Occupied' ? 'text-secondary bg-green-800/20' : device.status === 'Maintenance' ? 'text-gray-1200 bg-gray-500 grayscale-100' : ''}
                  `}
                  onDoubleClick={() => handleDeviceDoubleClick(device)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <Monitor
                        className={`h-8 w-8 ${device.status === 'Occupied' ? 'text-green-800' : 'text-foreground'}`}
                      />
                      <h3
                        className={`font-bold text-xs
                          ${selectedDevice === device.id && device.status === 'Available' ? 'text-primary' : 'text-foreground'}
                          ${device.status === 'Occupied' ? 'text-green-800' : ''}
                          ${device.status === 'Maintenance' ? 'text-gray-1200' : ''}
                          `}
                      >
                        {device.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation() // Prevent double-click from triggering
                          handleDeviceSelect(device)
                          handleOpenDeviceInfo(device)
                        }}
                        className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  // disabled={device.status !== 'Available'}
                  onClick={() => handleDeviceDoubleClick(device)}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start</span>
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={device.status !== 'Occupied'}
                  onClick={() => handleStopSession(device)}
                  className="flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  <span>Stop</span>
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={device.status !== 'Paused'}
                  onClick={() => handleResumeSession(device)}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleClientLogin(device)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={device.status !== 'Occupied'}
                  onClick={() => handleClientSnack(device)}
                  className="flex items-center gap-2"
                >
                  <Cookie className="h-4 w-4" />
                  <span>Client Snack</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-64 border rounded-lg p-8 bg-muted/20">
          <Monitor className="h-16 w-16 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No Devices Found</h3>
          <p className="text-muted-foreground text-center">
            There are no devices available in the system. Please add devices to get started.
          </p>
        </div>
      )}
    </main>
  )
}

export default HomePage
