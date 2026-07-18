import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Settings,
  BarChart3,
  Map,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate("/login");
  };

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeClass = "bg-white/15 text-white border-l-4 border-white pl-3";

  const inactiveClass = "text-blue-100/70 hover:bg-white/10 hover:text-white";

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        h-screen w-64
        bg-[#1e3a5f]
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Header */}
      <div className="p-5 overflow-y-auto flex-1">
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-amber-400" />
            <h1 className="text-lg font-bold text-white">Municipal Portal</h1>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="text-white">
            <X size={22} />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:block mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={22} className="text-amber-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">
              Municipal Portal
            </h1>
          </div>

          <p className="text-xs text-blue-200/50 pl-[30px]">
            Smart Complaints System
          </p>
        </div>

        {/* Menu */}
        <div className="mb-2 text-[10px] text-blue-200/40 uppercase tracking-wider px-4 font-semibold">
          Menu
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/new-complaint"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <PlusCircle size={18} />
            New Complaint
          </NavLink>

          <NavLink
            to="/my-complaints"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FolderOpen size={18} />
            My Complaints
          </NavLink>
        </nav>

        {/* Admin */}
        {isAdmin && (
          <>
            <div className="mt-8 mb-2 text-[10px] text-blue-200/40 uppercase tracking-wider px-4 font-semibold">
              Admin
            </div>

            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/manage"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Settings size={18} />
                Manage Complaints
              </NavLink>

              <NavLink
                to="/admin/analytics"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <BarChart3 size={18} />
                Analytics
              </NavLink>

              <NavLink
                to="/admin/map"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Map size={18} />
                Complaint Map
              </NavLink>
            </nav>
          </>
        )}
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-blue-200/60 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-blue-100 hover:bg-red-500/20 hover:text-red-300 transition"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
