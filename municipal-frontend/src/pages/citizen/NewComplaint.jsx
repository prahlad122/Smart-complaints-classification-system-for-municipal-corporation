import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { createComplaint } from "../../services/complaintService";
import LocationPicker from "../../components/maps/LocationPicker";

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- GET GPS LOCATION ---------------- */

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

  /* -- SUBMIT FORM -- */

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

      await createComplaint(formData);

      alert("Complaint submitted successfully!");

      setForm({ title: "", description: "", location: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 flex justify-center">
      <div className="w-full max-w-md">
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Submit New Complaint
          </h2>

          <form onSubmit={handleSubmit}>
            <Input
              label="Complaint Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Garbage not collected..."
            />

            <Input
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the issue..."
            />

            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Area / Landmark"
            />

            {/* ---------------- GET LOCATION BUTTON ---------------- */}

            <div className="mb-5">
              <button
                type="button"
                onClick={getLocation}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg py-2 text-sm hover:bg-slate-200"
              >
                {gettingLocation ? "Getting GPS Location..." : "Use Location"}
              </button>

              {lat && lng && (
                <p className="text-xs text-green-600 mt-1 text-center">
                  Location captured 
                </p>
              )}
            </div>
             

             <div className="mb-6">
              <p className="text-sm font-medium mb-2">Select Location on Map</p>

              <LocationPicker setCoordinates={handleMapLocation} />

              {lat && lng && (
                <p className="text-xs text-green-600 mt-2">
                  Location selected: {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* ---------------- IMAGE UPLOAD ---------------- */}

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-slate-700">
                Upload Image
              </label>

              <label
                className="flex items-center justify-center w-full cursor-pointer
                border-2 border-dashed border-slate-300
                rounded-xl py-6 text-slate-500
                hover:border-blue-500 hover:text-blue-600
                transition"
              >

                
                <div className="text-center space-y-1">
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
                <p className="text-xs text-slate-500 mt-2">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* IMAGE PREVIEW */}

            {preview && (
              <div className="mb-6 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-slate-200 shadow"
                />
              </div>
            )}

            
            <Button type="submit" className="w-full">
              {loading ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
