import { useEffect, useState } from "react";
import {
  getComplaintStats,
  getAllComplaints,
} from "../../services/complaintService";
import { broadcastNotification } from "../../services/adminApi";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Megaphone,
  X,
  Send,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [complaints, setComplaints] = useState([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: "", message: "" });
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          getComplaintStats(),
          getAllComplaints(),
        ]);
        setStats(statsRes.data);
        setComplaints(complaintsRes.data || []);
      } catch (err) {
        console.error("Admin dashboard error", err);
      }
    };
    fetchData();
  }, []);

  // Category data for bar chart
  const categories = [
    "Sanitation",
    "Road Maintenance",
    "Electricity",
    "Water Supply",
    "Parks & Recreation",
    "Other",
  ];
  const categoryData = categories.map((cat) => ({
    name: cat.length > 10 ? cat.substring(0, 10) + "…" : cat,
    value: complaints.filter((c) => c.category === cat).length,
  }));

  // Status data for pie chart
  const statusData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.inProgress },
    { name: "Resolved", value: stats.resolved },
  ];
  const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  // Recent 5 complaints
  const recentComplaints = complaints.slice(0, 5);

  const handleBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) return;
    setBroadcastLoading(true);
    try {
      const res = await broadcastNotification(broadcastForm);
      setBroadcastResult(res.data.message);
      setBroadcastForm({ title: "", message: "" });
      setTimeout(() => {
        setShowBroadcast(false);
        setBroadcastResult("");
      }, 2000);
    } catch (err) {
      setBroadcastResult("Failed to send broadcast");
    } finally {
      setBroadcastLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <button
          onClick={() => setShowBroadcast(true)}
          className="flex items-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Megaphone size={16} />
          Broadcast Message
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock size={18} className="text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, percent }) =>
                  percent > 0.01 ? `${name} ${(percent * 100).toFixed(0)}%` : null
                }
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Complaints by Category
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#64748b"][
                        i % 6
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Complaints
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-500">
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Priority</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.map((c) => (
              <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-6 py-3 font-medium text-slate-700">
                  {c.title}
                </td>
                <td className="px-6 py-3 text-blue-600">{c.category}</td>
                <td className="px-6 py-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      c.priority === "Critical"
                        ? "bg-red-600 text-white"
                        : c.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : c.priority === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {c.priority}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      c.status === "Resolved"
                        ? "bg-emerald-100 text-emerald-700"
                        : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-slate-500">{c.user?.name}</td>
                <td className="px-6 py-3 text-slate-400 text-xs">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {recentComplaints.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                  No complaints yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Broadcast Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Megaphone size={20} />
                Broadcast Notification
              </h3>
              <button
                onClick={() => {
                  setShowBroadcast(false);
                  setBroadcastResult("");
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {broadcastResult ? (
              <div className="text-center py-4">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-emerald-700">{broadcastResult}</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={broadcastForm.title}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, title: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                    placeholder="Notification title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={broadcastForm.message}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, message: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none"
                    placeholder="Write your message..."
                  />
                </div>
                <button
                  onClick={handleBroadcast}
                  disabled={broadcastLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-60"
                >
                  {broadcastLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send size={14} />
                      Send to All Citizens
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
