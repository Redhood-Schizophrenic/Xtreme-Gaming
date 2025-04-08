import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import './index.css'
import InventoryPage from './pages/inventory/page'
import Bookings from './pages/bookings/page'
import CustomersPage from './pages/settings/customer/page'
import MainRootLayout, { ThemedLayout } from './layout'
import AddSession from './pages/bookings/add/[device]/page'
import UsersPage from './pages/(app)/users/Users'
import AddAdmin from './pages/(app)/users/components/AddAdmin'
import Login from './pages/(auth)/login/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      {/* App */}
      <Routes>
        <Route
          path='/'
          element={
            <MainRootLayout>
              <InventoryPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/users'
          element={
            <MainRootLayout>
              <UsersPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/bookings'
          element={
            <MainRootLayout>
              <Bookings />
            </MainRootLayout>
          }
        />
        <Route
          path='/bookings/add/:device'
          element={
            <MainRootLayout>
              <AddSession />
            </MainRootLayout>
          }
        />
        <Route
          path='/inventory'
          element={
            <MainRootLayout>
              <InventoryPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/settings'
          element={
            <MainRootLayout>
              <CustomersPage />
            </MainRootLayout>
          }
        />

        {/* Auth */}
        <Route
          path='/login'
          element={
            <ThemedLayout>
              <Login />
            </ThemedLayout>
          }
        />

        {/* Modal Pages */}
        <Route
          path='/admin_add_dialog'
          element={
            <ThemedLayout>
              <AddAdmin />
            </ThemedLayout>
          }
        />
      </Routes>
    </Router>
  </StrictMode>,
)
