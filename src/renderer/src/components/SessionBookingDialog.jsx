/* eslint-disable react/prop-types */
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@renderer/components/ui/tabs'
import {
  Monitor,
  Clock,
  User,
  Calendar,
  BadgeCheck,
  Wallet,
  Cookie,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react'
import { toast } from 'sonner'
import { useCollection } from '@renderer/hooks/pbCollection'
import { Checkbox } from '@renderer/components/ui/checkbox'
import pb from '@renderer/api/pocketbase' // Only used for authentication

export function SessionBookingDialog({ device, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login')
  const [isLoading, setIsLoading] = useState(false)

  // Collection hooks
  const { data: customers } = useCollection('customers')
  const { data: snacksData } = useCollection('snacks')
  const { createItem: createSession } = useCollection('sessions')
  const { createItem: createSessionSnackLog } = useCollection('session_snacks_logs')
  const { createItem: createSessionLog } = useCollection('session_logs')
  const { updateItem: updateDevice } = useCollection('devices')
  const { createItem: createSnackLog } = useCollection('snacks_logs')
  const { updateItem: updateSnack } = useCollection('snacks')

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  })

  // Session form state
  const [sessionForm, setSessionForm] = useState({
    customerId: '',
    duration: 1, // Default 1 hour
    paymentMode: 'Cash',
    includeSnacks: false
  })

  // Snacks state
  const [selectedSnacks, setSelectedSnacks] = useState([])
  const [snacksTotal, setSnacksTotal] = useState(0)

  // Client state after login
  const [client, setClient] = useState(null)

  // Session ID after creation (for adding snacks)
  // eslint-disable-next-line no-unused-vars
  const [sessionId, setSessionId] = useState(null)

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle session form changes
  const handleSessionChange = (field, value) => {
    setSessionForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle snack selection
  const handleSnackSelection = (snack) => {
    setSelectedSnacks((prev) => {
      // Check if snack is already selected
      const existingIndex = prev.findIndex((item) => item.id === snack.id)

      if (existingIndex >= 0) {
        // If already selected, remove it
        const newSnacks = [...prev]
        newSnacks.splice(existingIndex, 1)
        return newSnacks
      } else {
        // If not selected, add it with quantity 1
        return [...prev, { ...snack, quantity: 1 }]
      }
    })
  }

  // Handle snack quantity change
  const handleSnackQuantity = (snackId, change) => {
    setSelectedSnacks((prev) => {
      return prev.map((snack) => {
        if (snack.id === snackId) {
          const newQuantity = Math.max(1, snack.quantity + change) // Ensure quantity is at least 1
          return { ...snack, quantity: newQuantity }
        }
        return snack
      })
    })
  }

  // Calculate snacks total
  useEffect(() => {
    const total = selectedSnacks.reduce((sum, snack) => {
      return sum + snack.selling_price * snack.quantity
    }, 0)
    setSnacksTotal(total)
  }, [selectedSnacks])

  // Handle client login
  const handleLogin = async (e) => {
    e?.preventDefault()
    setIsLoading(true)

    try {
      // Authenticate with PocketBase
      const authData = await pb
        .collection('users')
        .authWithPassword(loginForm.username, loginForm.password)

      // Find the customer record associated with this user
      if (customers) {
        const customerRecord = customers.find((c) => c.user === authData.record.id)

        if (customerRecord) {
          setClient({
            ...customerRecord,
            user: authData.record
          })

          toast.success(`Welcome, ${authData.record.name || authData.record.username}!`)
          setActiveTab('booking')
        } else {
          toast.error('No customer record found for this user')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle session booking
  const handleBookSession = async () => {
    if (!client) {
      toast.error('Please login first')
      setActiveTab('login')
      return
    }

    setIsLoading(true)

    try {
      // Calculate times
      const inTime = new Date()
      const outTime = new Date(inTime.getTime() + sessionForm.duration * 60 * 60 * 1000)

      // Calculate totals
      const hourlyRate = 60 // Assuming ₹60 per hour
      const sessionTotal = sessionForm.duration * hourlyRate
      const snacksTotal = selectedSnacks.reduce(
        (sum, snack) => sum + snack.selling_price * snack.quantity,
        0
      )
      const totalAmount = sessionTotal + snacksTotal

      // Create session data
      const sessionData = {
        device: device.id,
        customer: client.id,
        in_time: inTime.toISOString(),
        out_time: outTime.toISOString(),
        duration: sessionForm.duration,
        status: 'Booked', // Set initial status to Booked
        payment_mode: sessionForm.paymentMode,
        payment_type: client.membership === 'Member' ? 'Membership' : 'Pre-paid',
        session_total: sessionTotal,
        snacks_total: snacksTotal,
        total_amount: totalAmount,
        amount_paid: client.membership === 'Member' ? 0 : totalAmount,
        discount_amount: 0,
        discount_rate: 0
      }

      // Create the session using the hook
      const createdSession = await createSession(sessionData)
      setSessionId(createdSession.id)

      // Process snacks if any are selected
      if (selectedSnacks.length > 0) {
        // Add snacks to the session
        const snackPromises = selectedSnacks.map(async (snack) => {
          // Create session snack log
          await createSessionSnackLog({
            session: createdSession.id,
            snack: snack.id,
            quantity: snack.quantity,
            price: snack.selling_price * snack.quantity,
            each_price: snack.selling_price
          })

          // Update snack inventory
          const currentSnack = snacksData.find((s) => s.id === snack.id)
          if (currentSnack) {
            const newQuantity = Math.max(0, currentSnack.quantity - snack.quantity)

            // Update snack quantity
            await updateSnack(snack.id, {
              quantity: newQuantity,
              // Update status if stock is low
              status: newQuantity <= 5 ? 'Low Stock' : 'Available'
            })

            // Create snack log entry
            await createSnackLog({
              snack_id: snack.id,
              quantity: snack.quantity,
              status: 'Lost', // Used in a session
              location: currentSnack.location || 'Stock',
              reason: `Used in session ${createdSession.id}`
            })
          }
        })

        await Promise.all(snackPromises)
      }

      // Update device status to Booked
      await updateDevice(device.id, {
        status: 'Booked'
      })

      // Create session log
      await createSessionLog({
        session_id: createdSession.id,
        type: 'Create',
        session_amount: sessionTotal,
        billed_by: pb.authStore.model?.id // Current logged in user
      })

      toast.success(`Session booked successfully for ${sessionForm.duration} hour(s)`)
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Booking failed: ' + (error.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setLoginForm({ username: '', password: '' })
      setSessionForm({
        customerId: '',
        duration: 1,
        paymentMode: 'Cash',
        includeSnacks: false
      })
      setSelectedSnacks([])
      setSnacksTotal(0)
      setSessionId(null)
      setClient(null)
      setActiveTab('login')
    }
  }, [isOpen])

  if (!device) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            <span>Book Session - {device.name}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login" disabled={!!client}>
              <User className="h-4 w-4 mr-2" />
              Client Login
            </TabsTrigger>
            <TabsTrigger value="booking" disabled={!client}>
              <Clock className="h-4 w-4 mr-2" />
              Session Details
            </TabsTrigger>
            <TabsTrigger value="snacks" disabled={!client}>
              <Cookie className="h-4 w-4 mr-2" />
              Snacks
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Client Login</CardTitle>
                <CardDescription>
                  Login with your client credentials to book a session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      value={loginForm.username}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleLogin} disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Booking Tab */}
          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>Configure your gaming session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {client && (
                  <div className="bg-muted p-3 rounded-md mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{client.name}</span>
                      {client.membership === 'Member' && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Member
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Wallet className="h-3 w-3" />
                        <span>Balance: ₹{client.wallet || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {new Date(client.created).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="duration">Session Duration</Label>
                  <Select
                    value={sessionForm.duration.toString()}
                    onValueChange={(value) => handleSessionChange('duration', parseFloat(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes</SelectItem>
                      <SelectItem value="1">1 Hour</SelectItem>
                      <SelectItem value="2">2 Hours</SelectItem>
                      <SelectItem value="3">3 Hours</SelectItem>
                      <SelectItem value="4">4 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {client?.membership !== 'Member' && (
                  <div className="space-y-2">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <Select
                      value={sessionForm.paymentMode}
                      onValueChange={(value) => handleSessionChange('paymentMode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Wallet">Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="includeSnacks"
                    checked={sessionForm.includeSnacks}
                    onCheckedChange={(checked) => {
                      handleSessionChange('includeSnacks', checked)
                      if (checked) {
                        setActiveTab('snacks')
                      }
                    }}
                  />
                  <Label htmlFor="includeSnacks" className="cursor-pointer">
                    Add snacks to this session
                  </Label>
                </div>

                <div className="pt-2">
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-2">Session Summary</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div>Start Time:</div>
                      <div>{new Date().toLocaleTimeString()}</div>

                      <div>End Time:</div>
                      <div>
                        {new Date(
                          Date.now() + sessionForm.duration * 60 * 60 * 1000
                        ).toLocaleTimeString()}
                      </div>

                      <div>Duration:</div>
                      <div>{sessionForm.duration} hour(s)</div>

                      <div>Session Amount:</div>
                      <div className="font-medium">
                        {client?.membership === 'Member'
                          ? 'Membership'
                          : `₹${sessionForm.duration * 60}`}
                      </div>

                      {selectedSnacks.length > 0 && (
                        <>
                          <div>Snacks Amount:</div>
                          <div className="font-medium">₹{snacksTotal}</div>
                        </>
                      )}

                      <div>Total Amount:</div>
                      <div className="font-medium">
                        {client?.membership === 'Member'
                          ? 'Membership'
                          : `₹${sessionForm.duration * 60 + snacksTotal}`}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('login')}>
                  Back
                </Button>
                <Button onClick={handleBookSession} disabled={isLoading}>
                  {isLoading ? 'Booking...' : 'Book Session'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Snacks Tab */}
          <TabsContent value="snacks">
            <Card>
              <CardHeader>
                <CardTitle>Add Snacks</CardTitle>
                <CardDescription>Select snacks to add to the session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {snacksData && snacksData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      {snacksData.map((snack) => {
                        const isSelected = selectedSnacks.some((s) => s.id === snack.id)
                        const selectedSnack = selectedSnacks.find((s) => s.id === snack.id)

                        return (
                          <div
                            key={snack.id}
                            className="flex items-center justify-between p-2 border rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`snack-${snack.id}`}
                                checked={isSelected}
                                onCheckedChange={() => handleSnackSelection(snack)}
                              />
                              <Label htmlFor={`snack-${snack.id}`} className="flex-1">
                                <div className="font-medium">{snack.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ₹{snack.selling_price}
                                </div>
                              </Label>
                            </div>

                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleSnackQuantity(snack.id, -1)}
                                  disabled={selectedSnack.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center">{selectedSnack.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleSnackQuantity(snack.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {selectedSnacks.length > 0 && (
                      <div className="bg-muted p-3 rounded-md">
                        <h4 className="font-medium mb-2 flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Snacks Summary
                        </h4>
                        <div className="space-y-2">
                          {selectedSnacks.map((snack) => (
                            <div key={snack.id} className="flex justify-between text-sm">
                              <span>
                                {snack.name} x {snack.quantity}
                              </span>
                              <span>₹{snack.selling_price * snack.quantity}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total</span>
                            <span>₹{snacksTotal}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No snacks available</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('booking')}>
                  Back
                </Button>
                <Button onClick={handleBookSession} disabled={isLoading}>
                  {isLoading ? 'Booking...' : 'Book Session'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
