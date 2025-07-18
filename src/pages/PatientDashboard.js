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
  Alert,
  TextField,
  Button,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState({ graphData: [], tableData: [] });
  const [loading, setLoading] = useState(true);
  const [linkDoctorId, setLinkDoctorId] = useState('');
  const [linkDoctorMsg, setLinkDoctorMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Use email as unique user id
    axios.get(`http://localhost:8000/predictions?user_id=${user.email}`)
      .then(res => {
        // Map MongoDB data to dashboard format
        let mappedReports = res.data.map(item => ({
          date: new Date(item.timestamp).getTime(), // Use numeric timestamp for X-axis
          dateLabel: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // For tooltip/labels
          riskScore: item.risk_score ? parseFloat((item.risk_score * 100).toFixed(1)) : 0,
          riskLevel: item.risk_score > 0.7 ? 'High' : item.risk_score > 0.4 ? 'Medium' : 'Low',
          status: item.risk_score > 0.7 ? 'Critical' : 'Normal',
          timestamp: new Date(item.timestamp),
          ...item
        }));
        // Sort for graph: oldest to newest (ascending)
        const graphData = [...mappedReports].sort((a, b) => a.date - b.date);
        // Sort for table: newest to oldest (descending)
        const tableData = [...mappedReports].sort((a, b) => b.date - a.date);
        setReports({ graphData, tableData });
        setLoading(false);
      })
      .catch(err => {
        setReports({ graphData: [], tableData: [] });
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering if not authenticated

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FavoriteIcon color="error" sx={{ fontSize: 40 }} /> Patient Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Loading your data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FavoriteIcon color="error" sx={{ fontSize: 40 }} /> Patient Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Welcome back, {user?.name}! Here's your cardiovascular health overview.
      </Typography>

      {reports.graphData.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom color="primary">
              No Predictions Yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              You haven't made any cardiovascular disease risk assessments yet.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              Start by taking your first risk assessment to see your results here.
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {/* Risk Trend Chart */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Risk Assessment Trend
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reports.graphData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        formatter={(value) => [`${value}%`, 'Risk Score']}
                      />
                      <Line
                        type="monotone"
                        dataKey="riskScore"
                        stroke="#e91e63"
                        strokeWidth={3}
                        dot={{ fill: '#e91e63', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary Stats */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Summary
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Tests
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {reports.graphData.length}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    Average Risk
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {reports.graphData.length > 0 
                      ? (reports.graphData.reduce((sum, item) => sum + item.riskScore, 0) / reports.graphData.length).toFixed(1)
                      : '0'
                    }%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Link Doctor Section */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, mb: 4 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Link a Doctor
                </Typography>
                <Box component="form" onSubmit={async (e) => {
                  e.preventDefault();
                  setLinkDoctorMsg('');
                  try {
                    await axios.post('http://localhost:8000/link-doctor', {
                      patient_email: user.email,
                      doctor_id: linkDoctorId,
                    });
                    setLinkDoctorMsg('Doctor linked successfully!');
                    setLinkDoctorId('');
                  } catch (err) {
                    setLinkDoctorMsg(err.response?.data?.detail || 'Failed to link doctor.');
                  }
                }} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Enter Doctor ID"
                    value={linkDoctorId}
                    onChange={e => setLinkDoctorId(e.target.value)}
                    size="small"
                    sx={{ maxWidth: 200 }}
                  />
                  <Button type="submit" variant="contained" size="small">Link</Button>
                  {linkDoctorMsg && <Typography variant="body2" color={linkDoctorMsg.includes('success') ? 'success.main' : 'error.main'} sx={{ ml: 2 }}>{linkDoctorMsg}</Typography>}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Test History Table */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'box-shadow 0.3s', '&:hover': { boxShadow: 8 } }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">
                  Test History
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Risk Score</TableCell>
                        <TableCell>Risk Level</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.tableData.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>{test.dateLabel}</TableCell>
                          <TableCell>{test.riskScore}%</TableCell>
                          <TableCell>
                            {test.riskScore > 70 ? 'High' : test.riskScore > 40 ? 'Medium' : 'Low'}
                          </TableCell>
                          <TableCell>
                            {test.riskScore > 70 ? '⚠️ High Risk' : '✅ Normal'}
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

export default PatientDashboard; 