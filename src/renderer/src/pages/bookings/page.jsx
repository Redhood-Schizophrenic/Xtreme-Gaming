'use client';

import { fetchDevices } from '@renderer/lib/data/Devices';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Checkbox } from "@renderer/components/ui/checkbox";
import { Cookie, Monitor, Pause, Play, Timer } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu"
import { Button } from '@renderer/components/ui/button';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router';

function Bookings() {
  const router = useNavigate();
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devices = await fetchDevices();
        setDevices(devices);
      } catch (error) {
        toast.error('Error fetching Devices, Please try again later...')
      }
    }
    fetchData();
  }, []);

  const handleDeviceSelect = (device) => {
    // Check if the device is available
    if (device.status !== 'Available') {
      setSelectedDevices(prev => {
        // Check if the device is already selected by its name
        const isAlreadySelected = prev.some(selectedDevice =>
          selectedDevice === device.name
        );

        if (isAlreadySelected) {
          // If already selected, remove it
          return prev.filter(selectedDevice => selectedDevice !== device.name);
        } else {
          // If not selected, add it
          return [...prev, device.name];
        }
      });
    } else {
      // Optionally, you can add a toast or visual feedback for unavailable devices
      toast.warning(`${device.name} is not available for merge`);
    }
  };

  return (
    <div className="p-4">
      {
        selectedDevices.length > 1 && (
          <div className='flex items-center gap-4 mb-4'>
            <Button>Merge</Button>
          </div>
        )
      }
      <div className="grid grid-cols-10 gap-4">
        {devices.map((device, index) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger asChild>
              <div>
                <Card
                  className={`cursor-pointer transition-all p-1 flex flex-col items-center m-0 ${selectedDevices.includes(device.name)
                    ? 'border-primary border-2'
                    : ''
                    }
							${device.status === 'Available'
                      ? ''
                      : 'text-primary bg-primary/20'
                    }
						`}
                  onClick={() => handleDeviceSelect(device)}
                >
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedDevices.includes(device.name)}
                      className={'hidden'}
                      onCheckedChange={() => handleDeviceSelect(device.name)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col gap-2 items-center justify-center'>
                    <Monitor />
                    <h3 className="font-medium text-xs">{device.name}</h3>
                  </div>

                </CardContent>
                </Card>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                disabled={device.status !== 'Available'}
                onClick={() => router(`/bookings/add/${device?.name}`)}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                <span>Start</span>
              </ContextMenuItem>
              <ContextMenuItem
                disabled={device.status !== 'Occupied'}
                className="flex items-center gap-2"
              >
                <Timer className="h-4 w-4" />
                <span>Extend</span>
              </ContextMenuItem>
              <ContextMenuItem
                disabled={device.status !== 'Occupied'}
                className="flex items-center gap-2"
              >
                <Cookie className="h-4 w-4" />
                <span>Snacks</span>
              </ContextMenuItem>
              <ContextMenuItem
                disabled={device.status !== 'Occupied'}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                <span>Stop</span>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>

      <Outlet />
    </div>
  )
}

export default Bookings;
