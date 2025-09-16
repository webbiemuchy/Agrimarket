// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getInvestorDashboard,
  getFarmerDashboard,
  getAdminDashboard
} from '../services/dashboardService';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import InvestorDashboard from '../components/dashboard/InvestorDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useAuth } from '../contexts/AuthProvider';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const role = user?.userType;

  // queries
  const {
    data: investorResult,
    isLoading: invLoading,
    isError: invError
  } = useQuery({
    queryKey: ['dashboard', 'investor'],
    queryFn: () => getInvestorDashboard(),
    enabled: role === 'investor'
  });

  const {
    data: farmerResult,
    isLoading: farmLoading,
    isError: farmError
  } = useQuery({
    queryKey: ['dashboard', 'farmer'],
    queryFn: () => getFarmerDashboard(),
    enabled: role === 'farmer'
  });

  const {
    data: adminResult,
    isLoading: adminLoading,
    isError: adminError
  } = useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => getAdminDashboard(),
    enabled: role === 'admin'
  });

  // loading state while fetching user
  if (loading) {
    return <div>Loading user info…</div>;
  }

  if (invLoading || farmLoading || adminLoading) {
    return <div>Loading dashboard…</div>;
  }
  if (invError || farmError || adminError) {
    return <div>Failed to load dashboard. Please try again later.</div>;
  }

  if (role === 'investor' && investorResult) {
    return <InvestorDashboard {...investorResult} />;
  }
  if (role === 'farmer' && farmerResult) {
    return <FarmerDashboard {...farmerResult} />;
  }
  if (role === 'admin' && adminResult) {
    return <AdminDashboard {...adminResult} />;
  }

  return <div>No dashboard available</div>;
};

export default DashboardPage;
