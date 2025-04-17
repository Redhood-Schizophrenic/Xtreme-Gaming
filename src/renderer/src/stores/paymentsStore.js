import { create } from 'zustand';

export const usePaymentsStore = create((set) => ({
  isPaymentsSheetOpen: false,
  pendingPayments: [],
  
  togglePaymentsSheet: () => set((state) => ({ isPaymentsSheetOpen: !state.isPaymentsSheetOpen })),
  openPaymentsSheet: () => set({ isPaymentsSheetOpen: true }),
  closePaymentsSheet: () => set({ isPaymentsSheetOpen: false }),
  
  setPendingPayments: (payments) => set({ pendingPayments: payments }),
  addPendingPayment: (payment) => set((state) => ({ 
    pendingPayments: [...state.pendingPayments, payment] 
  })),
  removePendingPayment: (paymentId) => set((state) => ({ 
    pendingPayments: state.pendingPayments.filter(payment => payment.id !== paymentId) 
  })),
  clearPendingPayments: () => set({ pendingPayments: [] }),
}));
