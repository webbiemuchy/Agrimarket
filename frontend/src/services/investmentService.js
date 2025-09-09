// frontend/src/services/investmentService.js
import api from './api';

const getMyInvestments = async () => {
  const { data } = await api.get('/investments/my-investments');
  // data.data.investments holds the array
  return data.data.investments;
};

const createInvestment = async (investmentData) => {
  const { data } = await api.post('/investments', investmentData);
  // data.data.investment holds the created investment
  return data.data.investment;
};

const getInvestmentDetails = async (investmentId) => {
  const { data } = await api.get(`/investments/${investmentId}`);
  // data.data.investment holds the object
  return data.data.investment;
};

const getProjectInvestments = async (projectId) => {
  const { data } = await api.get(`/investments/project/${projectId}`);
  // data.data.investments holds the array
  return data.data.investments;
};

export default {
  getMyInvestments,
  createInvestment,
  getInvestmentDetails,
  getProjectInvestments
};
