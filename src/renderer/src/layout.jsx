import { ThemeProvider } from "@renderer/components/ui/theme-provider";
import AppHeader from "@renderer/components/layout/Header";
import { Toaster } from "@renderer/components/ui/sonner";
// import { ProtectedRoute } from "./lib/utils/ProtectedRoute";

export default function MainRootLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="w-full">
        <AppHeader />
        {children}
        <Toaster />
      </main>
    </ThemeProvider>
  )
}
