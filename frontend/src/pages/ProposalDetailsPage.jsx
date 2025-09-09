//file: frontend/src/pages/ProposalDetailsPage.jsx
import { useState, useEffect } from "react";
import {
  MapPin,
  Droplet,
  Thermometer,
  Wind,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  ClipboardList,
  Search,
  Check,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import CheckoutModal from "../components/payments/CheckoutModal";
import ChatModal from "../components/chat/ChatModal";
import { getProjectWithAnalysis } from "../services/projectService";
import { geocodeLocation } from "../services/geocodeService";
import { useNotification } from "../hooks/useNotification";
import Skeleton from "react-loading-skeleton";
import { useAuth } from "../hooks/useAuth";

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [proposal, setProposal] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [climateData, setClimateData] = useState(null);
  const [farmLocationName, setFarmLocationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const { project, aiAnalysis, climateData } =
          await getProjectWithAnalysis(id, controller.signal);

        if (!isMounted) {
          setProposal(project);
          setAiAnalysis(aiAnalysis);
          setClimateData(climateData);

          
          if (project.location.includes(",")) {
            const [lat, lng] = project.location.split(",").map(Number);
            const name = await geocodeLocation(lat, lng);
            setFarmLocationName(name);
          }
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          console.error(err);
          showNotification("Error", "Failed to load project details", "error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, showNotification]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Skeleton count={5} />
      </div>
    );
  }

  if (!proposal || !aiAnalysis || !climateData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">
          Proposal data could not be loaded
        </h2>
        <Button as={Link} to="/marketplace" className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  const progress = proposal.funding_goal
    ? Math.round((proposal.current_funding / proposal.funding_goal) * 100)
    : 0;

  const parsedAiAnalysis = {
    ...aiAnalysis,
    riskFactors: aiAnalysis.risk_factors
      ? aiAnalysis.risk_factors.split("; ")
      : [],
    recommendations: aiAnalysis.recommendations
      ? aiAnalysis.recommendations.split("; ")
      : [],
    strengths: aiAnalysis.strengths ? aiAnalysis.strengths.split(".") : [],
  };

  const parsedClimateData = {
    ...climateData,
    riskFactors: climateData.risk_factors
      ? climateData.risk_factors.split("; ")
      : [],
    recommendations: climateData.recommendations
      ? climateData.recommendations.split("; ")
      : [],
  };

  return (
    <div className="space-y-6">
      
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-800"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
        <h1 className="text-3xl font-bold mt-2">{proposal.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <MapPin size={14} className="mr-1 text-emerald-600" />
            {farmLocationName || proposal.location}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            {proposal.project_type}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {proposal.farmer.first_name} {proposal.farmer.last_name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 mb-6">{proposal.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                ["Farm Size", `${proposal.farm_size} acres`],
                ["Duration", `${proposal.duration_months} months`],
                ["Expected Yield", proposal.expected_yield],
                ["Budget", `$${proposal.budget.toLocaleString()}`],
              ].map(([label, val]) => (
                <div key={label} className="border rounded-lg p-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">{label}</div>
                  <div className="font-bold">{val}</div>
                </div>
              ))}
            </div>

           
            <h3 className="text-lg font-bold mb-2">Funding Progress</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>${proposal.current_funding.toLocaleString()} raised</span>
                <span>${proposal.funding_goal.toLocaleString()} goal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <Card>
            <h2 className="text-xl font-bold mb-4">AI-Powered Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InfoCard
                title="Risk Score"
                value={`${(parsedAiAnalysis.risk_score * 100).toFixed(1)}%`}
                explanation={parsedAiAnalysis.risk_score_explanation}
                color="text-red-500"
              />
              <InfoCard
                title="ROI Score"
                value={`${(parsedAiAnalysis.roi_score * 100).toFixed(1)}%`}
                explanation={parsedAiAnalysis.roi_score_explanation}
                color="text-green-500"
              />
              <InfoCard
                title="Expected ROI"
                value={`${(parsedAiAnalysis.expected_roi * 100).toFixed(0)}%`}
                explanation={parsedAiAnalysis.expected_roi_score_explanation}
                color="text-blue-500"
              />
              <InfoCard
                title="Confidence"
                value={`${(parsedAiAnalysis.confidence_level * 100).toFixed(
                  0
                )}%`}
                explanation={parsedAiAnalysis.confidence_level_explanation}
                color="text-purple-500"
              />
            </div>

            <div className="space-y-4">
              <AnalysisDetailCard
                icon={<Search />}
                title="Market Analysis"
                content={parsedAiAnalysis.market_analysis}
              />
              <AnalysisDetailCard
                icon={<ClipboardList />}
                title="Feasibility Assessment"
                content={parsedAiAnalysis.feasibility}
              />
              <AnalysisDetailCard
                icon={<AlertTriangle />}
                title="Risk Factors"
                items={parsedAiAnalysis.riskFactors}
              />
              <AnalysisDetailCard
                icon={<CheckCircle />}
                title="Recommendations"
                items={parsedAiAnalysis.recommendations}
              />
              <AnalysisDetailCard
                icon={<ShieldCheck />}
                title="Strengths"
                content={parsedAiAnalysis.strengths}
              />
            </div>

            <div
              className={`mt-6 p-4 rounded-lg ${
                parsedAiAnalysis.conclusion?.startsWith("Good")
                  ? "bg-green-50 text-green-800"
                  : parsedAiAnalysis.conclusion?.startsWith("Requires")
                  ? "bg-yellow-50 text-yellow-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <h3 className="font-bold flex items-center">
                <Check size={20} className="mr-2" /> AI Conclusion
              </h3>
              <p className="mt-2 text-sm">
                {parsedAiAnalysis.conclusion || "No conclusion available."}
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Climate Assessment */}
          <Card>
            <h2 className="text-xl font-bold mb-4">
              Climate and Soil Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Climate Risk */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Climate Risk</h3>
                <p>
                  <span className="font-medium">Level:</span>{" "}
                  <span
                    className={`font-bold ${
                      climateData.risk_level?.includes("High")
                        ? "text-red-600"
                        : climateData.risk_level?.includes("Moderate")
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {climateData.risk_level}
                  </span>
                </p>

                {parsedClimateData.riskFactors.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium">Factors:</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {parsedClimateData.riskFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Soil Analysis */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Soil Analysis</h3>
                <p>
                  <strong>Type:</strong> {climateData.soil_data?.type}
                </p>
                <p>
                  <strong>pH Level:</strong> {climateData.soil_data?.ph}
                </p>
                <p>
                  <strong>Organic Carbon:</strong>{" "}
                  {climateData.soil_data?.organicCarbon}%
                </p>
                <p className="text-sm">
                  Sand {climateData.soil_data?.sand}% · Silt{" "}
                  {climateData.soil_data?.silt}% · Clay{" "}
                  {climateData.soil_data?.clay}%
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-bold mb-4">Climate Insights</h2>
            <div className="space-y-4">
              <AnalysisDetailCard
                icon={<AlertTriangle className="text-yellow-600" />}
                title="Climate Warnings"
                items={parsedClimateData.riskFactors}
              />
              <AnalysisDetailCard
                icon={<ShieldCheck className="text-green-600" />}
                title="Mitigation strategy"
                items={parsedClimateData.recommendations}
              />
            </div>
          </Card>
          {/* Current Climate Data */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Current Climate Data</h2>
            {climateData && climateData.current_weather ? (
              <>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Thermometer size={18} className="mr-2 text-red-500" />
                  <span>
                    Temperature:{" "}
                    <strong>{climateData.current_weather.temperature}°C</strong>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Droplet size={18} className="mr-2 text-blue-500" />
                  <span>
                    Precipitation:{" "}
                    <strong>
                      {climateData.current_weather.precipitation} mm
                    </strong>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Droplet size={18} className="mr-2 text-indigo-500" />
                  <span>
                    Humidity:{" "}
                    <strong>{climateData.current_weather.humidity}%</strong>
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <Wind size={18} className="mr-2 text-teal-500" />
                  <span>
                    Wind Speed:{" "}
                    <strong>
                      {climateData.current_weather.windSpeed} km/h
                    </strong>
                  </span>
                </div>
              </>
            ) : (
              <p>No current climate data available</p>
            )}
          </Card>

          {/* Farmer Info & Actions */}
          {currentUser && currentUser.role === "investor" && (
            <Card>
              <h2 className="text-xl font-bold mb-4">Farmer Information</h2>
              <p className="font-semibold">
                {proposal.farmer.first_name} {proposal.farmer.last_name}
              </p>
              <p className="text-gray-600">{proposal.farmer.location}</p>
              <Button
                variant="primary"
                className="mt-4 w-full"
                onClick={() => setShowCheckout(true)}
              >
                Fund This Project
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full flex items-center justify-center"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle size={18} className="mr-2" /> Chat with Farmer
              </Button>
            </Card>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          proposal={proposal}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {showChat && (
        <ChatModal
          projectId={proposal.id}
          recipientId={proposal.farmer_id}
          recipientName={`${proposal.farmer.first_name} ${proposal.farmer.last_name}`}
          projectTitle={proposal.title}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

const InfoCard = ({ title, value, color, explanation }) => (
  <div className="border rounded-lg p-4 flex flex-col">
    <div className="text-sm text-gray-600 mb-1">{title}</div>
    <div className={`font-bold text-3xl ${color}`}>{value}</div>
    {explanation && (
      <p className="text-xs text-gray-500 mt-2 flex-1">{explanation}</p>
    )}
  </div>
);

const AnalysisDetailCard = ({ icon, title, content, items }) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-bold flex items-center text-gray-800 mb-2">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
    {content && <p className="text-gray-700 text-sm">{content}</p>}
    {items && items.length > 0 && (
      <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);
