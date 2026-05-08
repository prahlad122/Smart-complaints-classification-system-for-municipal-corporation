import { useState } from "react";
import Card from "../../components/ui/Card";
import { createComplaint } from "../../services/complaintService";
import LocationPicker from "../../components/maps/LocationPicker";
import {
  Send,
  RotateCcw,
  Upload,
  MapPin,
  Brain,
  Tag,
  Shield,
  Building2,
  Gauge,
} from "lucide-react";

export default function NewComplaint() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  // AI result display
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve location");
        setGettingLocation(false);
      },
    );
  };

  const handleMapLocation = (lat, lng) => {
    setLat(lat);
    setLng(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      if (lat) formData.append("lat", lat);
      if (lng) formData.append("lng", lng);
      if (image) formData.append("image", image);

      const res = await createComplaint(formData);

      setResult(res.data.complaint);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ title: "", description: "", location: "" });
    setImage(null);
    setPreview(null);
    setLat(null);
    setLng(null);
    setSubmitted(false);
    setResult(null);
  };

  const confidenceColor = (conf) => {
    if (conf >= 0.8) return "text-emerald-600 bg-emerald-100";
    if (conf >= 0.6) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const priorityColor = (p) => {
    switch (p) {
      case "Critical": return "bg-red-600 text-white";
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  /* ---------- SUCCESS SCREEN ---------- */
  if (submitted && result) {
    return (
      <div className="py-10 px-4 flex justify-center">
        <div className="w-full max-w-lg">
          {/* Success Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-emerald-800 mb-1">
              Complaint Submitted! 
            </h2>
            <p className="text-sm text-emerald-600">
              Your complaint has been classified and routed automatically.
            </p>
          </div>

          {/* AI Classification Card */}
          <Card>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Brain size={20} className="text-blue-600" />
              AI Classification Result
            </h3>

            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Tag size={16} />
                  Category
                </div>
                <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {result.category}
                </span>
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield size={16} />
                  Priority
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${priorityColor(result.priority)}`}>
                  {result.priority}
                </span>
              </div>

              {/* Department */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building2 size={16} />
                  Assigned Department
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {result.department}
                </span>
              </div>

              {/* Confidence */}
              {result.aiConfidence != null && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Gauge size={16} />
                      AI Confidence
                    </div>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded ${confidenceColor(result.aiConfidence)}`}>
                      {(result.aiConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(result.aiConfidence * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {result.aiSummary && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-500 font-medium mb-1">AI Summary</p>
                  <p className="text-sm text-blue-800">{result.aiSummary}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Button */}
          <button
            onClick={handleReset}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-3 rounded-lg font-medium text-sm transition"
          >
            <RotateCcw size={16} />
            Submit Another Complaint
          </button>
        </div>
      </div>
    );
  }

  /* ---------- FORM SCREEN ---------- */
  return (
    <div className="py-10 px-4 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
            Submit New Complaint
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Complaint Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition"
                placeholder="e.g. Garbage not collected"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition resize-none"
                placeholder="Explain the issue in detail..."
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] transition"
                placeholder="Area / Landmark"
              />
            </div>

            {/* GPS Location */}
            <div className="mb-5">
              <button
                type="button"
                onClick={getLocation}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 border border-slate-300 rounded-lg py-2.5 text-sm hover:bg-slate-200 transition"
              >
                <MapPin size={16} />
                {gettingLocation ? "Getting GPS Location..." : " Use My Location"}
              </button>
              {lat && lng && (
                <p className="text-xs text-emerald-600 mt-1 text-center font-medium">
                  ✓ Location captured ({lat.toFixed(4)}, {lng.toFixed(4)})
                </p>
              )}
            </div>

            {/* Map Picker */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 text-slate-700">
                Or select location on map
              </p>
              <LocationPicker setCoordinates={handleMapLocation} />
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Upload Image (optional)
              </label>
              <label className="flex items-center justify-center w-full cursor-pointer border-2 border-dashed border-slate-300 rounded-xl py-6 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition">
                <div className="text-center space-y-1">
                  <Upload size={24} className="mx-auto mb-1" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {image && (
                <p className="text-xs text-slate-500 mt-2">Selected: {image.name}</p>
              )}
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mb-6 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-slate-200 shadow"
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] hover:bg-[#2d5a8e] text-white py-3 rounded-lg font-medium text-sm transition disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Classifying & Submitting...
                </span>
              ) : (
                <>
                  <Send size={16} />
                  Submit Complaint
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
