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
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`http://localhost:8000/predictions?user_id=${user.id}`)
      .then(res => {
        // Map MongoDB data to dashboard format and sort by timestamp (oldest first)
        const history = res.data
          .map(item => ({
            date: new Date(item.timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            }),
            riskScore: parseFloat((item.risk_score * 100).toFixed(1)),
            timestamp: new Date(item.timestamp), // Keep original timestamp for sorting
            // Add more fields if needed
          }))
          .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp ascending (oldest first)
        
        setPredictionHistory(history);
      })
      .catch(() => setPredictionHistory([]))
      .finally(() => setLoading(false));
  }, [user]);

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

      {predictionHistory.length === 0 ? (
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
                    <LineChart data={predictionHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [`${value}%`, 'Risk Score']}
                        labelFormatter={(label) => `Date: ${label}`}
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
                    {predictionHistory.length}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    Average Risk
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {predictionHistory.length > 0 
                      ? (predictionHistory.reduce((sum, item) => sum + item.riskScore, 0) / predictionHistory.length).toFixed(1)
                      : '0'
                    }%
                  </Typography>
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
                      {predictionHistory.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>{test.date}</TableCell>
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