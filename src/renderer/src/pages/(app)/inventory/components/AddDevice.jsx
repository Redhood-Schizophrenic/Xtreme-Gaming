import React from 'react'
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { useState } from 'react';
import { useCollection } from '@renderer/hooks/pbCollection';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@renderer/components/ui/select';
import { Checkbox } from '@renderer/components/ui/checkbox';

export default function AddDevice() {
  const { createItem } = useCollection('devices');
  const { data: Groups } = useCollection('groups');
  const [formData, setFormData] = useState({
    name: '',
    type: 'PC',
    group: '',
    mac_address: '',
    ip_address: '',
    rules: [],
    status: 'Available'
  });

  const availableRules = [
    'Power_Off',
    'Reboot',
    'Auto_Screenshot',
    'Lockdown'
  ];

  const handleRuleToggle = (ruleId) => {
    setFormData(prev => {
      const isSelected = prev.rules.includes(ruleId);
      let updatedRules;

      if (isSelected) {
        // Remove the rule if already selected
        updatedRules = prev.rules.filter(id => id !== ruleId);
      } else {
        // Add the rule if not selected
        updatedRules = [...prev.rules, ruleId];
      }

      return {
        ...prev,
        rules: updatedRules
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createItem(formData);
      console.log(result);
      await window.api.notify('Success', 'Device added successfully!!!');
    } catch (error) {
      await window.api.notify('Error', 'Error adding device, please try again later....');
    } finally {
      await window.api.customDialogClose();
      resetForm();
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'PC',
      group: '',
      mac_address: '',
      ip_address: '',
      rules: [],
      status: 'active'
    });
  }

  const handleClose = async () => {
    await window.api.customDialogClose();
    resetForm();
  }

  return (
    <section className='p-10'>
      <h1 className='text-2xl font-bold'>Add New Device</h1>
      <form className='grid gap-4 mt-10'>
        <div className="space-y-4">
          <Label>Name</Label>
          <Input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value,
            })}
            placeholder='eg; Gaming PC #1'
            required
          />
        </div>
        <div className="space-y-4">
          <Label>Device Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder="Device Type" />
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
          <Label>Group</Label>
          <Select
            value={formData.group}
            onValueChange={(value) => setFormData({ ...formData, group: value })}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent>
              {
                Groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <Label>MAC Address</Label>
          <Input
            type='text'
            value={formData.mac_address}
            onChange={(e) => setFormData({
              ...formData,
              mac_address: e.target.value,
            })}
            placeholder='eg; 00:1A:2B:3C:4D:5E'
          />
        </div>
        <div className="space-y-4">
          <Label>IP Address</Label>
          <Input
            type='text'
            value={formData.ip_address}
            onChange={(e) => setFormData({
              ...formData,
              ip_address: e.target.value,
            })}
            placeholder='eg; 192.168.1.100'
          />
        </div>
        <div className="space-y-4">
          <Label>Applied Rules</Label>
          <div className="grid gap-2">
            {availableRules.map((rule) => (
              <div key={rule} className="flex items-center space-x-2">
                <Checkbox
                  id={rule}
                  checked={formData.rules.includes(rule)}
                  onCheckedChange={() => handleRuleToggle(rule)}
                />
                <Label
                  htmlFor={rule}
                  className="cursor-pointer"
                >
                  {rule}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Available'>Available</SelectItem>
              <SelectItem value='Occupied'>Occupied</SelectItem>
            </SelectContent>
          </Select>
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
            Add Device
          </Button>
        </div>
      </form>
    </section>
  )
}
