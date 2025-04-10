import React, { useCallback, useEffect, useState } from 'react'
import Stats from './components/Stats';
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import ConsumablesTable from './components/ConsumablesTable';
import { Button } from '@renderer/components/ui/button';
import { Plus } from 'lucide-react';
import { useCollection } from '@renderer/hooks/pbCollection';

function InventoryPage() {
  const { data: snacks } = useCollection('snacks')
  const { data: devices } = useCollection('devices', {
    expand: 'group'
  })
  const [Stocks, setStocks] = useState([]);
  const [selectedData, setselectedData] = useState('Total Stock');

  useEffect(() => {
    const fetchData = async () => {
      switch (selectedData) {
        case 'Stocks':
          setStocks(snacks.filter((snack) => snack?.location === 'Stock'));
          break;
        case 'Fridge':
          setStocks(snacks.filter((snack) => snack?.location === 'Fridge'));
          break;
        case 'Low Stock':
          setStocks(snacks.filter((snack) => snack?.status === 'Low Stock'));
          break;
        default:
          setStocks(snacks);
          break;
      }
    }
    fetchData();
  }, [snacks, selectedData]);

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
              (
                selectedData === 'Total Stock' ? (
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
          <ConsumablesTable data={Stocks} />
        </CardContent>
      </Card>

    </section>
  )
}

export default InventoryPage;
