import React, { useCallback, useEffect, useState } from 'react'
import { useCollection } from '../../../hooks/pbCollection'
import Stats from './components/Stats';
import StaffTable from './components/StaffTable';
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Button } from "@renderer/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const { data: users } = useCollection('users');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedData, setSelectedData] = useState('Admins')
  useEffect(() => {
    if (selectedData === 'Admins') {
      setFilteredUsers(users?.filter((user) => user?.role === 'Admin'));
    } else if (selectedData === 'Staffs') {
      setFilteredUsers(users?.filter((user) => user?.role === 'Staffs'));
    } else if (selectedData === 'Customers') {
      setFilteredUsers(users?.filter((user) => user?.role === 'User'));
    }
  }, [users, selectedData]);

  const handleDialog = useCallback(async (page) => {
    try {
      const result = await window.api.customDialog(page);
      console.log(result);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  return (
    <main className='p-4'>
      <Stats
        users={users}
        setData={setSelectedData}
      />
      <Card className={'w-full mt-4'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h1 className='font-bold text-2xl'>{selectedData}</h1>
            {
              selectedData === 'Admins' ? (
                <Button onClick={() => handleDialog('admin_add_dialog')}>
                  <p>Add</p>
                  <PlusIcon />
                </Button>
              ) : ''
            }
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable data={filteredUsers} />
        </CardContent>
      </Card>
    </main>
  )
};
