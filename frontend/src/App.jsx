// frontend/src/App.jsx
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from '@/hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import {LandingPage} from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import ProposalSubmissionPage from '@/pages/ProposalSubmissionPage';
import MarketplacePage from '@/pages/MarketplacePage';
import ProposalDetailsPage from '@/pages/ProposalDetailsPage';
import ReceiptPage from '@/pages/ReceiptPage';
import DashboardPage from '@/pages/DashboardPage';



const DashboardRedirect = () => {
  const { user } = useAuth();
  return user ? (
    <Navigate to={`/dashboard/${user.role}`} replace />
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/auth/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      {/* ONE AppShell around everything */}
      <AppShell>
        <Routes>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/:type" element={<AuthPage />} />

          <Route path="/submit-proposal" element={<ProtectedRoute>
                <ProposalSubmissionPage />
              </ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['investor', 'admin']}>
                <MarketplacePage />
              </ProtectedRoute>} />
          <Route path="/proposals/:id" element={<ProtectedRoute>
                <ProposalDetailsPage />
              </ProtectedRoute>} />
          <Route path="/receipt/:id" element={<ProtectedRoute>
                <ReceiptPage />
              </ProtectedRoute>} />
          <Route path="/dashboard/:role" element={<ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
