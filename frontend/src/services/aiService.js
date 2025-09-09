//frontend/src/services/aiService.js
import api from './api';

const analyzeProject = async (projectId) => {
  const response = await api.post(`/ai/analyze/${projectId}`);
  return response;
};

const getClimateData = async (location) => {
  const response = await api.get('/ai/climate', { params: { location } });
  return response;
};

export default {
  analyzeProject,
  getClimateData
};