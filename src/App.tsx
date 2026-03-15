import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/providers/theme-provider';
import { ActiveThemeProvider } from './components/active-theme';
import { AuthProvider } from './components/providers/auth-provider';
import { Toaster } from 'sonner';

// Placeholder for actual page components that I will refactor later
// For now, I'll map them to the existing directory structure logic
import DashboardPage from './pages/dashboard';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import PracticeCenterPage from './pages/practice-center';
import VideoInterviewPage from './pages/video-interview';
import AICallSimulatorPage from './pages/ai-call-simulator';
import MyReportsPage from './pages/my-reports';
import ResumeCoachPage from './pages/resume-coach';
import AssignmentsPage from './pages/assignments';

// Admin Pages
import AdminDashboardPage from './pages/admin/dashboard';
import AdminUsersPage from './pages/admin/users';
import AdminReviewPage from './pages/admin/review';
import AdminAssignmentsPage from './pages/admin/assignments';

import { ProtectedRoute } from './components/providers/protected-route';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ActiveThemeProvider>
          <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/practice-center" element={<PracticeCenterPage />} />
              <Route path="/video-interview" element={<VideoInterviewPage />} />
              <Route path="/ai-call-simulator" element={<AICallSimulatorPage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
              <Route path="/resume-coach" element={<ResumeCoachPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/review" element={<AdminReviewPage />} />
              <Route path="/admin/assignments" element={<AdminAssignmentsPage />} />
            </Route>

            {/* Root Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-center" richColors />
          </AuthProvider>
        </ActiveThemeProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
