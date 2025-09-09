// frontend/src/services/dashboardService.js
import api from './api';

export const getInvestorDashboard = () =>
  api.get('/dashboard/investor').then(res => res.data.data);

export const getFarmerDashboard = () =>
  api.get('/dashboard/farmer').then(res => res.data.data);

export const getAdminDashboard = () =>
  api.get('/dashboard/admin').then(res => res.data.data);
