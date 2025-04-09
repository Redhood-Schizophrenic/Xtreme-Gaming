'use client';

import React, { useCallback, useEffect, useState } from 'react'
import Stats from './components/Stats';
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import DevicesTable from './components/DevicesTable';
import ConsumablesTable from './components/ConsumablesTable';
import LowStockTable from './components/LowStockTable';
import { Button } from '@renderer/components/ui/button';
import { Plus } from 'lucide-react';
import { useCollection } from '@renderer/hooks/pbCollection';

function InventoryPage() {
  const { data: snacks } = useCollection('snacks')
  const { data: devices } = useCollection('devices', {
    expand: 'group'
  })
  const [LowStocks, setLowStocks] = useState([]);
  const [selectedData, setselectedData] = useState('Devices');

  useEffect(() => {
    const fetchData = async () => {
      const low_stock = snacks.filter((snack) => snack?.status === 'Low Stock')
      setLowStocks(low_stock)
    }
    fetchData();
  }, [snacks, devices]);

  const handleAdd = useCallback(async (page) => {
    await window.api.customDialog(page);
  }, []);

  return (
    <section className='h-auto p-4'>
      <Stats snacks={snacks} devices={devices} data={selectedData} setData={setselectedData} />
      <Card className={'w-full mt-4'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>{selectedData}</CardTitle>
            {
              selectedData === 'Devices' ? (
                <Button className={'flex items-center'} onClick={() => handleAdd('device_add_dialog')}>
                  <p>Add</p>
                  <Plus />
                </Button>
              ) : (
                selectedData === 'Consumables' ? (
                  <Button className={'flex items-center'} onClick={() => handleAdd('snack_add_dialog')}>
                    <p>Add</p>
                    <Plus />
                  </Button>
                ) : ''
              )
            }
          </div>
        </CardHeader>
        <CardContent>
          {
            selectedData === 'Devices' ? (
              <DevicesTable data={devices} />
            ) : (
              selectedData === 'Consumables' ? (
                <ConsumablesTable data={snacks} />
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
