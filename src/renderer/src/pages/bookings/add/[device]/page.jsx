'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardFooter, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Label } from '@renderer/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { toast } from 'sonner';
import fetchCustomers from '@renderer/lib/data/Customers';
import { Button } from '@renderer/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom'

function AddSession() {
  const router = useNavigate();
  const { device: slug } = useParams();
  const [Customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customers = await fetchCustomers();
        setCustomers(customers);
      } catch (error) {
        toast.error('Error Fetching Customers, please try again later...')

      }
    }
    fetchData();
  }, []);



  return (
    <div className='p-4'>
      <Card className={'p-4'}>
        <CardHeader>
          <CardTitle>Create a New Session for {slug}</CardTitle>
        </CardHeader>
        <form className='grid gap-4'>
          <div className='grid gap-2'>
            <Label> Customer </Label>
            <Select>
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                {
                  Customers.map((customer) => (
                    <SelectItem value={customer.name} key={customer.name}>{customer.name}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label> Time Package </Label>
            <Select>
              <SelectTrigger className={'w-full'}>
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={0.5}>30 minutes</SelectItem>
                <SelectItem value={1}>1 Hour</SelectItem>
                <SelectItem value={2}>2 Hour</SelectItem>
                <SelectItem value={3}>3 Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <CardFooter className={'gap-4'}>
          <Button variant={'outline'} onClick={() => router('/bookings')}>Close</Button>
          <Button>Create Session</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default AddSession;
