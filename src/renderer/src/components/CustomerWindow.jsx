import { useState, useEffect } from 'react';
import { useCollection } from '../hooks/pbCollection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Search, User, Clock, Calendar, Wallet, Timer } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerWindow({ onSelectCustomer }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch customers from PocketBase
  const { data: customers, loading } = useCollection('customers', {
    expand: 'user',
    sort: 'created'
  });

  // Fetch sessions for the selected customer
  const { data: customerSessions } = useCollection('sessions', {
    filter: selectedCustomer ? `customer = "${selectedCustomer.id}" && status != "Cancelled"` : '',
    sort: '-created',
    expand: 'device'
  });

  // Filter customers based on search query
  const filteredCustomers = customers?.filter(customer => {
    const userName = customer.expand?.user?.name?.toLowerCase() || '';
    const userUsername = customer.expand?.user?.username?.toLowerCase() || '';
    const userContact = customer.contact?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return userName.includes(query) || userUsername.includes(query) || userContact.includes(query);
  });

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Select a customer to view details or start a session</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="grid grid-cols-1 gap-0">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="flex justify-center items-center h-20">
                  <p className="text-muted-foreground">Loading customers...</p>
                </div>
              ) : filteredCustomers?.length === 0 ? (
                <div className="flex justify-center items-center h-20">
                  <p className="text-muted-foreground">No customers found</p>
                </div>
              ) : (
                filteredCustomers?.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCustomer?.id === customer.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-accent'
                      }`}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {customer.expand?.user?.name?.charAt(0) || customer.expand?.user?.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium truncate">
                              {customer.expand?.user?.name || customer.expand?.user?.username || 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {customer.contact ? `+91 ${customer.contact}` : 'No contact'}
                            </p>
                            <div className="flex items-center gap-2 w-full">
                              <p className="text-xs text-muted-foreground">Wallet:- ₹{customer.wallet}</p>
                              <p className="text-xs text-muted-foreground">Time:- {(customer.time / 60).toFixed(2)} hrs</p>
                            </div>
                          </div>
                          <Badge variant={customer.membership === 'Member' ? 'default' : 'outline'}>
                            {customer.membership}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {selectedCustomer && (
            <div className="border-t p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {selectedCustomer.expand?.user?.name?.charAt(0) || selectedCustomer.expand?.user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedCustomer.expand?.user?.name || selectedCustomer.expand?.user?.username || 'Unknown'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{selectedCustomer.membership}</span>
                      <Wallet className="h-3 w-3" />
                      <span>{formatCurrency(selectedCustomer.wallet)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="h-3 w-3" />
                      {(selectedCustomer.time / 60).toFixed(2)} hrs
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Recent Sessions</p>
                      <p>{customerSessions?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Joined</p>
                      <p>{selectedCustomer.created ? format(new Date(selectedCustomer.created), 'MMM dd, yyyy') : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {customerSessions && customerSessions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {customerSessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="text-xs p-2 rounded bg-accent">
                          <div className="flex justify-between">
                            <span>{session.expand?.device?.name || 'Unknown Device'}</span>
                            <span>{format(new Date(session.created), 'MMM dd')}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-muted-foreground">{session.duration} hours</span>
                            <span>{formatCurrency(session.total_amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button className="w-full" disabled={!selectedCustomer}>
          Start New Session
        </Button>
      </CardFooter>
    </Card>
  );
}
