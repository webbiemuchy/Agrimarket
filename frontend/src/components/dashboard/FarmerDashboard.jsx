//frontend/src/components/dashboard/FarmerDashboard.jsx
import { useState, useEffect } from "react";
import { X, BarChart, ArrowUpRight, FileText } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Table from "../ui/Table";
import Modal from "../ui/Modal";
import ProposalUpdateForm from "../proposals/ProposalUpdateForm";
import FarmerProjectModal from "./FarmerProjectModal";
import ProposalForm from "../proposals/ProposalForm";
import {
  createProject,
  getFarmerProjects,
  getProjectById,
  triggerAnalysis,
  deleteProject,
  updateProject,
} from "../../services/projectService";

import { useNotification } from "../../hooks/useNotification";

const FarmerDashboard = () => {
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [updatingProject, setUpdatingProject] = useState(null);
  const [isUpdateModalLoading, setIsUpdateModalLoading] = useState(false);
  const [analyzingProjectId, setAnalyzingProjectId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getFarmerProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
        showNotification("Error", "Failed to load projects", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [showNotification]);

  const handleSubmitProposal = async (proposalData) => {
    try {
      await createProject(proposalData);
      showNotification(
        "Success",
        "Proposal submitted successfully!",
        "success"
      );
      setShowProposalModal(false);
      
      const data = await getFarmerProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      showNotification("Error", "Failed to submit proposal", "error");
    }
  };

  const stats = {
    totalProjects: projects.length,
    fundedProjects: projects.filter((p) => p.status === "funded").length,
    totalFunding: projects.reduce((sum, p) => sum + p.funded, 0),
    pendingProjects: projects.filter((p) => p.status === "pending").length,
  };

  const handleTriggerAnalysis = async (projectId) => {
    setAnalyzingProjectId(projectId);
    try {
      await triggerAnalysis(projectId);
      showNotification("Success", "AI analysis started", "success");
      const data = await getFarmerProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to start AI analysis", error.response?.data);
      showNotification("Error", "Failed to start analysis", "error");
    } finally {
      setAnalyzingProjectId(null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setDeletingProjectId(projectId);
      try {
        await deleteProject(projectId);
        showNotification("Success", "Project deleted", "success");
        const data = await getFarmerProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to delete project", error);
        showNotification("Error", "Failed to delete project", "error");
      } finally {
        setDeletingProjectId(null);
      }
    }
  };
  const handleUpdateProject = async (newData) => {
    if (!updatingProject) return;
    try {
      const fullPayload = {
        ...newData,
        location: updatingProject.location, 
      };
      await updateProject(updatingProject.id, fullPayload);
      showNotification("Success", "Project updated successfully", "success");
      setUpdatingProject(null);
      const data = await getFarmerProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to update project", error);
      showNotification("Error", "Failed to update project", "error");
    }
  };
   const handleOpenUpdateModal = async (projectId) => {
    setIsUpdateModalLoading(true);
    try {
     
      const fullProject = await getProjectById(projectId);
      setUpdatingProject(fullProject);
    } catch (error) {
      console.error("Failed to load project for update", error);
      showNotification("Error", "Could not load project details for editing.", "error");
    } finally {
      setIsUpdateModalLoading(false);
    }
  };
  


  return (
    <div className="pt-20 overflow-auto px-4">
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
        <p className="text-gray-600">Manage your agricultural projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{stats.totalProjects}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
              <FileText size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Funded Projects</p>
              <p className="text-2xl font-bold">{stats.fundedProjects}</p>
            </div>
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
              <BarChart size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Funding</p>
              <p className="text-2xl font-bold">
                ${stats.totalFunding.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold">{stats.pendingProjects}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
              <FileText size={20} />
            </div>
          </div>
        </Card>
      </div>

      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
          <Button onClick={() => setShowProposalModal(true)}>
            New Proposal
          </Button>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <Table
            columns={[
              { header: "Project", accessor: "title" },
              { header: "Status", accessor: "status" },
              { header: "Funded", accessor: "funded" },
              { header: "Goal", accessor: "goal" },
              { header: "Progress", accessor: "progress" },
              { header: "Actions", accessor: "actions" },
            ]}
            data={projects.map((project) => ({
              ...project,
              funded: `$${project.funded.toLocaleString()}`,
              goal: `$${project.funding_goal.toLocaleString()}`,
              progress: (
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                    <div
                      className={`h-2.5 rounded-full ${
                        project.progress === 100
                          ? "bg-emerald-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span>{project.progress}%</span>
                </div>
              ),
              actions: (
                <div className="flex flex-wrap gap-2">
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedProjectId(project.id)}
                    className="min-w-[80px]"
                  >
                    View
                  </Button>

                  
                  {project.status === "pending" && (
                    <>
                      
                      {!project.ai_risk_score && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleTriggerAnalysis(project.id)}
                          loading={analyzingProjectId === project.id}
                          className="min-w-[120px]"
                        >
                          Start Analysis
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteProject(project.id)}
                        loading={deletingProjectId === project.id}
                        className="min-w-[80px]"
                      >
                        Delete
                      </Button>
                    </>
                  )}

                  {project.status === "rejected" && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenUpdateModal(project.id)}
                      loading={isUpdateModalLoading && updatingProject?.id === project.id}
                      className="min-w-[80px]"
                    >
                      Update
                    </Button>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Card>

     
      <Modal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">New Proposal</h2>
            <button
              onClick={() => setShowProposalModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <ProposalForm onSubmit={handleSubmitProposal} />
        </div>
      </Modal>
      
      {selectedProjectId && (
        <FarmerProjectModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
     
      {updatingProject && !isUpdateModalLoading && (
        <Modal isOpen onClose={() => setUpdatingProject(null)}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Project</h2>
              <button
                onClick={() => setUpdatingProject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <ProposalUpdateForm
              project={updatingProject}
              onSubmit={(data) => handleUpdateProject(updatingProject.id, data)}
            />
          </div>
        </Modal>
      )}
    </div>
    </div>
  );
};

export default FarmerDashboard;
