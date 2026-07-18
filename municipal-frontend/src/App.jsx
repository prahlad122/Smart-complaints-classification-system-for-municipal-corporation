import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

import Dashboard from "./pages/citizen/Dashboard";
import NewComplaint from "./pages/citizen/NewComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import ComplaintMap from "./pages/admin/ComplaintMap";

function Layout() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthPage && (
        <>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ${!isAuthPage ? "lg:ml-64" : ""}
        `}
      >
        {!isAuthPage && (
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <main
          className={!isAuthPage ? "pt-20 p-4 sm:p-5 lg:p-6" : "min-h-screen"}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Citizen */}
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

            {/* Admin */}
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
