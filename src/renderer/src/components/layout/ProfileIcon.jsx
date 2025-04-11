"use client"

import {
  ChevronDown,
  LogOut,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@renderer/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import { Button } from "@renderer/components/ui/button";
import React from 'react';
import { useAuth } from "@renderer/contexts/AuthContext";

export default function ProfileIcon() {
  const { currentUser, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="lg"
            variant='ghost'
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-full">
                {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={"bottom"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentUser?.name || 'Test User'}
                </span>
                <span className="truncate text-xs">
                  {currentUser?.email || 'testuser@xtreme.in'}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
