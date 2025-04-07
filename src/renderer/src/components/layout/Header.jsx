// Remove the 'use client' directive since it's not needed in Vite
import { ModeToggle } from '../ui/theme-toggle';
import ProfileIcon from './ProfileIcon';
import Search from '../supporting/Search';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { navLinks } from '../../lib/data/Navbar';

export default function AppHeader() {
  const [currentNav, setcurrentNav] = useState('');
  const location = useLocation(); // Use the location object from react-router-dom

  useEffect(() => {
    if (navLinks) {
      const pathname = location.pathname;
      const title = pathname.split('/').pop()?.replace(/^\w/, c => c.toLowerCase());
      if (title) {
        navLinks.forEach((navItem) => {
          if (navItem.id === title) {
            setcurrentNav(title);
          }
        });
      }
    }
  }, [location, navLinks]);

  return (
    <header className="sticky w-full top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="w-full flex justify-between items-center gap-2">
          {/* Left Container */}
          <div className='flex items-center p-2 gap-6'>
            <h1 className='uppercase font-black bg-primary text-background p-1.5 rounded-full'>
              XG
            </h1>
            <div className="flex gap-4 items-center">
              {
                navLinks.map((navItem) => (
                  <a
                    href={navItem.href}
                    key={navItem.id}
                    className={`text-sm uppercase p-2 ${currentNav === navItem.id ? 'text-primary/70 border-b border-primary' : 'text-foreground/80'}`}
                  >
                    {navItem.name}
                  </a>
                ))
              }
            </div>
          </div>

          {/* Right Container */}
          <div className='flex items-center'>
            <ProfileIcon />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
