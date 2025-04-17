import { ThemeProvider } from "@renderer/components/ui/theme-provider";
import AppHeader from "@renderer/components/layout/Header";
import { Toaster } from "@renderer/components/ui/sonner";
import { ProtectedRoute } from "./lib/utils/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import PendingPaymentsSheet from "./components/PendingPaymentsSheet";

export default function MainRootLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="w-full">
            <AppHeader />
            {children}
            <PendingPaymentsSheet />
            <Toaster richColors />
          </main>
        </ThemeProvider>
      </ProtectedRoute>
    </AuthProvider>
  )
}

export function ThemedLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}
