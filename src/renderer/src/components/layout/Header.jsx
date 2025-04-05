'use client';

import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ModeToggle } from '../ui/theme-toggle';
import ProfileIcon from './ProfileIcon';
import Search from '../supporting/Search';
import { useLocation } from 'react-router';

export default function AppHeader() {
  const pathname = useLocation().pathname;
  console.log(pathname);
  const title = pathname.split('/').pop()?.replace(/^\w/, c => c.toUpperCase());

  return (
    <header className="sticky w-full top-0 z-40 border-b bg-background">
      <div className="flex h-12 items-center gap-4 px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="w-full flex justify-between items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className='flex items-center'>
            <Search className='w-full' />
            <ProfileIcon />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
