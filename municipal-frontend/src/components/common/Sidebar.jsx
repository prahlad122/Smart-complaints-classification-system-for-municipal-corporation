import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Bell,
  Settings,
  BarChart3,
  Map,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-white/15 text-white border-l-4 border-white pl-3";

  const inactiveClass =
    "text-blue-100/70 hover:bg-white/10 hover:text-white";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#1e3a5f] flex flex-col justify-between fixed left-0 top-0 z-40">
      {/* Top — Logo */}
      <div className="p-5">
        <div className="mb-8">
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

        {/* Citizen Menu */}
        <div className="mb-2 text-[10px] text-blue-200/40 uppercase tracking-wider px-4 font-semibold">
          Menu
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/new-complaint"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <PlusCircle size={18} />
            New Complaint
          </NavLink>

          <NavLink
            to="/my-complaints"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FolderOpen size={18} />
            My Complaints
          </NavLink>
        </nav>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="mt-8 mb-2 text-[10px] text-blue-200/40 uppercase tracking-wider px-4 font-semibold">
              Admin
            </div>

            <nav className="space-y-1">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </NavLink>

              <NavLink
                to="/admin/manage"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <Settings size={18} />
                Manage Complaints
              </NavLink>

              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <BarChart3 size={18} />
                Analytics
              </NavLink>

              <NavLink
                to="/admin/map"
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

      {/* Bottom — User Profile + Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-blue-200/50 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-blue-100/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
