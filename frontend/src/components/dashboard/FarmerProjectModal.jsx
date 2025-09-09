//frontend/src/components/dashboard/FarmerProjectModal.jsx
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { MapPin } from "lucide-react";
import { getProjectWithAnalysis } from "../../services/projectService";
import { geocodeLocation } from "../../services/geocodeService";
import { useNotification } from "../../hooks/useNotification";

export default function FarmerProjectModal({ projectId, onClose }) {
  const [project, setProject] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [farmLocationName, setFarmLocationName] = useState('');

  useEffect(() => {
    if (!projectId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getProjectWithAnalysis(projectId);
        setProject(data.project);
        setAiAnalysis(data.aiAnalysis);
        setClimateData(data.climateData);
      } catch (error) {
        console.error("Failed to load project data:", error);
        if (error.response?.status === 401) {
          showNotification("Session Expired", "Please log in again.", "error");
        } else {
          showNotification("Error", "Failed to load project data.", "error");
        }
        onClose(); // Close modal on error
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId, showNotification, onClose]);

  useEffect(() => {
    if (project && project.location && project.location.includes(',')) {
      const fetchLocationName = async () => {
        const [lat, lng] = project.location.split(',').map(Number);
        const name = await geocodeLocation(lat, lng);
        setFarmLocationName(name);
      };
      fetchLocationName();
    }
  }, [project]);

  // Show a structured loading state within the modal
  if (loading) {
    return (
      <Modal isOpen onClose={onClose}>
        <div className="p-6 text-center">
          <p>Loading project details...</p>
        </div>
      </Modal>
    );
  }
  if (!project || !aiAnalysis || !climateData) return null;

  const parsedAnalysis = {
    ...aiAnalysis,

    riskFactors: aiAnalysis.risk_factors
      ? aiAnalysis.risk_factors.split("; ")
      : [],
    recommendations: aiAnalysis.recommendations
      ? aiAnalysis.recommendations.split("; ")
      : [],
  };

  const parsedClimateData = {
    ...climateData,
    riskAssessment: {
      riskLevel: climateData.risk_level || "N/A",
      riskFactors: climateData.risk_factors
        ? climateData.risk_factors.split("; ")
        : [],
      recommendations: climateData.recommendations
        ? climateData.recommendations.split("; ")
        : [],
    },
  };

  const soilData = climateData.soil_data || {};
  

  return (
    <Modal isOpen onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">{project.title}</h2>

        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <MapPin size={14} className="mr-1 text-emerald-600" />
            {farmLocationName || project.location}
          </span>
        </div>

        <div>
          <h3 className="font-semibold mb-1">Description</h3>
          <p className="text-gray-700">{project.description}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
          <p>
            <strong>Risk Score:</strong>{" "}
            {(parsedAnalysis.risk_score * 100).toFixed(1)}%
          </p>
          <p>
            <strong>ROI Score:</strong>{" "}
            {(parsedAnalysis.roi_score * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Expected ROI:</strong> {parsedAnalysis.expected_roi}%
          </p>
          <p>
            <strong> AI Confidence:</strong>{" "}
            {(parsedAnalysis.confidence_level * 100).toFixed(0)}%
          </p>

          
          {parsedAnalysis.riskFactors.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold">Risk Factors</h4>
              <ul className="list-disc pl-5">
                {parsedAnalysis.riskFactors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedAnalysis.market_analysis && (
            <div className="mt-3">
              <h4 className="font-semibold">Market Analysis</h4>
              <p>{parsedAnalysis.market_analysis}</p>
            </div>
          )}

          
          {parsedAnalysis.recommendations.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold">Recommendations</h4>
              <ul className="list-disc pl-5">
                {parsedAnalysis.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold mb-2">Climate & Soil Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded">
              <h4 className="font-semibold mb-1">Climate Risk</h4>
              <p>
                <span className="font-medium">Level:</span>{" "}
                <span
                  className={
                    parsedClimateData.riskAssessment.riskLevel?.includes("High")
                      ? "text-red-600"
                      : parsedClimateData.riskAssessment.riskLevel?.includes(
                          "Moderate"
                        )
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {parsedClimateData.riskAssessment.riskLevel}
                </span>
              </p>

              
              {parsedClimateData.riskAssessment.riskFactors.length > 0 && (
                <>
                  <h5 className="font-medium mt-2">Factors:</h5>
                  <ul className="list-disc pl-5">
                    {parsedClimateData.riskAssessment.riskFactors.map(
                      (f, i) => (
                        <li key={i}>{f}</li>
                      )
                    )}
                  </ul>
                </>
              )}
            </div>

          

            <div className="bg-white p-3 rounded">
              <h4 className="font-semibold mb-1">Soil Analysis</h4>
              <p>
                <strong>Type:</strong> {soilData.type}
              </p>
              <p>
                <strong>pH Level:</strong> {soilData.ph}
              </p>
              <p>
                <strong>Composition:</strong>
                Sand {soilData.sand}% · Silt {soilData.silt}% · Clay{" "}
                {soilData.clay}%
              </p>
              <p>
                <strong>Organic Carbon:</strong> {soilData.organicCarbon}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
