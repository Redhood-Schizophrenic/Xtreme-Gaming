import React from 'react'
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { useState } from 'react';
import { useCollection } from '@renderer/hooks/pbCollection';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@renderer/components/ui/select';


export default function AddGroup() {
  const { createItem } = useCollection('groups');

  const [formData, setFormData] = useState({
    name: '',
    type: 'PC',
    price: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createItem(formData);
      console.log(result);
      await window.api.notify('Success', 'Group created successfully!!!');
    } catch (error) {
      await window.api.notify('Error', 'Error creating group, please try again later....');
    } finally {
      await window.api.customDialogClose();
      setFormData({
        name: '',
        type: 'PC',
        price: '',
      });
    }
  }

  const handleClose = async () => {
    await window.api.customDialogClose();
    setFormData({
      name: '',
      type: 'PC',
      price: '',
    });
  }

  return (
    <section className='p-10'>
      <h1 className='text-2xl font-bold'>Create New Group</h1>
      <form className='grid gap-4 pt-10'>
        <div className="space-y-4">
          <Label>Name</Label>
          <Input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value,
            })}
            placeholder='eg; High-End PC'
            required
          />
        </div>
        <div className="space-y-4">
          <Label>Group Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder="Group Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='PS'>Playstation</SelectItem>
              <SelectItem value='PC'>PC-Gaming</SelectItem>
              <SelectItem value='SIM'>Simulator</SelectItem>
              <SelectItem value='VR'>VR Gaming</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label>Price</Label>
          <Input
            type='number'
            value={formData.price}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || !isNaN(value)) {
                setFormData({
                  ...formData,
                  price: value
                });
              }
            }}
            placeholder='eg; 100'
          />
        </div>
        <div className="pt-2 w-full flex items-center gap-2">
          <Button
            variant={'secondary'}
            type='reset'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={onSubmit}
          >
            Create Group
          </Button>
        </div>
      </form>
    </section>
  )
}
