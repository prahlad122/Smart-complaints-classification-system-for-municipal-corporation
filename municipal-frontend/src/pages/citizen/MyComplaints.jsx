import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { Trash2 } from "lucide-react";
import {
  getMyComplaints,
  deleteComplaint,
} from "../../services/complaintService";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 🗑 DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?",
    );

    if (!confirmDelete) return;

    try {
      await deleteComplaint(id);

      // remove from UI instantly
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete complaint", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <p className="text-slate-500">Loading complaints...</p>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <h2 className="text-2xl font-bold mb-6">My Complaints</h2>

      {complaints.length === 0 ? (
        <p className="text-slate-500">
          You have not submitted any complaints yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint._id}>
              {/* Image */}
              {complaint.image && (
                <img
                  src={`http://localhost:5000/${complaint.image}`}
                  alt="complaint"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              {/* Title */}
              <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
              <p className="text-xs text-blue-600 mb-2">
                Category: {complaint.category}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-3">
                {complaint.description}
              </p>

              {/* Location */}
              <p className="text-sm text-slate-500 mb-3">
                {complaint.location}
              </p>
                
              {/* Footer */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                    complaint.status,
                  )}`}
                >

                  {complaint.status || "Pending"}
                </span>

                <span className="text-xs text-slate-400">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(complaint._id)}
                className="mt-4 w-full text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-md py-1 hover:bg-red-50 transition"
              >
                <Trash2 size={20} />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
