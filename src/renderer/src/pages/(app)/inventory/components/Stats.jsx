'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Cookie, MonitorSmartphone, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from 'react'

function StatsCard({ stat, setData }) {
  return (
    <Card onClick={() => setData(stat.title)} className={'cursor-pointer'}>
      <div className="flex items-center justify-between">
        <CardHeader className={'w-full'}>
          <CardDescription className={'w-full'}>
            <div className="flex justify-between items-center w-full">
              <p>{stat.title}</p>
              <stat.icon size={20} />
            </div>
          </CardDescription>
          <CardTitle>{stat.description}</CardTitle>
        </CardHeader>
      </div>
    </Card>
  );

}

function Stats({ snacks, devices, setData }) {
  console.log(snacks)
  const [StatsData, setStatsData] = useState([
    {
      title: 'Devices',
      description: 0,
      icon: MonitorSmartphone,
    },
    {
      title: 'Consumables',
      description: 0,
      icon: Cookie,
    },
    {
      title: 'Low Stock',
      description: 0,
      icon: TriangleAlert,
    },
  ]);

  useEffect(() => {
    const StatsCalc = () => {
      setStatsData((prevStats) =>
        prevStats.map((stat) => {
          if (stat.title === "Devices") {
            return { ...stat, description: devices?.length || 0 };
          }
          if (stat.title === "Consumables") {
            return { ...stat, description: snacks?.length || 0 };
          }
          if (stat.title === "Low Stock") {
            return {
              ...stat, description: snacks?.filter((snack) => snack?.status === 'Low Stock')?.length
            };
          }
          return stat;
        })
      );

    }
    StatsCalc();
  }, [snacks, devices]);


  return (
    <div className="grid grid-cols-3 gap-4">
      {
        StatsData.map((stat, index) => (
          <StatsCard key={index} stat={stat} setData={setData} />
        ))
      }
    </div>
  )
}

export default Stats
