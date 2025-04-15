'use client';

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  Cookie,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Check
} from 'lucide-react'
import { toast } from 'sonner'
import { useCollection } from '@renderer/hooks/pbCollection'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { Label } from '@renderer/components/ui/label'

function SessionSnacksPage() {
  const { sessionId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [device, setDevice] = useState(null)
  const [customer, setCustomer] = useState(null)
  
  // Snacks state
  const [selectedSnacks, setSelectedSnacks] = useState([])
  const [snacksTotal, setSnacksTotal] = useState(0)

  // Collection hooks
  const { data: sessions } = useCollection('sessions')
  const { data: devices } = useCollection('devices')
  const { data: customers } = useCollection('customers')
  const { data: snacksData } = useCollection('snacks')
  const { createItem: createSessionSnackLog } = useCollection('session_snacks_logs')
  const { createItem: createSnackLog } = useCollection('snacks_logs')
  const { updateItem: updateSession } = useCollection('sessions')
  const { updateItem: updateSnack } = useCollection('snacks')

  // Load session data
  useEffect(() => {
    if (sessions && sessionId) {
      const foundSession = sessions.find(s => s.id === sessionId)
      if (foundSession) {
        setSession(foundSession)
      } else {
        toast.error(`Session with ID ${sessionId} not found`)
      }
    }
  }, [sessions, sessionId])

  // Load device and customer data
  useEffect(() => {
    if (session && devices && customers) {
      const foundDevice = devices.find(d => d.id === session.device)
      if (foundDevice) {
        setDevice(foundDevice)
      }

      const foundCustomer = customers.find(c => c.id === session.customer)
      if (foundCustomer) {
        setCustomer(foundCustomer)
      }
    }
  }, [session, devices, customers])

  // Handle snack selection
  const handleSnackSelection = (snack) => {
    setSelectedSnacks(prev => {
      // Check if snack is already selected
      const existingIndex = prev.findIndex(item => item.id === snack.id)
      
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
    setSelectedSnacks(prev => {
      return prev.map(snack => {
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
      return sum + (snack.selling_price * snack.quantity)
    }, 0)
    setSnacksTotal(total)
  }, [selectedSnacks])

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

  // Handle add snacks
  const handleAddSnacks = async () => {
    if (!session || selectedSnacks.length === 0) {
      toast.warning('Please select at least one snack')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Process snacks
      const snackPromises = selectedSnacks.map(async (snack) => {
        // Create session snack log
        await createSessionSnackLog({
          session: session.id,
          snack: snack.id,
          quantity: snack.quantity,
          price: snack.selling_price * snack.quantity,
          each_price: snack.selling_price
        })
        
        // Update snack inventory
        const currentSnack = snacksData.find(s => s.id === snack.id)
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
            reason: `Added to session ${session.id}`
          })
        }
      })
      
      await Promise.all(snackPromises)
      
      // Update session with new snacks total
      const newSnacksTotal = (session.snacks_total || 0) + snacksTotal
      const newTotalAmount = (session.session_total || 0) + newSnacksTotal
      
      await updateSession(session.id, {
        snacks_total: newSnacksTotal,
        total_amount: newTotalAmount
      })
      
      toast.success(`Added ${selectedSnacks.length} snack(s) to the session`)
      handleClose()
    } catch (error) {
      console.error('Error adding snacks:', error)
      toast.error(`Failed to add snacks: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session || !device || !customer) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[400px]">
        <p>Loading session information...</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Cookie className="h-6 w-6" />
          Add Snacks to Session
        </h1>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
            <CardDescription>
              Adding snacks to session on {device.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Device:</div>
              <div>{device.name}</div>
              
              <div>Customer:</div>
              <div>{customer.name || customer.id}</div>
              
              <div>Session Status:</div>
              <div>{session.status}</div>
              
              <div>Current Snacks Total:</div>
              <div>₹{session.snacks_total || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Snacks</CardTitle>
          <CardDescription>
            Select snacks to add to the session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {snacksData && snacksData.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                {snacksData
                  .filter(snack => snack.quantity > 0) // Only show snacks with stock
                  .map((snack) => {
                    const isSelected = selectedSnacks.some(s => s.id === snack.id)
                    const selectedSnack = selectedSnacks.find(s => s.id === snack.id)
                    
                    return (
                      <div key={snack.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`snack-${snack.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleSnackSelection(snack)}
                          />
                          <Label htmlFor={`snack-${snack.id}`} className="flex-1">
                            <div className="font-medium">{snack.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ₹{snack.selling_price} · {snack.quantity} in stock
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
                              disabled={selectedSnack.quantity >= snack.quantity}
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
                    {selectedSnacks.map(snack => (
                      <div key={snack.id} className="flex justify-between text-sm">
                        <span>{snack.name} x {snack.quantity}</span>
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
            <div className="text-center py-4 text-muted-foreground">
              No snacks available
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddSnacks} 
            disabled={selectedSnacks.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Add Snacks
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SessionSnacksPage
