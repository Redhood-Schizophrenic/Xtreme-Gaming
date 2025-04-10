"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@renderer/components/ui/card"
import { Button } from "@renderer/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@renderer/components/ui/table_1"
import { BarChart, LineChart, PieChart, Download, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@renderer/components/ui/select"

export default function ReportsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,245.89</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">20% utilization rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="members">Member Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Station Usage</CardTitle>
                <Select defaultValue="today">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <BarChart className="h-10 w-10" />
                  <span>Station Usage Chart</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Station Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <div className="space-y-6">
                  <div className="grid grid-cols-10 gap-3">
                    {/* Updated bar chart columns with blue styling */}
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-md h-[85%] transition-all duration-300 hover:from-blue-700 hover:to-blue-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PC-01</span>
                      <span className="text-xs text-muted-foreground">8.5h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-md h-[65%] transition-all duration-300 hover:from-blue-700 hover:to-blue-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PC-02</span>
                      <span className="text-xs text-muted-foreground">6.5h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-md h-[95%] transition-all duration-300 hover:from-blue-700 hover:to-blue-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PC-03</span>
                      <span className="text-xs text-muted-foreground">9.5h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-md h-[75%] transition-all duration-300 hover:from-blue-700 hover:to-blue-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PC-04</span>
                      <span className="text-xs text-muted-foreground">7.5h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 rounded-t-md h-[45%] transition-all duration-300 hover:from-blue-700 hover:to-blue-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PC-05</span>
                      <span className="text-xs text-muted-foreground">4.5h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 dark:from-sky-700 dark:to-sky-500 rounded-t-md h-[90%] transition-all duration-300 hover:from-sky-700 hover:to-sky-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PS-01</span>
                      <span className="text-xs text-muted-foreground">9.0h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 dark:from-sky-700 dark:to-sky-500 rounded-t-md h-[100%] transition-all duration-300 hover:from-sky-700 hover:to-sky-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PS-02</span>
                      <span className="text-xs text-muted-foreground">10.0h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-sky-600 to-sky-400 dark:from-sky-700 dark:to-sky-500 rounded-t-md h-[80%] transition-all duration-300 hover:from-sky-700 hover:to-sky-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">PS-03</span>
                      <span className="text-xs text-muted-foreground">8.0h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-700 dark:to-indigo-500 rounded-t-md h-[70%] transition-all duration-300 hover:from-indigo-700 hover:to-indigo-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">VR-01</span>
                      <span className="text-xs text-muted-foreground">7.0h</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-lg h-40 relative overflow-hidden shadow-sm">
                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-700 dark:to-indigo-500 rounded-t-md h-[60%] transition-all duration-300 hover:from-indigo-700 hover:to-indigo-500"></div>
                      </div>
                      <span className="text-xs font-medium mt-2">VR-02</span>
                      <span className="text-xs text-muted-foreground">6.0h</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Usage Hours</p>
                      <p className="text-2xl font-bold">76.5 hours</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                        <span className="text-xs">PC Stations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-600 to-sky-400"></div>
                        <span className="text-xs">PS Stations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"></div>
                        <span className="text-xs">VR Stations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Overview</CardTitle>
                <Select defaultValue="month">
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <LineChart className="h-10 w-10" />
                  <span>Sales Trend Chart</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Daily Reports Card */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Station & Beverage Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pc">
                <TabsList className="mb-4">
                  <TabsTrigger value="pc">PC Stations</TabsTrigger>
                  <TabsTrigger value="ps">PS Stations</TabsTrigger>
                  <TabsTrigger value="drinks">Cold Drinks</TabsTrigger>
                </TabsList>

                <TabsContent value="pc">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Station ID</TableHead>
                        <TableHead>Hours Used</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Utilization %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>PC-01</TableCell>
                        <TableCell>8.5</TableCell>
                        <TableCell>$25.50</TableCell>
                        <TableCell>70.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PC-02</TableCell>
                        <TableCell>6.0</TableCell>
                        <TableCell>$18.00</TableCell>
                        <TableCell>50.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PC-03</TableCell>
                        <TableCell>10.0</TableCell>
                        <TableCell>$30.00</TableCell>
                        <TableCell>83.3%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PC-04</TableCell>
                        <TableCell>7.5</TableCell>
                        <TableCell>$22.50</TableCell>
                        <TableCell>62.5%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="ps">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Station ID</TableHead>
                        <TableHead>Hours Used</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Utilization %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>PS-01</TableCell>
                        <TableCell>9.0</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>75.0%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PS-02</TableCell>
                        <TableCell>11.5</TableCell>
                        <TableCell>$57.50</TableCell>
                        <TableCell>95.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>PS-03</TableCell>
                        <TableCell>8.0</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>66.7%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="drinks">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Beverage</TableHead>
                        <TableHead>Units Sold</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>% of Drink Sales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Cola</TableCell>
                        <TableCell>45</TableCell>
                        <TableCell>$67.50</TableCell>
                        <TableCell>38.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Lemon Soda</TableCell>
                        <TableCell>32</TableCell>
                        <TableCell>$48.00</TableCell>
                        <TableCell>27.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energy Drink</TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>$54.00</TableCell>
                        <TableCell>30.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Iced Tea</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>$7.50</TableCell>
                        <TableCell>4.3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Coffee</TableCell>
                    <TableCell>Drinks</TableCell>
                    <TableCell>145</TableCell>
                    <TableCell>$362.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sandwich</TableCell>
                    <TableCell>Food</TableCell>
                    <TableCell>87</TableCell>
                    <TableCell>$478.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Soda</TableCell>
                    <TableCell>Drinks</TableCell>
                    <TableCell>120</TableCell>
                    <TableCell>$210.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Chips</TableCell>
                    <TableCell>Snacks</TableCell>
                    <TableCell>95</TableCell>
                    <TableCell>$118.75</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-md">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <LineChart className="h-10 w-10" />
                  <span>Member Activity Chart</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Members by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Visit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>42.5</TableCell>
                    <TableCell>$127.50</TableCell>
                    <TableCell>Today</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>38.0</TableCell>
                    <TableCell>$114.00</TableCell>
                    <TableCell>Yesterday</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bob Johnson</TableCell>
                    <TableCell>25.5</TableCell>
                    <TableCell>$76.50</TableCell>
                    <TableCell>3 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alice Brown</TableCell>
                    <TableCell>22.0</TableCell>
                    <TableCell>$66.00</TableCell>
                    <TableCell>1 week ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
