import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Dashboard from "./pages/citizen/Dashboard";
import NewComplaint from "./pages/citizen/NewComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";
import AdminRoute from "./components/common/AdminRoute";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import ComplaintMap from "./pages/admin/ComplaintMap";

function Layout() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex">
      {!isAuthPage && <Sidebar />}

      <div
        className={`flex-1 ${!isAuthPage ? "ml-64" : ""} bg-slate-50 min-h-screen`}
      >
        {!isAuthPage && <Navbar />}

        <main className={!isAuthPage ? "p-6 pt-20" : ""}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-complaint"
              element={
                <ProtectedRoute>
                  <NewComplaint />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-complaints"
              element={
                <ProtectedRoute>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/manage"
              element={
                <AdminRoute>
                  <ManageComplaints />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/map"
              element={
                <AdminRoute>
                  <ComplaintMap />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
