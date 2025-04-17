import { useEffect } from 'react';
import { usePaymentsStore } from '../stores/paymentsStore';
import { useCollection } from '../hooks/pbCollection';
import { format } from 'date-fns';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from './ui/sheet';
import { Button } from './ui/button';
import { Check, CreditCard, X } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

export default function PendingPaymentsSheet() {
  const { isPaymentsSheetOpen, closePaymentsSheet, pendingPayments, setPendingPayments } = usePaymentsStore();
  
  // Fetch sessions with status "Closed" but not fully paid
  const { data: sessions, loading } = useCollection('sessions', {
    sort: '-created',
    filter: 'status = "Closed" && amount_paid < total_amount',
    expand: 'device,customer,customer.user'
  });

  useEffect(() => {
    if (sessions) {
      setPendingPayments(sessions);
    }
  }, [sessions, setPendingPayments]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  return (
    <Sheet open={isPaymentsSheetOpen} onOpenChange={closePaymentsSheet}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Pending Payments</SheetTitle>
          <SheetDescription>
            Sessions that require payment processing
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)] mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Loading pending payments...</p>
            </div>
          ) : pendingPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-muted-foreground">No pending payments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{payment.expand?.customer?.expand?.user?.name || 'Unknown Customer'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {payment.expand?.device?.name || 'Unknown Device'} • {format(new Date(payment.created), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge variant={payment.amount_paid > 0 ? "outline" : "destructive"}>
                      {payment.amount_paid > 0 ? 'Partially Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p>{payment.duration} hours</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium">{formatCurrency(payment.total_amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Paid</p>
                      <p>{formatCurrency(payment.amount_paid)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Balance</p>
                      <p className="font-medium text-destructive">
                        {formatCurrency(payment.total_amount - payment.amount_paid)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <CreditCard className="h-4 w-4" />
                      Process Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
