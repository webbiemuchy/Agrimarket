// frontend/src/components/proposals/ProposalForm.jsx
import { useState } from "react";
import { MapPin } from "lucide-react";
import Button from "../ui/Button";
import Stepper from "../ui/Stepper";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNotification } from "../../hooks/useNotification";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ProposalForm = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1);
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: { lat: -1.2921, lng: 36.8219 }, 
    placeName: "",
    farmSize: 1,
    budget: "",
    expectedYield: "",
    projectType: "Crop Production",
    duration: 3, 
    fundingGoal: "",
    fundingDeadline: "",
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    
    if (
      !formData.title ||
      !formData.description ||
      !formData.budget ||
      !formData.expectedYield ||
      !formData.fundingGoal ||
      !formData.fundingDeadline
    ) {
      showNotification("Error", "Please fill in all required fields", "error");
      return;
    }

    const submissionData = {
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget),
      location: formData.location,
      placeName: formData.placeName,
      expectedYield: formData.expectedYield,
      projectType: formData.projectType,
      duration: parseInt(formData.duration, 10),
      fundingGoal: parseFloat(formData.fundingGoal),
      fundingDeadline: formData.fundingDeadline,
      farmSize: parseFloat(formData.farmSize),
    };

    onSubmit(submissionData);
  };

 
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          location: { lat, lng },
          placeName: "",
        }));

        (async () => {
          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const json = await resp.json();
            if (json.address) {
              const { city, town, village, county, state, country } =
                json.address;
              const placeName = [city, town, village, county, state, country]
                .filter(Boolean)
                .join(", ");

              setFormData((prev) => ({
                ...prev,
                placeName,
              }));
            }
          } catch (err) {
            console.warn("Reverse geocode failed", err);
          }
        })();
      },
    });
    return null;
  };

  return (
    <div className="space-y-6">
      <Stepper
        steps={4}
        currentStep={step}
        labels={[
          "Project Details",
          "Location & Farm Size",
          "Financial Information",
          "Review & Submit",
        ]}
      />

      <form onSubmit={handleFormSubmit}>
        
        {step === 1 && (
          <div className="space-y-6">
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
                placeholder="e.g., Organic Maize Farming Project"
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
                placeholder="Describe your project in detail..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
          </div>
        )}

        
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm Location
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Click on the map to pick your farm location
              </p>
              <div className="h-80 rounded-lg overflow-hidden">
                <MapContainer
                  center={[formData.location.lat, formData.location.lng]}
                  zoom={8}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  <Marker
                    position={[formData.location.lat, formData.location.lng]}
                  />
                  <MapEvents />
                </MapContainer>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-1" />
                {formData.placeName
                  ? formData.placeName
                  : `Lat: ${formData.location.lat.toFixed(
                      4
                    )}, Lng: ${formData.location.lng.toFixed(4)}`}
              </div>
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
              <div className="flex justify-between text-sm text-gray-600">
                <span>1</span>
                <span>{formData.farmSize}</span>
                <span>1000</span>
              </div>
            </div>
          </div>
        )}

       
        {step === 3 && (
          <div className="space-y-6">
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
                placeholder="e.g., 5000"
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
                placeholder="e.g., 5000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Deadline
              </label>
              <input
                type="date"
                name="fundingDeadline"
                value={formData.fundingDeadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
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
                placeholder="e.g., 20 tons maize, 10 tons vegetables"
                required
              />
            </div>
          </div>
        )}

        
        {step === 4 && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Project Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Title:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">
                    {formData.placeName
                      ? formData.placeName
                      : `${formData.location.lat.toFixed(
                          4
                        )}, ${formData.location.lng.toFixed(4)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Farm Size:</span>
                  <span className="font-medium">{formData.farmSize} acres</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">${formData.budget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Funding Goal:</span>
                  <span className="font-medium">${formData.fundingGoal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Type:</span>
                  <span className="font-medium">{formData.projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {formData.duration} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Yield:</span>
                  <span className="font-medium">{formData.expectedYield}</span>
                </div>
              </div>
            </div>
          </div>
        )}

       
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} type="button">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button variant="primary" onClick={handleNext} type="button">
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              onClick={handleFormSubmit}
            >
              {loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
