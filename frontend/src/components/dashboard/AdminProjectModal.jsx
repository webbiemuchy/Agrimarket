// frontend/src/components/dashboard/AdminProjectModal.jsx
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { MapPin } from "lucide-react";
import {
  getProjectWithAnalysis,
  updateProjectStatus,
} from "../../services/projectService";
import { geocodeLocation } from "../../services/geocodeService";
import { useNotification } from "../../hooks/useNotification";

export default function AdminProjectModal({
  projectId,
  onClose,
  onStatusChange,
}) {
  const [project, setProject] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmLocationName, setFarmLocationName] = useState("");
  const [decision, setDecision] = useState("approved");
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!projectId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const {
          project: proj,
          aiAnalysis: an,
          climateData: cd,
        } = await getProjectWithAnalysis(projectId);

        setProject(proj);
        setAiAnalysis(an);
        setClimateData(cd);
        setDecision("approved");
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) {
          showNotification("Session Expired", "Please log in again.", "error");
        } else {
          showNotification(
            "Error",
            "Failed to load proposal details.",
            "error"
          );
        }
        onClose(); 
      } finally {
        setLoading(false); 
      }
    };

    fetchDetails();
  }, [projectId, showNotification, onClose]);

  useEffect(() => {
    if (project && project.location && project.location.includes(",")) {
      const fetchLocationName = async () => {
        const [lat, lng] = project.location.split(",").map(Number);
        const name = await geocodeLocation(lat, lng);
        setFarmLocationName(name);
      };
      fetchLocationName();
    }
  }, [project]);
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

  const handleSave = async () => {
    try {
      await updateProjectStatus(projectId, decision);
      showNotification("Success", `Proposal ${decision}`, "success");
      onStatusChange();
      onClose();
    } catch (e) {
      console.error(e);
      showNotification("Error", "Could not update status", "error");
    }
  };

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

  const climateRecs = parsedClimateData.riskAssessment.recommendations;

  return (
    <Modal isOpen onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto p-6 space-y-6">
       
        <h2 className="text-2xl font-bold">{project.title}</h2>

       
        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <MapPin size={14} className="mr-1 text-emerald-600" />
          {farmLocationName || project.location}
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
            <strong>Confidence:</strong>{" "}
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
          {aiAnalysis.marketAnalysis && (
            <div className="mt-3">
              <h4 className="font-semibold">Market Analysis</h4>
              <p>{aiAnalysis.marketAnalysis}</p>
            </div>
          )}
          {aiAnalysis.feasibilityAssessment && (
            <div className="mt-3">
              <h4 className="font-semibold">Feasibility Assessment</h4>
              <p>{aiAnalysis.feasibilityAssessment}</p>
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
          {aiAnalysis.conclusion && (
            <div className="mt-4 bg-emerald-50 p-4 rounded-lg">
              <h4 className="font-semibold">Conclusion</h4>
              <p className="font-bold">{aiAnalysis.conclusion}</p>
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

            
            {climateData.soil_data && (
              <div className="bg-white p-3 rounded">
                <h4 className="font-semibold mb-1">Soil Analysis</h4>
                <p>
                  <strong>Type:</strong> {climateData.soil_data.type}
                </p>
                <p>
                  <strong>pH Level:</strong> {climateData.soil_data.ph}
                </p>
                <p>
                  <strong>Composition:</strong>
                  <br />
                  Sand {climateData.soil_data.sand}% · Silt{" "}
                  {climateData.soil_data.silt}% · Clay{" "}
                  {climateData.soil_data.clay}%
                </p>
                <p>
                  <strong>Organic Carbon:</strong>{" "}
                  {climateData.soil_data.organicCarbon}%
                </p>
              </div>
            )}
          </div>

          
          {climateData.forecast?.summary && (
            <div className="bg-white p-3 rounded">
              <h4 className="font-semibold mb-1">30-Day Forecast</h4>
              <p>{climateData.forecast.summary}</p>
            </div>
          )}

          
          {climateData.dataLimitation && (
            <div className="bg-yellow-50 p-2 rounded text-sm">
              <strong>Note:</strong> {climateData.dataLimitation}
            </div>
          )}

          
          {climateRecs.length > 0 && (
            <div className="bg-white p-3 rounded">
              <h4 className="font-semibold mb-1">Adaptation Recommendations</h4>
              <ul className="list-disc pl-5">
                {climateRecs.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

       
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-1">Budget</h3>
            <p>${project.budget.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Funding Goal</h3>
            <p>${project.funding_goal.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Duration</h3>
            <p>{project.duration_months} months</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Farm Size</h3>
            <p>{project.farm_size} acres</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Expected Yield</h3>
            <p>{project.expected_yield || "—"}</p>
          </div>
        </div>

       
        <div>
          <label className="block mb-1 font-medium">Decision</label>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="approved">Approve &amp; Publish</option>
            <option value="rejected">Reject</option>
          </select>
        </div>

        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {decision === "approved" ? "Approve" : "Reject"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
