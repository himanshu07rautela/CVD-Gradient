import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Person, LocalHospital } from '@mui/icons-material';

const LoginPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Mock login - in real app, this would be an API call
    const role = tabValue === 0 ? 'patient' : 'doctor';
    const userData = {
      id: '1',
      name: formData.email.split('@')[0],
      email: formData.email,
      role: role,
    };

    login(userData);
    
    // Redirect to appropriate dashboard
    if (role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
  };

  const demoCredentials = {
    patient: { email: 'patient@demo.com', password: 'demo123' },
    doctor: { email: 'doctor@demo.com', password: 'demo123' },
  };

  const handleDemoLogin = (role) => {
    const credentials = demoCredentials[role];
    setFormData(credentials);
    setTabValue(role === 'patient' ? 0 : 1);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom color="primary">
          Welcome Back
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Sign in to access your dashboard
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab
              icon={<Person />}
              label="Patient"
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
            <Tab
              icon={<LocalHospital />}
              label="Doctor"
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            required
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>

        {/* Demo Login Cards */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Try Demo Accounts
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Patient Demo
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleDemoLogin('patient')}
                  fullWidth
                >
                  Use Demo
                </Button>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, minWidth: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LocalHospital sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Doctor Demo
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleDemoLogin('doctor')}
                  fullWidth
                  color="secondary"
                >
                  Use Demo
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage; 