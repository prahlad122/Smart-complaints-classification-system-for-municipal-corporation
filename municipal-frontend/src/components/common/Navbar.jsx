import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
} from "../../services/notificationService";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/new-complaint": "Submit New Complaint",
  "/my-complaints": "My Complaints",
  "/admin": "Admin Dashboard",
  "/admin/manage": "Manage Complaints",
  "/admin/analytics": "Analytics",
  "/admin/map": "Complaint Map",
};

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const dropdownRef = useRef();

  const pageTitle = PAGE_TITLES[location.pathname] || "Portal";

  // Poll unread count every 30 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await getUnreadCount();
        setUnreadCount(res.data.count);
      } catch {
        // silent fail
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch recent notifications when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      const fetchRecent = async () => {
        try {
          const res = await getNotifications();
          setRecentNotifications(res.data.slice(0, 5));
        } catch {
          // silent fail
        }
      };
      fetchRecent();
    }
  }, [dropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setUnreadCount(0);
      setRecentNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch {
      // silent fail
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 z-50">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <span className="text-sm font-semibold text-slate-700">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {recentNotifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    No notifications yet
                  </div>
                ) : (
                  recentNotifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b border-slate-50 last:border-b-0 transition ${
                        n.read
                          ? "bg-white"
                          : "bg-blue-50/50 border-l-2 border-l-blue-500"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-700">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700">
              {user?.name || "User"}
            </p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 capitalize">
              {user?.role || "citizen"}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
