//frontend/src/components/proposals/ProposalUpdateForm.jsx
import { useState } from "react";
import Button from "../ui/Button";
import { useNotification } from "../../hooks/useNotification";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ProposalUpdateForm = ({ project, onSubmit }) => {
  const initialLocation = typeof project.location === 'string'
    && project.location.includes(',')
    ? {
        lat: parseFloat(project.location.split(',')[0]),
        lng: parseFloat(project.location.split(',')[1])
      }
    : { lat: 0, lng: 0 };
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    budget: project.budget.toString(),
    expectedYield: project.expected_yield || "",
    projectType: project.project_type || "",
    duration: project.duration_months.toString(),
    fundingGoal: project.funding_goal.toString(),
    fundingDeadline: project.funding_deadline?.split("T")[0] || "",
    farmSize: project.farm_size?.toString() || "1",
    location: initialLocation,
    placeName: '',
  });
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        budget: parseFloat(formData.budget),
        fundingGoal: parseFloat(formData.fundingGoal),
        duration: parseInt(formData.duration, 10),
        farmSize: parseFloat(formData.farmSize),
      });
    } catch (error) {
      showNotification("Error", "Failed to update project", error);
    } finally {
      setLoading(false);
    }
  };
  function MapEvents({ onClick }) {
    useMapEvents({
      click(e) {
        onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Type
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select type</option>
            <option>Crop Production</option>
            <option>Livestock</option>
            <option>Irrigation</option>
            <option>Equipment</option>
            <option>Processing</option>
            <option>Storage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (months)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Required (USD)
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funding Goal (USD)
          </label>
          <input
            type="number"
            name="fundingGoal"
            value={formData.fundingGoal}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expected Yield
        </label>
        <textarea
          name="expectedYield"
          value={formData.expectedYield}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Location
        </label>
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer
            center={[formData.location.lat, formData.location.lng]}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[formData.location.lat, formData.location.lng]} />
            <MapEvents
              onClick={(latlng) => {
                setFormData((f) => ({ ...f, location: latlng, placeName: "" }));
              }}
            />
          </MapContainer>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {formData.placeName ||
            (formData.location && typeof formData.location.lat === "number"
              ? `Lat: ${formData.location.lat.toFixed(4)}, Lng: ${formData.location.lng.toFixed(4)}`
              : "Click on the map to pick a location")}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Size (acres)
        </label>
        <input
          type="number"
          name="farmSize"
          value={formData.farmSize}
          onChange={handleChange}
          min="1"
          max="1000"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" loading={loading}>
          Update Project
        </Button>
      </div>
    </form>
  );
};

export default ProposalUpdateForm;
