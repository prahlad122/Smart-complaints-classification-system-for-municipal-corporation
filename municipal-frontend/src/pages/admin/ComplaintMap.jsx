import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllComplaints } from "../../services/complaintService";
import "leaflet.heat";
import L from "leaflet";

// Fix default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ---------- HEATMAP LAYER ---------- */
function HeatmapLayer({ complaints }) {
  const map = useMap();

  useEffect(() => {
    if (!complaints.length) return;

    const heatPoints = complaints
      .filter((c) => c.lat && c.lng)
      .map((c) => [c.lat, c.lng, 0.5]);

    if (heatPoints.length === 0) return;

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 20,
      maxZoom: 17,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [complaints, map]);

  return null;
}

/* ---------- STATUS COLORS ---------- */
const STATUS_COLORS = {
  Pending: "#f59e0b",
  "In Progress": "#3b82f6",
  Resolved: "#10b981",
};

/* ---------- MAIN COMPONENT ---------- */
export default function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);
  const [viewMode, setViewMode] = useState("markers"); // "markers" | "heatmap"
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await getAllComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      console.error("Failed to load complaints", error);
    }
  };

  const mappable = complaints.filter((c) => c.lat && c.lng);
  const filtered =
    statusFilter === "All"
      ? mappable
      : mappable.filter((c) => c.status === statusFilter);

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800">Complaint Map</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {complaints.length} complaints mapped
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* View Toggle */}
          <div className="flex flex-1 sm:flex-none bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("markers")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                viewMode === "markers"
                  ? "bg-[#1e3a5f] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              Markers
            </button>
            <button
              onClick={() => setViewMode("heatmap")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition ${
                viewMode === "heatmap"
                  ? "bg-[#1e3a5f] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
               Heatmap
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Legend */}
     <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3">
        <span className="w-full sm:w-auto text-xs text-slate-500 font-medium">Legend:</span>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-slate-600">{status}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="h-[350px] sm:h-[450px] lg:h-[550px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={[26.8467, 80.9462]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Heatmap Mode */}
          {viewMode === "heatmap" && <HeatmapLayer complaints={filtered} />}

          {/* Marker Mode */}
          {viewMode === "markers" &&
            filtered.map((c) => (
              <CircleMarker
                key={c._id}
                center={[c.lat, c.lng]}
                radius={7}
                pathOptions={{
                  fillColor: STATUS_COLORS[c.status] || "#64748b",
                  color: "#fff",
                  weight: 2,
                  fillOpacity: 0.9,
                }}
              >
                <Popup>
                  <div className="min-w-[160px] max-w-[220px]">
                    <p className="font-semibold text-sm leading-5 mb-1 break-words">{c.title}</p>
                    <p className="text-xs text-slate-500 mb-2 break-words">📍 {c.location}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: STATUS_COLORS[c.status] + "22",
                          color: STATUS_COLORS[c.status],
                        }}
                      >
                        {c.status}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                        {c.category}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
