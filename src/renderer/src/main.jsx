import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import './index.css'
import InventoryPage from './pages/(app)/inventory/page'
import Bookings from './pages/bookings/page'
import CustomersPage from './pages/settings/customer/page'
import MainRootLayout, { ThemedLayout } from './layout'
import AddSession from './pages/bookings/add/[device]/page'
import UsersPage from './pages/(app)/users/Users'
import AddAdmin from './pages/(app)/users/components/AddAdmin'
import Login from './pages/(auth)/login/Login'
import AddStaff from './pages/(app)/users/components/AddStaff'
import AddCustomer from './pages/(app)/users/components/AddCustomer'
import GroupsPage from './pages/(app)/groups/page'
import AddGroup from './pages/(app)/groups/components/AddGroup'
import EditGroup from './pages/(app)/groups/components/EditGroup'
import EditAdmin from './pages/(app)/users/components/EditAdmin'
import EditStaff from './pages/(app)/users/components/EditStaff'
import EditCustomer from './pages/(app)/users/components/EditCustomer'
import AddDevice from './pages/(app)/inventory/components/AddDevice'
import EditDevice from './pages/(app)/inventory/components/EditDevice'

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
          path='/groups'
          element={
            <MainRootLayout>
              <GroupsPage />
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

        {/* Add Modal Pages */}
        <Route
          path='/admin_add_dialog'
          element={
            <ThemedLayout>
              <AddAdmin />
            </ThemedLayout>
          }
        />
        <Route
          path='/staff_add_dialog'
          element={
            <ThemedLayout>
              <AddStaff />
            </ThemedLayout>
          }
        />
        <Route
          path='/customer_add_dialog'
          element={
            <ThemedLayout>
              <AddCustomer />
            </ThemedLayout>
          }
        />
        <Route
          path='/group_add_dialog'
          element={
            <ThemedLayout>
              <AddGroup />
            </ThemedLayout>
          }
        />
        <Route
          path='/device_add_dialog'
          element={
            <ThemedLayout>
              <AddDevice />
            </ThemedLayout>
          }
        />

        {/* Edit Modal Pages */}
        <Route
          path='/group_edit_dialog/:group_id'
          element={
            <ThemedLayout>
              <EditGroup />
            </ThemedLayout>
          }
        />
        <Route
          path='/admin_edit_dialog/:user_id'
          element={
            <ThemedLayout>
              <EditAdmin />
            </ThemedLayout>
          }
        />
        <Route
          path='/staff_edit_dialog/:user_id'
          element={
            <ThemedLayout>
              <EditStaff />
            </ThemedLayout>
          }
        />
        <Route
          path='/customer_edit_dialog/:user_id'
          element={
            <ThemedLayout>
              <EditCustomer />
            </ThemedLayout>
          }
        />
        <Route
          path='/device_edit_dialog/:device_id'
          element={
            <ThemedLayout>
              <EditDevice />
            </ThemedLayout>
          }
        />
      </Routes>
    </Router>
  </StrictMode>,
)
