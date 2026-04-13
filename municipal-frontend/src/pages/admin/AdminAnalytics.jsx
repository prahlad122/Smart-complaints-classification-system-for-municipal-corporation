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

  /* ---------------- STATUS DATA ---------------- */

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

  /* ---------------- CATEGORY DATA ---------------- */

  const categories = [
    "Sanitation",
    "Road Maintenance",
    "Electricity",
    "Water Supply",
  ];

  const categoryData = categories.map((cat) => ({
    name: cat,
    value: complaints.filter((c) => c.category === cat).length,
  }));

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"];

  /* ---------------- SUMMARY ---------------- */

  const total = complaints.length;
  const pending = statusData[0].value;
  const progress = statusData[1].value;
  const resolved = statusData[2].value;

  return (
    <div className="container-app py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

      {/* ---------------- SUMMARY CARDS ---------------- */}

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Complaints</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-yellow-50 border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-3xl font-bold">{pending}</p>
        </div>

        <div className="bg-blue-50 border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-3xl font-bold">{progress}</p>
        </div>

        <div className="bg-green-50 border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-700">Resolved</p>
          <p className="text-3xl font-bold">{resolved}</p>
        </div>
      </div>

      {/* ---------------- CHART SECTION ---------------- */}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* STATUS PIE CHART */}

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Complaints by Status</h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 30, right: 50, left: 50, bottom: 30 }}>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={140}
                labelLine={true}
                label={({ cx, cy, midAngle, outerRadius, percent, index }) => {
                  if (percent < 0.01) return null;

                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 15;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill={COLORS[index % COLORS.length]}
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      fontWeight="bold"
                    >
                      {(percent * 100).toFixed(0)}%
                    </text>
                  );
                }}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY BAR CHART */}

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Complaints by Category</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"][index % 4]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
