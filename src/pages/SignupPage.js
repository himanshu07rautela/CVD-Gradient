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
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({ ...formData, role: newValue === 0 ? 'patient' : 'doctor' });
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      // Only send doctorId if role is doctor (handled by backend), so just send formData as is for patients
      const response = await axios.post('https://cvd-gradient.onrender.com/signup', formData);
      if (formData.role === 'doctor' && response.data.doctorId) {
        setSuccess(`Signup successful! Your Doctor ID is: ${response.data.doctorId} (share this with your patients)`);
      } else {
        setSuccess('Signup successful! Please log in.');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom color="primary">
          Create Account
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Sign up to access the platform
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Patient" sx={{ minHeight: 64 }} />
            <Tab label="Doctor" sx={{ minHeight: 64 }} />
          </Tabs>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            variant="outlined"
          />
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
            Sign Up
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account? <a href="/login">Log in</a>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage; 