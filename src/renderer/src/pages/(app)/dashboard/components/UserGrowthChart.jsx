'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

// We'll generate data from users

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border rounded shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function UserGrowthChart({ users }) {
  // Generate user growth data
  const userGrowthData = [];

  // Get months
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthData = {};

  // Initialize data for each month
  months.forEach(month => {
    monthData[month] = { month, users: 0 };
  });

  // Process user data - we'll count users by their creation date
  if (users && users.length > 0) {
    // Sort users by creation date
    const sortedUsers = [...users].sort((a, b) => {
      return new Date(a.created) - new Date(b.created);
    });

    // Count cumulative users by month
    let runningTotal = 0;
    sortedUsers.forEach(user => {
      if (user.created) {
        const date = new Date(user.created);
        const month = months[date.getMonth()];
        runningTotal++;
        // Set all months from this one forward to at least this value
        const monthIndex = date.getMonth();
        for (let i = monthIndex; i < 12; i++) {
          monthData[months[i]].users = Math.max(monthData[months[i]].users, runningTotal);
        }
      }
    });
  }

  // Convert to array for chart
  months.forEach(month => {
    userGrowthData.push(monthData[month]);
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>
          New user registrations over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userGrowthData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              name="Users"
              stroke="var(--chart-2)"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
