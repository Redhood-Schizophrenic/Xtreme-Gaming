import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card";
import DevicesTable from './components/DevicesTable';
import { Button } from '@renderer/components/ui/button';
import { Plus } from 'lucide-react';
import { useCollection } from '@renderer/hooks/pbCollection';

export default function StationPage() {
  const { data: devices } = useCollection('devices', {
    expand: 'group'
  });
  const handleAdd = useCallback(async (page) => {
    await window.api.customDialog(page);
  }, []);

  return (
    <section className='p-10'>
      <Card className={'w-full mt-4'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Devices</CardTitle>
            <Button className={'flex items-center'} onClick={() => handleAdd('device_add_dialog')}>
              <p>Add</p>
              <Plus />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DevicesTable data={devices} />
        </CardContent>
      </Card>
    </section>
  )
};
