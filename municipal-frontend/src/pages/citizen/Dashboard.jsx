import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  TrendingUp,
} from "lucide-react";
import { getMyComplaints } from "../../services/complaintService";

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyComplaints();
        setComplaints(res.data);
      } catch (err) {
        console.error("Failed to load complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const recentComplaints = complaints.slice(0, 3);

  const statusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const priorityStyle = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-900 text-white";
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "Citizen"}
            </h1>
            <p className="text-blue-100/80 max-w-md">
              Report civic issues, track complaint progress, and stay updated
              with your city services — all in one place.
            </p>

            <Link
              to="/new-complaint"
              className="inline-flex items-center gap-2 mt-5 bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition shadow-md hover:shadow-lg"
            >
              <ClipboardPlus size={18} />
              Submit New Complaint
              <ArrowRight size={16} />
            </Link>
          </div>

          <Building2 size={90} className="text-white/20 hidden md:block" />
        </div>
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
          <p className="text-2xl font-bold text-slate-800">
            {loading ? "–" : total}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock size={18} className="text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            {loading ? "–" : pending}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle size={18} className="text-blue-600" />
            </div>
            <span className="text-sm text-slate-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {loading ? "–" : inProgress}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <span className="text-sm text-slate-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {loading ? "–" : resolved}
          </p>
        </div>
      </div>

      {/* Recent Complaints */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Complaints
          </h2>
          {complaints.length > 3 && (
            <Link
              to="/my-complaints"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
            >
              View all <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-slate-400 py-8 text-center">
            Loading...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <ClipboardPlus size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No complaints submitted yet</p>
            <Link
              to="/new-complaint"
              className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5a8e] transition"
            >
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {recentComplaints.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-800 line-clamp-1">
                    {c.title}
                  </h3>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${statusStyle(c.status)}`}
                  >
                    {c.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                    {c.category}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-medium ${priorityStyle(c.priority)}`}
                  >
                    {c.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-2">{c.department}</p>
                <p className="text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
