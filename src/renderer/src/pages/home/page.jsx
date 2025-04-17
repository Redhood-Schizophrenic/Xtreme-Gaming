'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCollection } from '@renderer/hooks/pbCollection'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@renderer/components/ui/card'
import { Monitor, Play, Pause, Clock, CreditCard, User } from 'lucide-react'
import { initializeDevices } from '@renderer/lib/data/DevicesPB'
import { toast } from 'sonner'
import { format } from 'date-fns'
import pb from '../../api/pocketbase'
import CustomerWindow from '../../components/CustomerWindow'
import PendingPaymentsSheet from '../../components/PendingPaymentsSheet'
import { Button } from '@renderer/components/ui/button'
import { Badge } from '@renderer/components/ui/badge'

function HomePage() {
  const { data: devices, loading, error, updateItem: updateDevice } = useCollection('devices')
  const { data: sessions, updateItem: updateSession } = useCollection('sessions', {
    sort: '-created',
    filter: "status!='Closed'"
  })
  const { createItem: createSessionLog } = useCollection('session_logs')
  const { data: groups } = useCollection('groups')
  const [selectedStation, setSelectedStation] = useState(null)
  const [activeSession, setActiveSession] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    initializeDevices()

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // When sessions or selectedStation changes, update activeSession
  useEffect(() => {
    if (selectedStation && sessions) {
      const session = sessions.find(s => s.device === selectedStation.id)
      setActiveSession(session || null)
    } else {
      setActiveSession(null)
    }
  }, [sessions, selectedStation])

  const handleStationSelect = (device) => {
    // Don't select disabled devices
    if (isDeviceDisabled(device.status)) {
      toast.warning(`${device.name} is ${device.status.toLowerCase()} and cannot be selected`)
      return
    }
    setSelectedStation(device)
  }

  const handleStartSession = async (device) => {
    // Don't start sessions on disabled devices
    if (isDeviceDisabled(device.status)) {
      toast.warning(`Cannot start a session on ${device.name} because it is ${device.status.toLowerCase()}`)
      return
    }

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
    const session = sessions.find(s => s.device === device.id)
    if (!session || device.status !== 'Occupied') {
      toast.warning(`No active session to stop on ${device?.name || 'this device'}`)
      return
    }

    try {
      // Calculate session duration and amount
      const inTime = new Date(session.in_time)
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
      await updateSession(session.id, {
        status: 'Closed',
        out_time: outTime.toISOString(),
        duration: durationHours,
        session_total: sessionAmount,
        total_amount: sessionAmount + (session.snacks_total || 0)
      })

      // Update device status to Available
      await updateDevice(device.id, {
        status: 'Available'
      })

      // Create session log
      await createSessionLog({
        session_id: session.id,
        type: 'Closed',
        billed_by: pb.authStore.record?.id,
        session_amount: sessionAmount
      })

      // Clear selected station if it was the one we just stopped
      if (selectedStation && selectedStation.id === device.id) {
        setSelectedStation(null)
      }

      toast.success(`Session closed successfully for ${device.name}`)
    } catch (error) {
      console.error('Error closing session:', error)
      toast.error(`Failed to close session: ${error.message}`)
    }
  }

  // Calculate remaining time for active session
  const calculateRemainingTime = (session) => {
    if (!session) return null

    const inTime = new Date(session.in_time)
    const currentTime = new Date()
    const elapsedMs = currentTime - inTime

    // If this is a pre-paid session with a fixed duration
    if (session.duration) {
      const durationMs = session.duration * 60 * 60 * 1000 // Convert hours to ms
      const remainingMs = durationMs - elapsedMs

      if (remainingMs <= 0) return '00:00:00'

      // Format remaining time as HH:MM:SS
      const hours = Math.floor(remainingMs / (1000 * 60 * 60))
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000)

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    // For post-paid sessions, just show elapsed time
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60))
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Get station status color
  const getStationColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-card hover:bg-accent'
      case 'Occupied':
        return 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground'
      case 'Maintenance':
      case 'Lost':
      case 'Damaged':
        return 'bg-warning/20 hover:bg-warning/30 text-warning-foreground opacity-60'
      default:
        return 'bg-card hover:bg-accent'
    }
  }

  // Check if device is disabled
  const isDeviceDisabled = (status) => {
    return ['Maintenance', 'Lost', 'Damaged'].includes(status)
  }

  // Get station status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-success/20 text-success hover:bg-success/30'
      case 'Occupied':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30'
      case 'Maintenance':
        return 'bg-warning/20 text-warning hover:bg-warning/30'
      case 'Lost':
        return 'bg-warning/20 text-warning hover:bg-warning/30'
      case 'Damaged':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30'
      default:
        return 'bg-secondary text-secondary-foreground'
    }
  }

  // Get zone background color
  const getZoneBackgroundColor = (zoneName) => {
    const name = zoneName.toLowerCase()
    if (name.includes('premium')) return 'bg-card/50 border border-primary/20'
    if (name.includes('tournament')) return 'bg-card/50 border border-destructive/20'
    if (name.includes('casual')) return 'bg-card/50 border border-blue-500/20'
    return 'bg-card/50 border border-muted' // Regular gaming zone
  }

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Include the PendingPaymentsSheet component */}
      <PendingPaymentsSheet />

      {/* Left side - Customer window */}
      <div className="w-[25%] border-r">
        <CustomerWindow onSelectCustomer={handleCustomerSelect} />
      </div>

      {/* Middle - Station selection */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Select Your Station</h1>
          <p className="text-muted-foreground">Welcome to the Booking System interface</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading stations...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">Error loading stations: {error.message}</p>
          </div>
        ) : devices && devices.length > 0 && groups ? (
          <div className="space-y-8">
            {/* Gaming Zones */}
            {groups.map((group, index) => {
              const groupDevices = devices.filter(d => d.group === group.id)
              if (groupDevices.length === 0) return null

              return (
                <Card key={index} className={`mb-8 ${getZoneBackgroundColor(group.name)}`}>
                  <CardHeader className="pb-2">
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {groupDevices.filter(d => d.status === 'Available').length} available stations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-6 gap-2">
                      {groupDevices.map((device, idx) => {
                        const isActive = sessions?.some(s => s.device === device.id)
                        const isSelected = selectedStation?.id === device.id

                        return (
                          <Button
                            key={idx}
                            variant="outline"
                            className={`
                              h-auto py-3 relative
                              ${getStationColor(device.status)}
                              ${isSelected ? 'ring-2 ring-primary' : ''}
                              ${isDeviceDisabled(device.status) ? 'cursor-not-allowed' : ''}
                            `}
                            onClick={() => !isDeviceDisabled(device.status) && handleStationSelect(device)}
                            onDoubleClick={() => !isDeviceDisabled(device.status) && handleStartSession(device)}
                            disabled={isDeviceDisabled(device.status)}
                            title={isDeviceDisabled(device.status) ? `${device.name} is ${device.status}` : ''}
                          >
                            {device.name}
                            {device.status === 'Occupied' && (
                              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full transform translate-x-0 -translate-y-0"></span>
                            )}
                            {isDeviceDisabled(device.status) && (
                              <span className="absolute inset-0 bg-background/40 flex items-center justify-center rounded-md">
                                <span className="text-xs text-muted-foreground">{device.status}</span>
                              </span>
                            )}
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="flex flex-col justify-center items-center h-64 p-8">
            <Monitor className="h-16 w-16 mb-4 text-muted-foreground" />
            <CardTitle className="mb-2">No Stations Found</CardTitle>
            <CardDescription className="text-center">
              There are no gaming stations available in the system.
            </CardDescription>
          </Card>
        )}
      </div>

      {/* Right side - Session details */}
      <div className="w-80 border-l p-6 overflow-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getStatusBadge('Occupied')}>
                  Occupied
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className={getStatusBadge('Available')}>
                  Available
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(currentDateTime, 'dd-MM-yyyy')}</p>
            </div>
          </div>
        </div>

        {selectedStation ? (
          <div>
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle>Station</CardTitle>
                <CardDescription>{selectedStation.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p>{format(currentDateTime, 'dd-MM-yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p>{format(currentDateTime, 'HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className={getStatusBadge(selectedStation.status)}>
                      {selectedStation.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p>{activeSession ? `${activeSession.duration || 2} hours` : '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {activeSession ? (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Subtotal</p>
                        <p className="font-medium">₹{activeSession.session_total || '70'}</p>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Tax (18%)</p>
                        <p className="font-medium">₹{(activeSession.session_total * 0.18).toFixed(2) || '12.6'}</p>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">Total</p>
                          <p className="font-bold">₹{(activeSession.session_total * 1.18).toFixed(2) || '82.60'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-muted-foreground">Time Remaining:</p>
                      <p className="text-xl font-bold text-primary">{calculateRemainingTime(activeSession)}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="destructive"
                        className="flex items-center justify-center"
                        onClick={() => handleStopSession(selectedStation)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        End Session
                      </Button>

                      <Button className="flex items-center justify-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No active session for this station</p>
                  <Button
                    className="w-full"
                    onClick={() => handleStartSession(selectedStation)}
                    disabled={!selectedCustomer}
                  >
                    {selectedCustomer ? 'Start Session' : 'Select a customer first'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="text-center">
            <CardContent className="pt-6">
              <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">No Station Selected</CardTitle>
              <CardDescription>
                Select a station from the center panel to view details and manage sessions.
              </CardDescription>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Xtreme Gaming © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
