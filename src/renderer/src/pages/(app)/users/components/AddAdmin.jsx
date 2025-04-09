import React from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";
import { useState } from 'react';
import { useCollection } from '@renderer/hooks/pbCollection';

export default function AddAdmin() {
  const { createItem } = useCollection('users');

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    emailVisibility: true,
    password: '',
    passwordConfirm: '',
    role: 'Admin',
  });
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Password validation - only if password field is not empty
      if (formData.password) {
        if (formData.password.length < 8) {
          if (window.api) {
            await window.api.notify('Error', 'Password must be at least 8 characters');
          }
          return;
        }

        if (formData.password !== formData.passwordConfirm) {
          if (window.api) {
            await window.api.notify('Error', 'Passwords do not match');
          }
          return;
        }
      }

      const result = await createItem(formData);
      console.log(result);
      await window.api.notify('Success', 'Admin account created successfully!!!');
    } catch (error) {
      await window.api.notify('Error', 'Error creating account, please try again later....');
    } finally {
      await window.api.customDialogClose();
      setFormData({
        ...formData,
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
      });
    }
  }

  return (
    <section className='p-10'>
      <h1 className='text-2xl font-bold'>Create New Admin</h1>
      <form className='grid gap-4 pt-10'>
        <div className="space-y-4">
          <Label>Username</Label>
          <Input
            type='text'
            value={formData.username}
            onChange={(e) => setFormData({
              ...formData,
              username: e.target.value,
            })}
            placeholder='eg; johndoe001'
            pattern="^[a-z0-9_]+$"
            required
          />
        </div>
        <div className="space-y-4">
          <Label>Full Name</Label>
          <Input
            type='text'
            value={formData.name}
            onChange={(e) => setFormData({
              ...formData,
              name: e.target.value,
            })}
            placeholder='eg; John Doe'
            required
          />
        </div>
        <div className="space-y-4">
          <Label>Email</Label>
          <Input
            type='email'
            value={formData.email}
            onChange={(e) => setFormData({
              ...formData,
              email: e.target.value,
            })}
            placeholder='eg; johndoe@gmail.com'
          />
        </div>
        <div className="space-y-4">
          <Label>Password</Label>
          <div className='flex items-center gap-2'>
            <Input
              type={displayPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value,
              })}
              placeholder='********'
              minLength={8}
            />
            {
              displayPassword ?
                <EyeOff onClick={() => setDisplayPassword(false)} />
                : <Eye onClick={() => setDisplayPassword(true)} />
            }
          </div>
        </div>
        <div className="space-y-4">
          <Label>Confirm Password</Label>
          <div className='flex items-center gap-2'>
            <Input
              type={displayConfirmPassword ? 'text' : 'password'}
              value={formData.passwordConfirm}
              onChange={(e) => setFormData({
                ...formData,
                passwordConfirm: e.target.value,
              })}
              placeholder='********'
              minLength={8}
            />
            {
              displayConfirmPassword ?
                <EyeOff onClick={() => setDisplayConfirmPassword(false)} />
                : <Eye onClick={() => setDisplayConfirmPassword(true)} />
            }
          </div>
        </div>
        <div className="pt-2 w-full">
          <Button
            type='submit'
            className='w-full'
            onClick={onSubmit}
          >
            Create Admin
          </Button>
        </div>
      </form>
    </section>
  )
}
