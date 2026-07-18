import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaint,
} from "../../services/complaintService";
import { Search, Filter, X, Download, Brain, CheckCircle2 } from "lucide-react";

const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Resolved"];
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High", "Critical"];
const CATEGORY_OPTIONS = [
  "All",
  "Sanitation",
  "Road Maintenance",
  "Electricity",
  "Water Supply",
  "Parks & Recreation",
  "Other",
];

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpdate = async (id, status, department) => {
    try {
      await updateComplaint(id, { status, department });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status, department } : c)),
      );
      setSelectedComplaint((prev) =>
        prev ? { ...prev, status, department } : prev,
      );
      showToast(" Complaint updated successfully");
    } catch (error) {
      console.error("Update failed", error);
      showToast(" Update failed");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-600 text-white";
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // Filtering
  const filtered = complaints.filter((c) => {
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchPriority =
      priorityFilter === "All" || c.priority === priorityFilter;
    const matchCategory =
      categoryFilter === "All" || c.category === categoryFilter;
    const matchSearch = `${c.title} ${c.location} ${c.user?.name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchPriority && matchCategory && matchSearch;
  });

  // Stats
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending",
  ).length;
  const inProgressComplaints = complaints.filter(
    (c) => c.status === "In Progress",
  ).length;
  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved",
  ).length;

  // CSV Export
  const handleExport = () => {
    const headers = "Title,Category,Priority,Status,Location,User,Date\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.title}","${c.category}","${c.priority}","${c.status}","${c.location}","${c.user?.name || ""}","${new Date(c.createdAt).toLocaleDateString()}"`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaints.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast(" CSV exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Manage Complaints</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Stat Badges */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold">{totalComplaints}</p>
        </div>
        <div className="bg-amber-50 border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-amber-700">Pending</p>
          <p className="text-2xl font-bold">{pendingComplaints}</p>
        </div>
        <div className="bg-blue-50 border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-2xl font-bold">{inProgressComplaints}</p>
        </div>
        <div className="bg-emerald-50 border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-emerald-700">Resolved</p>
          <p className="text-2xl font-bold">{resolvedComplaints}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search complaints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Status" : s}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          >
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p === "All" ? "All Priority" : p}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Category" : c}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-slate-400">
          Showing {filtered.length} of {complaints.length} complaints
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-600">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Priority</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">User</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((complaint) => (
              <tr
                key={complaint._id}
                onClick={() => setSelectedComplaint(complaint)}
                className="border-b hover:bg-slate-50 cursor-pointer transition"
              >
                <td className="p-4 font-medium text-slate-700">
                  {complaint.title}
                </td>
                <td className="p-4 text-blue-600">{complaint.category}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-[11px] rounded-full font-medium ${priorityColor(complaint.priority)}`}
                  >
                    {complaint.priority}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{complaint.location}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-[11px] rounded-full font-medium ${statusColor(complaint.status)}`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{complaint.user?.name}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  No complaints match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      {selectedComplaint && (
        <div className="fixed inset-0 flex justify-end bg-black/40 z-50">
          <div className="w-[440px] bg-white h-full p-6 overflow-y-auto shadow-xl">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition"
            >
              <X size={16} /> Close
            </button>

            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Complaint Details
            </h2>

            {selectedComplaint.image && (
              <img
                src={`http://localhost:5000/${selectedComplaint.image}`}
                alt="complaint"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="font-semibold text-lg mb-2">
              {selectedComplaint.title}
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              {selectedComplaint.description}
            </p>
            <p className="text-sm text-slate-500 mb-3">
              📍 {selectedComplaint.location}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                {selectedComplaint.category}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor(selectedComplaint.priority)}`}
              >
                {selectedComplaint.priority}
              </span>
            </div>

            {/* AI Info */}
            {selectedComplaint.aiConfidence != null && (
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">
                    AI Classification
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-blue-600">Confidence</span>
                  <span className="text-xs font-bold text-blue-700">
                    {(selectedComplaint.aiConfidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{
                      width: `${selectedComplaint.aiConfidence * 100}%`,
                    }}
                  ></div>
                </div>
                {selectedComplaint.aiSummary && (
                  <p className="text-xs text-blue-600 mt-2">
                    {selectedComplaint.aiSummary}
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-slate-400 mb-4">
              Reported by: {selectedComplaint.user?.name}
            </p>

            {/* Department Select */}
            <label className="text-sm font-medium text-slate-700">
              Department
            </label>
            <select
              className="border border-slate-200 rounded-lg p-2 w-full mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              value={selectedComplaint.department}
              onChange={(e) =>
                handleUpdate(
                  selectedComplaint._id,
                  selectedComplaint.status,
                  e.target.value,
                )
              }
            >
              <option>Unassigned</option>
              <option>Waste Management Department</option>
              <option>Public Works Department</option>
              <option>Electricity Board</option>
              <option>Water Department</option>
              <option>Parks Department</option>
              <option>General Department</option>
            </select>

            {/* Status Select */}
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              className="border border-slate-200 rounded-lg p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
              value={selectedComplaint.status}
              onChange={(e) =>
                handleUpdate(
                  selectedComplaint._id,
                  e.target.value,
                  selectedComplaint.department,
                )
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            {/* History */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3 text-slate-700">
                Complaint History
              </h3>
              <div className="space-y-3">
                {selectedComplaint.history?.length ? (
                  selectedComplaint.history.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-3 text-sm"
                    >
                      <p className="text-slate-700">{item.action}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
