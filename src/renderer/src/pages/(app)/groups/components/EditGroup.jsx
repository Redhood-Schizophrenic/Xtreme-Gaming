import React, { useEffect, useState } from 'react'
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { useCollection } from '@renderer/hooks/pbCollection';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@renderer/components/ui/select';
import { useParams } from 'react-router';

export default function EditGroup() {
  const { group_id } = useParams();
  const { updateItem, data } = useCollection('groups');
  const [formData, setFormData] = useState({
    name: '',
    type: 'PC',
    price: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load group data when component mounts or group_id changes
  useEffect(() => {
    const loadGroupData = async () => {
      try {
        // Check if we have group_id from params or from Electron IPC
        let currentGroupId = group_id;

        if (currentGroupId && data.length > 0) {
          const foundGroup = data.find(group => group?.id === currentGroupId);
          if (foundGroup) {
            setFormData({
              name: foundGroup.name || '',
              type: foundGroup.type || 'PC',
              price: foundGroup.price || '',
            });
          }
        }
      } catch (error) {
        await window.api?.notify('Error', 'Failed to load group data');
      }
    };

    loadGroupData();
  }, [group_id, data]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      await window.api?.notify('Error', 'Group name is required');
      return;
    }

    setIsLoading(true);
    try {
      // Get the current group ID either from params or from Electron IPC
      let currentGroupId = group_id;
      if (!currentGroupId) {
        throw new Error('No group ID available');
      }

      await updateItem(currentGroupId, formData);
      await window.api?.notify('Success', 'Group updated successfully!');
    } catch (error) {
      if (error) {
        await window.api?.notify('Error', error);
      } else {
        await window.api?.notify('Error', 'Error updating group, please try again later...');
      }
    } finally {
      setIsLoading(false);
      await window.api?.customDialogClose();
      setFormData({
        name: '',
        type: 'PC',
        price: '',
      });
    }
  };

  const handleClose = async () => {
    await window.api?.customDialogClose();
  };

  return (
    <section className="p-10">
      <h1 className="text-2xl font-bold">Edit Group</h1>
      <form className="grid gap-4 pt-6">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value,
            })}
            placeholder="eg; High-End PC"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Group Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Group Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PS">Playstation</SelectItem>
              <SelectItem value="PC">PC-Gaming</SelectItem>
              <SelectItem value="SIM">Simulator</SelectItem>
              <SelectItem value="VR">VR Gaming</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            type="number"
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
            placeholder="eg; 100"
          />
        </div>

        <div className="pt-4 w-full flex items-center gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Group'}
          </Button>
        </div>
      </form>
    </section>
  );
}
