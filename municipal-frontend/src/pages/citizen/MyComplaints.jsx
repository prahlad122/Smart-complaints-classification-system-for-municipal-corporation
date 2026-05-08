import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Trash2, Filter, Search, Clock, FolderOpen } from "lucide-react";
import {
  getMyComplaints,
  deleteComplaint,
} from "../../services/complaintService";

const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Resolved"];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getMyComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete complaint", err);
    }
  };

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
        return "bg-red-600 text-white";
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchStatus =
      statusFilter === "All" || c.status === statusFilter;
    const matchSearch = `${c.title} ${c.location} ${c.description}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="py-10 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
        Loading complaints...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">My Complaints</h2>
        <span className="text-sm text-slate-500">
          {filteredComplaints.length} of {complaints.length} complaints
        </span>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === status
                  ? "bg-[#1e3a5f] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderOpen size={44} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-1">No complaints found</p>
          <p className="text-xs text-slate-400">
            {complaints.length === 0
              ? "You haven't submitted any complaints yet."
              : "Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Image */}
              {complaint.image && (
                <img
                  src={`http://localhost:5000/${complaint.image}`}
                  alt="complaint"
                  className="w-full h-36 object-cover"
                />
              )}

              <div className="p-5">
                {/* Title */}
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">
                  {complaint.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                    {complaint.category}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityStyle(complaint.priority)}`}
                  >
                    {complaint.priority}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {complaint.description}
                </p>

                {/* Location */}
                <p className="text-xs text-slate-500 mb-2">
                   {complaint.location}
                </p>

                {/* AI Confidence Bar */}
                {complaint.aiConfidence != null && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400">AI Confidence</span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {(complaint.aiConfidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${complaint.aiConfidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusStyle(complaint.status)}`}
                  >
                    {complaint.status || "Pending"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleDelete(complaint._id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
