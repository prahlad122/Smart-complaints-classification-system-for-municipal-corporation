import { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import { getComplaintStats } from "../../services/complaintService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getComplaintStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  };

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">Total Complaints</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Pending Complaints</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">Resolved Complaints</h3>
          <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
        </Card>
      </div>
    </div>
  );
}
