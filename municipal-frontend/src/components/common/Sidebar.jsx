import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Settings,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const linkStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition";

  const activeStyle = "bg-blue-50 text-blue-600";

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between fixed left-0 top-0">
      {/* Top */}
      <div className="p-5">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-blue-600">Smart Municipal</h1>
          <p className="text-xs text-slate-400">Civic Complaint System</p>
        </div>

        {/* Main Menu */}
        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/new-complaint"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
            }
          >
            <PlusCircle size={18} />
            New Complaint
          </NavLink>

          <NavLink
            to="/my-complaints"
            className={({ isActive }) =>
              `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
            }
          >
            <FolderOpen size={18} />
            My Complaints
          </NavLink>
        </nav>

        {/* Admin Section */}
        {user?.role === "admin" && (
          <>
            <div className="mt-8 mb-2 text-xs text-slate-400 uppercase px-4">
              Admin
            </div>

            <nav className="space-y-1">
              <NavLink
                to="/admin/manage"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
                }
              >
                <Settings size={18} />
                Manage Complaints
              </NavLink>

              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
                }
              >
                <BarChart3 size={18} />
                Analytics
              </NavLink>

              <NavLink
                to="/admin/map"
                className={({ isActive }) =>
                  `${linkStyle} ${isActive ? activeStyle : "hover:bg-slate-100"}`
                }
              >
                Complaint Map
              </NavLink>
            </nav>
          </>
        )}
      </div>

      {/* Bottom User Profile */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
          {user?.name?.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.role}</p>
        </div>
      </div>
    </aside>
  );
}
