import React from 'react'
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { useState, useEffect } from 'react';
import { useCollection } from '@renderer/hooks/pbCollection';
import { useParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@renderer/components/ui/select";

export default function EditCustomer() {
  const { user_id } = useParams();
  const { updateItem: updateUserInfo, data: users } = useCollection('users');
  const { updateItem: updateCustomerInfo, data: customers } = useCollection('customers', {
    expand: 'user'
  });

  const [formData, setFormData] = useState({
    id: '',
    username: '',
    name: '',
    email: '',
    wallet: '',
    type: 'Post-Paid',
    membership: 'Standard',
    contact: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        let currentId = user_id;

        // If no user_id from params, try to get it from Electron IPC
        if (!currentId && window.api) {
          try {
            currentId = await window.api.invoke('get-edit-user-id');
          } catch (err) {
            console.error('Failed to get user ID:', err);
          }
        }

        if (currentId && customers && customers.length > 0) {
          const found = customers.find(item => item?.user === currentId);
          if (found) {
            setFormData({
              id: found.id,
              name: found.expand?.user?.name || '',
              username: found.expand?.user?.username || '',
              email: found.expand?.user?.email || '',
              wallet: found.wallet || '',
              type: found.type || 'Post-Paid',
              membership: found.membership || 'Standard',
              contact: found.contact || '',
            });
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (window.api) {
          await window.api.notify('Error', 'Failed to load user data');
        }
      }
    };

    loadData();
  }, [user_id, customers]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.name || !formData.type || !formData.membership) {
      if (window.api) {
        await window.api.notify('Error', 'Fill required values');
      }
      return;
    }

    setIsLoading(true);
    try {
      // Get the current user ID either from params or from Electron IPC
      let currentId = user_id;

      if (!currentId && window.api) {
        currentId = await window.api.invoke('get-edit-user-id');
      }

      if (!currentId || !formData.id) {
        throw new Error('No User ID available');
      }

      // Prepare user data update
      const userData = {
        username: formData.username,
        name: formData.name,
        email: formData.email
      };

      // Prepare customer data update
      const customerData = {
        wallet: formData.wallet,
        type: formData.type,
        membership: formData.membership,
        contact: formData.contact
      };

      // Update user and customer data
      await updateUserInfo(currentId, userData);
      await updateCustomerInfo(formData.id, customerData);

      if (window.api) {
        await window.api.notify('Success', 'User info updated successfully!');

        // Optionally refresh the parent window's data
        try {
          await window.api.invoke('refresh-users-data');
        } catch (err) {
          console.log('Optional refresh failed:', err);
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (window.api) {
        if (error?.message) {
          await window.api.notify('Error', error.message);
        } else {
          await window.api.notify('Error', 'Error updating user info, please try again later...');
        }
      }
    } finally {
      setIsLoading(false);
      if (window.api) {
        await window.api.customDialogClose();
      }
    }
  };

  const handleClose = async () => {
    if (window.api) {
      await window.api.customDialogClose();
    }
  };

  return (
    <section className="p-10">
      <h1 className="text-2xl font-bold">Edit Customer</h1>
      <form className="grid gap-4 pt-6">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({
              ...formData,
              username: e.target.value,
            })}
            placeholder="eg; johndoe001"
            pattern="^[a-z0-9_]+$"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value,
            })}
            placeholder="eg; John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({
              ...formData,
              email: e.target.value,
            })}
            placeholder="eg; johndoe@gmail.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Contact Number</Label>
          <Input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({
              ...formData,
              contact: e.target.value,
            })}
            placeholder="eg; 123-456-7890"
          />
        </div>
        <div className="space-y-2">
          <Label>Customer Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pre-paid">Pre-paid</SelectItem>
              <SelectItem value="Post-Paid">Post-paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Membership</Label>
          <Select
            value={formData.membership}
            onValueChange={(value) => setFormData({ ...formData, membership: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Wallet</Label>
          <Input
            type="number"
            value={formData.wallet}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || !isNaN(value)) {
                setFormData({
                  ...formData,
                  wallet: value
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
            disabled={isLoading}
            className="flex-1"
            onClick={onSubmit}
          >
            {isLoading ? 'Updating...' : 'Update Customer'}
          </Button>
        </div>
      </form>
    </section>
  );
}
