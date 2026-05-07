import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProjectPage from './pages/ProjectPage.jsx';
import ResearchPage from './pages/ResearchPage.jsx';
import DiscoveryPipelinePage from './pages/DiscoveryPipelinePage.jsx';
import AICandidatesPage from './pages/AICandidatesPage.jsx';
import SimulationsPage from './pages/SimulationsPage.jsx';
import ExperimentsPage from './pages/ExperimentsPage.jsx';
import FeedbackLoopPage from './pages/FeedbackLoopPage.jsx';
import CollaborationPage from './pages/CollaborationPage.jsx';
import ExportCenterPage from './pages/ExportCenterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import SyntheticBiologyDashboardPage from './pages/SyntheticBiologyDashboardPage.jsx';
import SyntheticBiologyResearchPage from './pages/SyntheticBiologyResearchPage.jsx';
import SyntheticBiologyPathwaysPage from './pages/SyntheticBiologyPathwaysPage.jsx';
import SyntheticBiologyProteinsPage from './pages/SyntheticBiologyProteinsPage.jsx';
import SyntheticBiologyExperimentsPage from './pages/SyntheticBiologyExperimentsPage.jsx';
import SyntheticBiologyCollaborationPage from './pages/SyntheticBiologyCollaborationPage.jsx';

function GuestOnly({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnly>
            <Signup />
          </GuestOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/pipeline" element={<ProtectedRoute><DiscoveryPipelinePage /></ProtectedRoute>} />
      <Route path="/ai-candidates" element={<ProtectedRoute><AICandidatesPage /></ProtectedRoute>} />
      <Route path="/simulations" element={<ProtectedRoute><SimulationsPage /></ProtectedRoute>} />
      <Route path="/experiments" element={<ProtectedRoute><ExperimentsPage /></ProtectedRoute>} />
      <Route path="/feedback-loop" element={<ProtectedRoute><FeedbackLoopPage /></ProtectedRoute>} />
      <Route path="/collaboration" element={<ProtectedRoute><CollaborationPage /></ProtectedRoute>} />
      <Route path="/export-center" element={<ProtectedRoute><ExportCenterPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/dashboard" element={<ProtectedRoute><SyntheticBiologyDashboardPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/research" element={<ProtectedRoute><SyntheticBiologyResearchPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/pathways" element={<ProtectedRoute><SyntheticBiologyPathwaysPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/proteins" element={<ProtectedRoute><SyntheticBiologyProteinsPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/experiments" element={<ProtectedRoute><SyntheticBiologyExperimentsPage /></ProtectedRoute>} />
      <Route path="/synthetic-biology/collaboration" element={<ProtectedRoute><SyntheticBiologyCollaborationPage /></ProtectedRoute>} />
      <Route
        path="/project/:projectId"
        element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/:projectId/research"
        element={
          <ProtectedRoute>
            <ResearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/project/:projectId/research/:runId"
        element={
          <ProtectedRoute>
            <ResearchPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
