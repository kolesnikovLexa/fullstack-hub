import { Routes, Route, Outlet } from "react-router-dom"

import Header from "./components/layout/Header"
import Sidebar from "./components/layout/Sidebar"
import Dashboard from "./pages/DashboardPage/DashboardPage"
import Employees from "./pages/EmployeesPage/EmployeesPage"
import Settings from "./pages/SettingsPage/SettingsPage"
import EmployeeDetails from "./pages/EmployeesPage/EmployeeDetails"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"

function AppLayout() {
  return (
    <section className="page">
      <Header />

      <section className="content">
        <Sidebar />
        <Outlet />
      </section>
    </section>
  )
}

function App() {
  return (
    <Routes>
      {/* Публичные страницы без Header и Sidebar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Все страницы внутри этого route требуют авторизации */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/employees" element={<Employees />}>
            <Route path=":employeeId" element={<EmployeeDetails />} />
          </Route>

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
