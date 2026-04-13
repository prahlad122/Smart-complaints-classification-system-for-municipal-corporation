import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const menuRef = useRef();

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hide navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-64 h-16 px-6
      flex items-center justify-between
      bg-white/90 backdrop-blur-md
      border-b border-slate-200
      transition-transform duration-300 z-50
      ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
      </div>

      <div className="flex items-center gap-5">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition flex items-center justify-center"
        >

          {/* Notification */}

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition flex items-center justify-center"
          >
            <Bell size={20} className="text-slate-600" />

            {notifications.length > 0 && (
              <span
                className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4
                 bg-red-500 text-white text-[10px] font-semibold
                 w-4 h-4 rounded-full flex items-center justify-center"
              >
                {notifications.length}
              </span>
            )}
          </button>

          {notifications.length > 0 && (
            <span
              className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4
                 bg-red-500 text-white text-[10px] font-semibold
                 w-4 h-4 rounded-full flex items-center justify-center"
            >
              {notifications.length}
            </span>
          )}
        </button>

        {/* Divider */}

        <div className="h-6 w-px bg-slate-300"></div>


        {/* User Menu */}

        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">
                {user?.name || "User"}
              </p>

              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {user?.role || "citizen"}
              </span>
            </div>

            <div
              className="w-9 h-9 rounded-full bg-blue-600 text-white
              flex items-center justify-center text-sm font-semibold"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
 

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-40 bg-white border border-slate-200 rounded-lg shadow-md">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
