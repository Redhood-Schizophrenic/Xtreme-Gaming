import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useCollection } from '@renderer/hooks/pbCollection'
import { Bell } from 'lucide-react'

// Time in milliseconds before session end to show notification
const NOTIFICATION_THRESHOLD = 5 * 60 * 1000 // 5 minutes

export function SessionAlarmSystem() {
  const { data: sessions } = useCollection('sessions')
  const { data: devices } = useCollection('devices')
  const [checkedSessions, setCheckedSessions] = useState({})

  // Check for sessions that are about to end
  useEffect(() => {
    if (!sessions || !devices) return

    const interval = setInterval(() => {
      const now = new Date()

      // Find active sessions that are about to end
      sessions.forEach((session) => {
        if (session.status !== 'Active' && session.status !== 'Booked') return

        // Skip if we've already notified for this session
        if (checkedSessions[session.id]) return

        const outTime = new Date(session.out_time)
        const timeRemaining = outTime - now

        // If session is ending within the notification threshold
        if (timeRemaining > 0 && timeRemaining <= NOTIFICATION_THRESHOLD) {
          // Find the device for this session
          const device = devices.find((d) => d.id === session.device)

          if (device) {
            // Show notification
            toast(
              <div className="flex items-start gap-2">
                <Bell className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Session Ending Soon</p>
                  <p className="text-sm">
                    The session on <span className="font-medium">{device.name}</span> will end in{' '}
                    {Math.ceil(timeRemaining / 60000)} minutes.
                  </p>
                </div>
              </div>,
              {
                duration: 10000, // 10 seconds
                action: {
                  label: 'View Device',
                  onClick: () => {
                    // Open device info window
                    window.api.customDialog(`device-info/${device.id}`)
                  }
                }
              }
            )

            // Play notification sound
            const audio = new Audio('/notification.mp3')
            audio.play().catch((err) => console.error('Failed to play notification sound:', err))

            // Mark this session as checked
            setCheckedSessions((prev) => ({
              ...prev,
              [session.id]: true
            }))
          }
        }
      })
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [sessions, devices, checkedSessions])

  // Reset checked sessions when sessions change
  useEffect(() => {
    if (sessions) {
      // Only keep entries for sessions that still exist and are active
      const activeSessions = sessions
        .filter((s) => s.status === 'Active' || s.status === 'Booked')
        .map((s) => s.id)

      setCheckedSessions((prev) => {
        const newChecked = {}
        Object.keys(prev).forEach((id) => {
          if (activeSessions.includes(id)) {
            newChecked[id] = prev[id]
          }
        })
        return newChecked
      })
    }
  }, [sessions])

  // This component doesn't render anything visible
  return null
}

export default SessionAlarmSystem
