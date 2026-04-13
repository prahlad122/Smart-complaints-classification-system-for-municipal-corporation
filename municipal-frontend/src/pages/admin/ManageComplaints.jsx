import { useEffect, useState } from "react";
import {
  getAllComplaints,
  updateComplaint,
} from "../../services/complaintService";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const handleUpdate = async (id, status, department) => {
    try {
      await updateComplaint(id, { status, department });

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status, department } : c)),
      );

      setSelectedComplaint((prev) =>
        prev ? { ...prev, status, department } : prev,
      );
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search complaints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-xl text-sm w-64"
          />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Complaints</p>
            <p className="text-2xl font-bold">{totalComplaints}</p>
          </div>

          <div className="bg-yellow-50 border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-2xl font-bold">{pendingComplaints}</p>
          </div>

          <div className="bg-blue-50 border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-blue-700">In Progress</p>
            <p className="text-2xl font-bold">{inProgressComplaints}</p>
          </div>

          <div className="bg-green-50 border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-green-700">Resolved</p>
            <p className="text-2xl font-bold">{resolvedComplaints}</p>
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          {["All", "Pending", "In Progress", "Resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1 bg-slate-100 rounded text-sm"
            >
              {status}
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-slate-600">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">User</th>
            </tr>
          </thead>

          <tbody>
            {complaints
              .filter((c) => {
                const matchStatus =
                  statusFilter === "All" || c.status === statusFilter;

                const matchSearch = `${c.title} ${c.location}`
                  .toLowerCase()
                  .includes(search.toLowerCase());

                return matchStatus && matchSearch;
              })
              .map((complaint) => (
                <tr
                  key={complaint._id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className="border-b hover:bg-slate-50 cursor-pointer"
                >
                  <td className="p-4 font-medium">{complaint.title}</td>

                  <td className="p-4 text-blue-600">{complaint.category}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        complaint.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : complaint.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {complaint.priority}
                    </span>
                  </td>

                  <td className="p-4 text-slate-600">{complaint.location}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${statusColor(
                        complaint.status,
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-500">{complaint.user?.name}</td>
                  
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Complaint Detail Drawer ---------------- */}

      {selectedComplaint && (
        <div className="fixed inset-0 flex justify-end bg-black/40 z-50">
          <div className="w-[420px] bg-white h-full p-6 overflow-y-auto shadow-xl">
            {/* Close */}
            <button
              onClick={() => setSelectedComplaint(null)}
              className="text-sm text-slate-500 mb-4"
            >
              Close
            </button>

            <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>

            {/* Image */}
            {selectedComplaint.image && (
              <img
                src={`http://localhost:5000/${selectedComplaint.image}`}
                alt="complaint"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
            )}

            {/* Title */}
            <h3 className="font-semibold text-lg mb-2">
              {selectedComplaint.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-3">
              {selectedComplaint.description}
            </p>

            {/* Location */}
            <p className="text-sm text-slate-500 mb-3">
              Location: {selectedComplaint.location}
            </p>

            {/* Category */}
            <p className="text-sm text-blue-600 mb-3">
              Category: {selectedComplaint.category}
            </p>

            <p className="text-sm mb-3">
              Priority:
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  selectedComplaint.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : selectedComplaint.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {selectedComplaint.priority}
              </span>
            </p>

            {/* User */}
            <p className="text-xs text-slate-400 mb-4">
              Reported by: {selectedComplaint.user?.name}
            </p>

            {/* Department */}
            <label className="text-sm font-medium">Department</label>

            <select
              className="border rounded p-2 w-full mb-4"
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
              <option>Sanitation</option>
              <option>Road Maintenance</option>
              <option>Water Supply</option>
              <option>Electricity</option>
            </select>

            {/* Status */}
            <label className="text-sm font-medium">Status</label>

            <select
              className="border rounded p-2 w-full"
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

            {/* ---------------- Complaint History ---------------- */}

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Complaint History</h3>

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
    </div>
  );
}
