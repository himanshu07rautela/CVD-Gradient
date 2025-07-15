import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Avatar from '@mui/material/Avatar';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('https://cvd-gradient.onrender.com/patients/summary')
      .then(res => {
        setPatientData(res.data.patients || []);
        setStats(res.data.stats || {});
      })
      .catch(() => {
        setPatientData([]);
        setStats({});
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'High Risk': return 'error';
      case 'Medium Risk': return 'warning';
      case 'Low Risk': return 'success';
      default: return 'default';
    }
  };

  const chartData = [
    { category: 'Low Risk', count: stats.lowRisk },
    { category: 'Medium Risk', count: stats.mediumRisk },
    { category: 'High Risk', count: stats.highRisk },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 40 }} /> Doctor Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Loading patient data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalHospitalIcon color="primary" sx={{ fontSize: 40 }} /> Doctor Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Welcome, Dr. {user?.name}! Here's your patient overview.
      </Typography>

      {patientData.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom color="primary">
              No Patient Data Available
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              No patients have made cardiovascular disease risk assessments yet.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              Patient data will appear here once they start using the prediction system.
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Total Patients
                </Typography>
                <Typography variant="h3" color="primary">
                  {stats.totalPatients}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  High Risk
                </Typography>
                <Typography variant="h3" color="error.main">
                  {stats.highRisk}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Medium Risk
                </Typography>
                <Typography variant="h3" color="warning.main">
                  {stats.mediumRisk}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary">
                  Average Risk
                </Typography>
                <Typography variant="h3" color="primary">
                  {stats.avgRisk}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Risk Distribution Chart */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Risk Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Patients */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Recent Patients
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {patientData.slice(0, 5).map((patient) => (
                    <Box key={patient.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6">
                            <Avatar>{patient.name?.[0]}</Avatar> {patient.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Age: {patient.age} | Last Test: {patient.lastTest}
                          </Typography>
                        </Box>
                        <Chip
                          label={patient.status}
                          color={getStatusColor(patient.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Risk Score: {patient.riskScore}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Patient Table */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  All Patients
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Last Test</TableCell>
                        <TableCell>Risk Score</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientData.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell>
                            <Avatar>{patient.name?.[0]}</Avatar> {patient.name}
                          </TableCell>
                          <TableCell>{patient.age}</TableCell>
                          <TableCell>{patient.lastTest}</TableCell>
                          <TableCell>{patient.riskScore}%</TableCell>
                          <TableCell>
                            <Chip
                              label={patient.status}
                              color={getStatusColor(patient.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip label="View Details" variant="outlined" size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default DoctorDashboard; 