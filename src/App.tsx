import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"
import RootLayOut from "./pages/RootLayOut"
import LoginPage from "./pages/auth/LoginPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"

import ChangePasswordPage from "./pages/auth/changePasswordPage"
import { Toaster } from "react-hot-toast"
import AuthPageLayOut from "./pages/auth/authPageLayOut"
import DashboardLayOut from "./pages/dashboard/DashboardLayOut"
import DashboardPage from "./pages/dashboard/DashboardPage"

import ProfilePage from "./pages/dashboard/ProfilePage"
import UsersPage from "./pages/dashboard/users/usersPage"

import AddUserPage from "./pages/dashboard/users/AddUserPage"
import EditUserPage from "./pages/auth/editUserPage"
import IndexPage from "./pages/indexPage"
import VehiclesPage from "./pages/dashboard/vehicles/vehiclesPage"
import TemporaryAccessPage from "./pages/dashboard/report/TransactionsPage"
import AccessReportPage from "./pages/dashboard/report/AccessReportPage"
import ControlPanelPage from "./pages/dashboard/controlPanel/ControlPanelPage"
import SettingsPage from "./pages/settings/SettingsPage"
import TransactionsPage from "./pages/dashboard/report/TransactionsPage"
import PaymentPage from "./pages/payment/paymentPage"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayOut />} errorElement={"Error occured"}>
      <Route index element={<IndexPage />} />
      <Route path="/pay/:id" element={<PaymentPage />} />
      <Route path="/auth" element={<AuthPageLayOut />}>
        <Route index element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/auth/reset-password/change-password"
          element={<ChangePasswordPage />}
        />
      </Route>
      <Route path="/dashboard" element={<DashboardLayOut />}>
        <Route index element={<DashboardPage />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/vehicles" element={<VehiclesPage />} />
        <Route path="/dashboard/users">
          <Route index element={<UsersPage />} />
          <Route path="/dashboard/users/new" element={<AddUserPage />} />
          <Route path="/dashboard/users/:id" element={<EditUserPage />} />
        </Route>
        <Route
          path="/dashboard/report-tempory-access"
          element={<TemporaryAccessPage />}
        />
        <Route path="/dashboard/report" element={<AccessReportPage />} />
        <Route path="/dashboard/transactions" element={<TransactionsPage />} />
        <Route path="/dashboard/control-panel" element={<ControlPanelPage />} />
        <Route path="/dashboard/Settings" element={<SettingsPage />} />
      </Route>
      <Route
        path="/unauthorized"
        element={
          <>
            <h1>Unauthorized</h1>
          </>
        }
      />
    </Route>
  )
)

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
