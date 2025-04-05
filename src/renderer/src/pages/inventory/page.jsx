'use client';

import React, { useEffect, useState } from 'react'
import Stats from './components/Stats';
import { fetchSnacks } from '@renderer/lib/data/Snacks';
import { fetchDevices } from '@renderer/lib/data/Devices';
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import DevicesTable from './components/DevicesTable';
import ConsumablesTable from './components/ConsumablesTable';
import LowStockTable from './components/LowStockTable';
import { Button } from '@renderer/components/ui/button';
import { Plus } from 'lucide-react';

function InventoryPage() {
  const [Snacks, setSnacks] = useState([]);
  const [Devices, setDevices] = useState([]);
  const [LowStocks, setLowStocks] = useState([]);
  const [selectedData, setselectedData] = useState('Devices');

  useEffect(() => {
    const fetchData = async () => {
      const snacks = await fetchSnacks();
      const devices = await fetchDevices();
      const low_stock = snacks.filter((snack) => snack?.status === 'Low Stock')
      setSnacks(snacks);
      setDevices(devices);
      setLowStocks(low_stock)
    }
    fetchData();
  }, []);

  return (
    <section className='h-auto p-4'>
      <Stats snacks={Snacks} devices={Devices} data={selectedData} setData={setselectedData} />
      <Card className={'w-full mt-4'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h1>{selectedData}</h1>
            {
              selectedData === 'Devices' ? (
                <Button className={'flex items-center'}>
                  <p>Add</p>
                  <Plus />
                </Button>
              ) : (
                selectedData === 'Consumables' ? (
                  <Button className={'flex items-center'}>
                    <p>Add</p>
                    <Plus />
                  </Button>
                ) : (
                  <Button className={'flex items-center'}>
                    <p>Add</p>
                    <Plus />
                  </Button>
                )
              )
            }
          </div>
        </CardHeader>
        <CardContent>
          {
            selectedData === 'Devices' ? (
              <DevicesTable data={Devices} />
            ) : (
              selectedData === 'Consumables' ? (
                <ConsumablesTable data={Snacks} />
              ) : (
                <LowStockTable data={LowStocks} />
              )
            )
          }
        </CardContent>
      </Card>

    </section>
  )
}

export default InventoryPage;
