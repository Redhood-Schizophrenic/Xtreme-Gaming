import { ThemeProvider } from "@renderer/components/ui/theme-provider";
import { SidebarProvider } from "@renderer/components/ui/sidebar"
import { AppSidebar } from "@renderer/components/layout/Sidebar";
import AppHeader from "@renderer/components/layout/Header";
import { Toaster } from "@renderer/components/ui/sonner";

export default function MainRootLayout({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppHeader />
          {children}
          <Toaster />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}
