import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import './index.css'
import InventoryPage from './pages/inventory/page'
import Bookings from './pages/bookings/page'
import CustomersPage from './pages/settings/customer/page'
import MainRootLayout from './layout'
import AddSession from './pages/bookings/add/[device]/page'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
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
      </Routes>
    </Router>
  </StrictMode>,
)
