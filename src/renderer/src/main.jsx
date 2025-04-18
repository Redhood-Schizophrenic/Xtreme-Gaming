import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import LogsPage from './pages/(app)/logs/page'
import InventoryPage from './pages/(app)/inventory/page'
import HomePage from './pages/home/page'
import Bookings from './pages/bookings/page'
import MainRootLayout, { ThemedLayout } from './layout'
import AddSession from './pages/bookings/add/[device]/page'
import UsersPage from './pages/(app)/users/Users'
import AddAdmin from './pages/(app)/users/components/AddAdmin'
import Login from './pages/(auth)/login/Login'
import AddStaff from './pages/(app)/users/components/AddStaff'
import AddCustomer from './pages/(app)/users/components/AddCustomer'
import GroupsPage from './pages/(app)/settings/groups/page'
import AddGroup from './pages/(app)/settings/groups/components/AddGroup'
import EditGroup from './pages/(app)/settings/groups/components/EditGroup'
import EditAdmin from './pages/(app)/users/components/EditAdmin'
import EditStaff from './pages/(app)/users/components/EditStaff'
import EditCustomer from './pages/(app)/users/components/EditCustomer'
import AddDevice from './pages/(app)/settings/station/components/AddDevice'
import EditDevice from './pages/(app)/settings/station/components/EditDevice'
import AddSnack from './pages/(app)/inventory/components/AddSnacks'
import EditSnack from './pages/(app)/inventory/components/EditSnacks'
import SettingsPage from './pages/(app)/settings/page'
import StationPage from './pages/(app)/settings/station/page'
import BackupPage from './pages/(app)/settings/backup/page'
import ReportsPage from './pages/(app)/reports/page'
import SessionBookingPage from './pages/session-booking/[deviceId]/page'
import DeviceInfoPage from './pages/device-info/[deviceId]/page'
import SessionSnacksPage from './pages/session-snacks/[sessionId]/page'
import DashboardPage from './pages/(app)/dashboard/page'
import UpdateStock from './pages/(app)/inventory/components/UpdateStock'
import UpdateDeviceStatus from './pages/(app)/settings/station/components/UpdateDeviceStatus'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      {/* App */}
      <Routes>
        <Route
          path='/'
          element={
            <MainRootLayout>
              <HomePage />
            </MainRootLayout>
          }
        />
        <Route
          path='/dashboard'
          element={
            <MainRootLayout>
              <DashboardPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/logs'
          element={
            <MainRootLayout>
              <LogsPage />
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
              <SettingsPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/settings/groups'
          element={
            <MainRootLayout>
              <GroupsPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/settings/station'
          element={
            <MainRootLayout>
              <StationPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/settings/backup'
          element={
            <MainRootLayout>
              <BackupPage />
            </MainRootLayout>
          }
        />
        <Route
          path='/reports'
          element={
            <MainRootLayout>
              <ReportsPage />
            </MainRootLayout>
          }
        />
        <Route
          path="/session-booking/:deviceId"
          element={
            <ThemedLayout>
              <SessionBookingPage />
            </ThemedLayout>
          }
        />
        <Route
          path="/device-info/:deviceId"
          element={
            <ThemedLayout>
              <DeviceInfoPage />
            </ThemedLayout>
          }
        />
        <Route
          path="/session-snacks/:sessionId"
          element={
            <ThemedLayout>
              <SessionSnacksPage />
            </ThemedLayout>
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
        <Route
          path='/snack_add_dialog'
          element={
            <ThemedLayout>
              <AddSnack />
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
        <Route
          path='/device_update_dialog/:device_id'
          element={
            <ThemedLayout>
              <UpdateDeviceStatus />
            </ThemedLayout>
          }
        />
        <Route
          path='/snack_edit_dialog/:snack_id'
          element={
            <ThemedLayout>
              <EditSnack />
            </ThemedLayout>
          }
        />
        <Route
          path='/snack_update_dialog/:snack_id'
          element={
            <ThemedLayout>
              <UpdateStock />
            </ThemedLayout>
          }
        />
      </Routes>
    </Router>
  </StrictMode>,
)
