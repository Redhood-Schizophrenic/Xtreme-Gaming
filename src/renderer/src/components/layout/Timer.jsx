import React, { useEffect, useState } from 'react'
import { Label } from "@renderer/components/ui/label";

export default function TimeComponent() {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).toUpperCase(); // To ensure "pm" instead of "PM"
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));
  const [currentDate, setCurrentDate] = useState(formatDate(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
      setCurrentDate(formatDate(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className='ml-10 flex flex-col justify-end items-end'>
      <Label className='text-2xl font-bold'>{currentTime}</Label>
      <Label className='text-foreground/60 font-bold'>{currentDate}</Label>
    </div>
  );
}
