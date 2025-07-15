import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PredictionPage from './pages/PredictionPage';
import ResearchPage from './pages/ResearchPage';
import TeamPage from './pages/TeamPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fff 0%, #ffe5ec 50%, #f8bbd0 100%)' }}>
            {/* Logo/Header */}
            <Box sx={{ py: 2, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'transparent' }}>
              <img src="/logo.jpg" alt="CVD Gradient Logo" style={{ height: 48 }} />
              <Typography variant="h5" color="primary" fontWeight={700}>CVD Gradient</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/patient-dashboard" element={<PatientDashboard />} />
                  <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                  <Route path="/predict" element={<PredictionPage />} />
                  <Route path="/research" element={<ResearchPage />} />
                  <Route path="/team" element={<TeamPage />} />
                </Routes>
              </Box>
            </Box>
            <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'transparent', color: 'text.secondary' }}>
              © {new Date().getFullYear()} CVD Gradient. All rights reserved.
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 