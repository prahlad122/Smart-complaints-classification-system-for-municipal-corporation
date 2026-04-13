import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getAllComplaints } from "../../services/complaintService";
import "leaflet.heat";
import L from "leaflet";

/* ---------------- HEATMAP LAYER COMPONENT ---------------- */  

function HeatmapLayer({ complaints }) {
  const map = useMap();

  useEffect(() => {
    if (!complaints.length) return;

    const heatPoints = complaints
      .filter((c) => c.lat && c.lng)
      .map((c) => [c.lat, c.lng, 0.5]);

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

/* ---------------- MAIN COMPONENT ---------------- */

export default function ComplaintMap() {
  const [complaints, setComplaints] = useState([]);

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

  return (
    <div className="container-app py-8">
      <h1 className="text-3xl font-bold mb-6">Complaint Map</h1>

      <div className="h-[500px] rounded-xl overflow-hidden">
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Heatmap Layer */}
          <HeatmapLayer complaints={complaints} />

          {/* Markers */}

          {complaints.map((c) => {
            if (!c.lat || !c.lng) return null;

            return (
              <Marker key={c._id} position={[c.lat, c.lng]}>
                <Popup>
                  <strong>{c.title}</strong>
                  <br />
                  {c.location}
                  <br />
                  Status: {c.status}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
