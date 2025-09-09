// frontend/src/services/projectService.js
import api from './api';

export async function createProject(data) {
  const payload = {
    title: data.title,
    description: data.description,
    budget: +data.budget,
    location:
      typeof data.location === 'object'
        ? `${data.location.lat},${data.location.lng}`
        : data.location,
    expected_yield: data.expectedYield,
    project_type: data.projectType,
    duration_months: +data.duration,
    funding_goal: +data.fundingGoal,
    funding_deadline: data.fundingDeadline || null,
    farm_size: +data.farmSize,
  };
  const res = await api.post('/projects', payload);
  return res.data.project;
}

export async function getProjects(params = {}) {
  const merged = { status: 'approved', ...params };
  const { data } = await api.get('/projects', { params: merged });
  return data.data.projects.map((p) => ({
    id: p.id,
    title: p.title,
    farmer: `${p.farmer.first_name} ${p.farmer.last_name}`,
    location: p.location,
    project_type: p.project_type,
    ai_risk_score: p.ai_risk_score,
    ai_roi_score: p.ai_roi_score,
    funding_goal: p.funding_goal,
    current_funding: p.current_funding,
    status: p.status,
    farm_size: p.farm_size,
    progress: p.funding_goal
      ? Math.round((p.current_funding / p.funding_goal) * 100)
      : 0,
  }));
}

export async function getProjectById(id) {
  const { data } = await api.get(`/projects/${id}`);
  return data.data.project;
}

export async function getProjectWithAnalysis(id) {
  const response = await api.get(`/projects/${id}/analysis`);
  
  return {
    project: response.data.project,
    aiAnalysis: response.data.aiAnalysis,
    climateData: response.data.climateData
  };
}

export async function getFarmerProjects() {
  const { data } = await api.get('/projects/farmer/my-projects');
  return data.data.projects.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    funded: p.current_funding,
    funding_goal: p.funding_goal,
    progress: p.funding_goal
      ? Math.round((p.current_funding / p.funding_goal) * 100)
      : 0,
    ai_risk_score: p.ai_risk_score,
    ai_roi_score: p.ai_roi_score,
    analysis_status: p.analysis_status
  }));
}

export async function triggerAnalysis(projectId) {
  const { data } = await api.post(`/ai/analyze/${projectId}`);
  return data;
}

export async function updateProjectStatus(projectId, status) {
  const { data } = await api.patch(
    `/projects/${projectId}/status`,
    { status }
  );
  return data.data;
}

export async function updateProject(id, updateData) {
  
  const payload = {
    title: updateData.title,
    description: updateData.description,
    budget: parseFloat(updateData.budget),
    location: updateData.location,
    expected_yield: updateData.expectedYield,
    project_type: updateData.projectType,
    duration_months: parseInt(updateData.duration, 10),
    funding_goal: parseFloat(updateData.fundingGoal),
    funding_deadline: updateData.fundingDeadline || null,
    farm_size: parseFloat(updateData.farmSize),
  };
  const { data } = await api.put(`/projects/${id}`, payload);
  return data.data.project;
}
export async function deleteProject(id) {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
}
