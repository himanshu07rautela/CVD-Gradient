import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Alert, Button, Avatar, Collapse, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Area, AreaChart } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  // Remove parameterOptions and selectedParam

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    // Always use doctorId for fetching patients
    const doctorId = user?.role === 'doctor' ? user.doctorId : undefined;
    if (!doctorId) {
      setPatientData([]);
      setStats({});
      setLoading(false);
      return;
    }
    const url = `http://localhost:8000/patients/summary?doctor_id=${doctorId}`;
    axios.get(url)
      .then(res => {
        setPatientData(res.data.patients || []);
        setStats(res.data.stats || {});
      })
      .catch(() => {
        setPatientData([]);
        setStats({});
      })
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'High Risk': return 'error';
      case 'Medium Risk': return 'warning';
      case 'Low Risk': return 'success';
      default: return 'default';
    }
  };

  // Prepare multi-series chart data
  const chartData = [];
  // Find all unique test dates
  const allDates = Array.from(new Set(
    patientData.flatMap(p => (p.tests || []).map(t => t.date))
  )).sort();
  allDates.forEach(date => {
    const entry = { date: new Date(date).toLocaleDateString() };
    patientData.forEach((p, idx) => {
      const test = (p.tests || []).find(t => t.date === date);
      entry[`patient${idx}`] = test && test.result ? (test.result * 100).toFixed(1) : null;
    });
    chartData.push(entry);
  });

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
      {/* Multi-patient trend chart */}
      <Card sx={{ mb: 4 }}>
              <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Risk Percent Trend (All Patients)
                </Typography>
          <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#888" fontSize={13} />
                <YAxis domain={[0, 100]} stroke="#888" fontSize={13} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: 8 }}
                  formatter={(value, name, props) => [`${value}%`, patientData[parseInt(name.replace('patient', ''))]?.name || name]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                {patientData.map((p, idx) => (
                  <>
                    <Line
                      key={p.id}
                      type="monotone"
                      dataKey={`patient${idx}`}
                      name={p.name}
                      stroke={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
                      strokeWidth={3}
                      dot={{ r: 6, fill: `hsl(${(idx * 60) % 360}, 70%, 50%)`, stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                      connectNulls
                    />
                    {/* Optional: Area under the curve for subtle fill */}
                    <Area
                      key={p.id + '-area'}
                      type="monotone"
                      dataKey={`patient${idx}`}
                      stroke={"none"}
                      fill={`hsl(${(idx * 60) % 360}, 70%, 80%)`}
                      fillOpacity={0.15}
                      connectNulls
                    />
                  </>
                ))}
              </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          {/* Patient Table */}
      <Grid container spacing={4}>
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
                        <TableCell>Last Test</TableCell>
                        <TableCell>Risk Score</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {patientData.map((patient, idx) => (
                      <React.Fragment key={patient.id}>
                        <TableRow>
                          <TableCell>
                            <Avatar>{patient.name?.[0]}</Avatar> {patient.name}
                          </TableCell>
                          <TableCell>{patient.lastTest ? new Date(patient.lastTest).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>{patient.riskScore}%</TableCell>
                          <TableCell>
                            <Chip
                              label={patient.status}
                              color={getStatusColor(patient.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => setExpanded(e => ({ ...e, [patient.id]: !e[patient.id] }))}
                            >
                              {expanded[patient.id] ? 'Hide Details' : 'Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                            <Collapse in={!!expanded[patient.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2 }}>
                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                  Test History
                                </Typography>
                                {(!patient.tests || patient.tests.length === 0) ? (
                                  <Typography variant="body2" color="text.secondary">No tests available.</Typography>
                                ) : (
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Risk Percent (%)</TableCell>
                                        <TableCell>Test Details</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {patient.tests.map((test, tIdx) => {
                                        // Build test details as a styled vertical list
                                        const detailsList = Object.keys(test)
                                          .filter(k => !['date', 'result', 'prescribedBy', 'testName'].includes(k))
                                          .map(k => (
                                            <div key={k} style={{ marginBottom: 2 }}>
                                              <span style={{ fontWeight: 600 }}>{k}:</span> <span>{String(test[k])}</span>
                                            </div>
                                          ));
                                        return (
                                          <TableRow key={tIdx}>
                                            <TableCell>{test.date ? new Date(test.date).toLocaleDateString() : '-'}</TableCell>
                                            <TableCell>{test.result ? (test.result * 100).toFixed(1) : '-'}</TableCell>
                                            <TableCell>
                                              <div style={{ background: '#fafafa', borderRadius: 6, padding: 8, border: '1px solid #eee', maxWidth: 320 }}>
                                                {detailsList}
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Container>
  );
};

export default DoctorDashboard; 