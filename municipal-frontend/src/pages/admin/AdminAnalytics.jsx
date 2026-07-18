import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { getAllComplaints } from "../../services/complaintService";

export default function AdminAnalytics() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------- STATUS DATA ---------- */
  const statusData = [
    {
      name: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
    },
    {
      name: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
    },
  ];

  /* ---------- CATEGORY DATA ---------- */
  const categories = [
    "Sanitation",
    "Road Maintenance",
    "Electricity",
    "Water Supply",
    "Parks & Recreation",
    "Other",
  ];

  const categoryData = categories.map((cat) => ({
    name: cat,
    value: complaints.filter((c) => c.category === cat).length,
  }));

  /* ---------- PRIORITY DATA ---------- */
  const priorities = ["Low", "Medium", "High", "Critical"];
  const priorityData = priorities.map((p) => ({
    name: p,
    value: complaints.filter((c) => c.priority === p).length,
  }));

  /* ---------- MONTHLY TREND ---------- */
  const monthlyData = (() => {
    const months = {};
    complaints.forEach((c) => {
      const date = new Date(c.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (!months[key]) {
        months[key] = { key, name: label, total: 0, resolved: 0 };
      }
      months[key].total++;
      if (c.status === "Resolved") months[key].resolved++;
    });
    return Object.values(months).sort((a, b) => a.key.localeCompare(b.key));
  })();

  const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];
  const CATEGORY_COLORS = [
    "#3b82f6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#64748b",
  ];
  const PRIORITY_COLORS = ["#94a3b8", "#f59e0b", "#ef4444", "#7f1d1d"];

  /* ---------- SUMMARY ---------- */
  const total = complaints.length;
  const pending = statusData[0].value;
  const progress = statusData[1].value;
  const resolved = statusData[2].value;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;

  // AI classification rate
  const aiClassified = complaints.filter(
    (c) => c.aiConfidence && c.aiConfidence >= 0.7,
  ).length;
  const aiRate = total > 0 ? ((aiClassified / total) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      <h1 className="text-xl sm:text-2xl lg:text-2xl sm:text-3xl font-bold text-slate-800">
        Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl sm:text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-2xl sm:text-3xl font-bold">{pending}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-2xl sm:text-3xl font-bold">{progress}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Resolved</p>
          <p className="text-2xl sm:text-3xl font-bold">{resolved}</p>
        </div>

        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm text-purple-700">Resolution Rate</p>
          <p className="text-2xl sm:text-3xl font-bold">{resolutionRate}%</p>
        </div>
      </div>

      {/* AI Stats */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm text-blue-200/70">AI Classification Rate</p>
            <p className="text-2xl sm:text-3xl font-bold">{aiRate}%</p>
            <p className="text-xs text-blue-200/50 mt-1">
              {aiClassified} of {total} complaints classified with ≥70%
              confidence
            </p>
          </div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray={`${aiRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm overflow-hidden">
          <h2 className="text-base sm:text-lg font-semibold mb-6 text-slate-800">
            Complaints by Status
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={45}
                label={false}
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
        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-slate-800">
            Complaints by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % 6]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Chart */}
        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-slate-800">
            Complaints by Priority
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11 }}
                width={80}
              />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {priorityData.map((_, i) => (
                  <Cell key={i} fill={PRIORITY_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white border rounded-xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-slate-800">
            Complaints Over Time
          </h2>
          {monthlyData.length === 0 ? (
            <div className="h-[280px] sm:h-[300px] flex items-center justify-center text-center px-4 text-slate-400 text-sm">
              Not enough data for trend analysis
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Resolved"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
