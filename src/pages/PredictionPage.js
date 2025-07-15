import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PredictionPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalch: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      const requiredFields = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalch', 'exang', 'oldpeak', 'slope', 'ca', 'thal'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }

      // Convert numeric fields
      const numericFields = ['age', 'trestbps', 'chol', 'thalch', 'oldpeak'];
      const processedData = { ...formData };
      numericFields.forEach(field => {
        processedData[field] = parseFloat(processedData[field]);
      });

      // Make API call to backend
      const userInfo = user ? JSON.stringify({ id: user.id, name: user.name }) : null;
      const response = await axios.post(
        'https://cvd-gradient.onrender.com/predict',
        processedData,
        userInfo ? { headers: { 'x-user-info': userInfo } } : undefined
      );
      
      const riskScore = response.data.risk_score;
      setResult({
        riskScore: (riskScore * 100).toFixed(1),
        riskLevel: riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low',
        timestamp: new Date().toISOString(),
      });

      // Save to MongoDB (mock - in real app, this would be a separate API call)
      console.log('Saving prediction result to database...');

    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'error.main';
      case 'Medium': return 'warning.main';
      case 'Low': return 'success.main';
      default: return 'text.primary';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="info">
          Please log in to access the prediction feature.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom color="primary" textAlign="center">
        Cardiovascular Disease Risk Assessment
      </Typography>
      <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Please provide your health information for accurate risk assessment
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={<span>Age <InfoOutlinedIcon fontSize="small" titleAccess="Patient's age in years" /></span>}
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Sex</InputLabel>
                    <Select
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      label="Sex"
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Medical Information */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Medical Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Chest Pain Type</InputLabel>
                    <Select
                      name="cp"
                      value={formData.cp}
                      onChange={handleInputChange}
                      label="Chest Pain Type"
                    >
                      <MenuItem value="typical angina">Typical Angina</MenuItem>
                      <MenuItem value="atypical angina">Atypical Angina</MenuItem>
                      <MenuItem value="non-anginal">Non-anginal</MenuItem>
                      <MenuItem value="asymptomatic">Asymptomatic</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Resting Blood Pressure (mm Hg)"
                    name="trestbps"
                    type="number"
                    value={formData.trestbps}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 90, max: 200 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cholesterol (mg/dl)"
                    name="chol"
                    type="number"
                    value={formData.chol}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 100, max: 600 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Fasting Blood Sugar</InputLabel>
                    <Select
                      name="fbs"
                      value={formData.fbs}
                      onChange={handleInputChange}
                      label="Fasting Blood Sugar"
                    >
                      <MenuItem value="TRUE">{'>'} 120 mg/dl</MenuItem>
                      <MenuItem value="FALSE">≤ 120 mg/dl</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Resting ECG</InputLabel>
                    <Select
                      name="restecg"
                      value={formData.restecg}
                      onChange={handleInputChange}
                      label="Resting ECG"
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="lv hypertrophy">LV Hypertrophy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Max Heart Rate"
                    name="thalch"
                    type="number"
                    value={formData.thalch}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 60, max: 202 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Exercise Induced Angina</InputLabel>
                    <Select
                      name="exang"
                      value={formData.exang}
                      onChange={handleInputChange}
                      label="Exercise Induced Angina"
                    >
                      <MenuItem value="TRUE">Yes</MenuItem>
                      <MenuItem value="FALSE">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ST Depression"
                    name="oldpeak"
                    type="number"
                    step="0.1"
                    value={formData.oldpeak}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    inputProps={{ min: 0, max: 6.2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Slope of ST Segment</InputLabel>
                    <Select
                      name="slope"
                      value={formData.slope}
                      onChange={handleInputChange}
                      label="Slope of ST Segment"
                    >
                      <MenuItem value="upsloping">Upsloping</MenuItem>
                      <MenuItem value="flat">Flat</MenuItem>
                      <MenuItem value="downsloping">Downsloping</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Number of Major Vessels</InputLabel>
                    <Select
                      name="ca"
                      value={formData.ca}
                      onChange={handleInputChange}
                      label="Number of Major Vessels"
                    >
                      <MenuItem value="0">0</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Thalassemia</InputLabel>
                    <Select
                      name="thal"
                      value={formData.thal}
                      onChange={handleInputChange}
                      label="Thalassemia"
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="fixed defect">Fixed Defect</MenuItem>
                      <MenuItem value="reversable defect">Reversible Defect</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Get Risk Assessment'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: 'fit-content' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Risk Assessment Results
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {result && (
              <Card sx={{ bgcolor: 'grey.50', textAlign: 'center', boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <FavoriteIcon sx={{ fontSize: 80, color: getRiskColor(result.riskLevel), mb: 2 }} />
                  <Typography variant="h4" gutterBottom color={getRiskColor(result.riskLevel)}>
                    {result.riskScore}%
                  </Typography>
                  <Typography variant="h6" gutterBottom color={getRiskColor(result.riskLevel)}>
                    {result.riskLevel} Risk
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(result.riskScore)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: 'grey.300',
                      transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getRiskColor(result.riskLevel),
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    Assessment completed on {new Date(result.timestamp).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!result && !loading && (
              <Typography variant="body2" color="text.secondary">
                Fill out the form and submit to get your risk assessment.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PredictionPage;