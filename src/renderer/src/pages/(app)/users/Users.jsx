import React, { useEffect, useState } from 'react'
import { useCollection } from '../../../hooks/pbCollection'
import Stats from './Stats';
import StaffTable from './components/StaffTable';
import { Card, CardContent, CardHeader } from "@renderer/components/ui/card";
import { Button } from '@renderer/components/ui/button';
import { Plus } from 'lucide-react';

export default function UsersPage() {
  const { data: users } = useCollection('users');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedData, setSelectedData] = useState('Admins')
  useEffect(() => {
    if (users) {
      setFilteredUsers(users?.filter((user) => user?.role === 'Admin'));
    }
  }, [users]);



  return (
    <main className='p-4'>
      <Stats
        users={users}
        setData={setSelectedData}
      />
      <Card className={'w-full mt-4'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <h1>{selectedData}</h1>
            <Button className={'flex items-center'}>
              <p>Add</p>
              <Plus />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <StaffTable data={users} />
        </CardContent>
      </Card>
    </main>
  )
};
