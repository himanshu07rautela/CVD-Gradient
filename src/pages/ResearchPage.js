import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Science,
  DataUsage,
  Assessment,
  Security,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Global } from '@emotion/react';

const ResearchPage = () => {
  const methodologies = [
    {
      icon: <DataUsage sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'LASSO Feature Selection',
      description: 'Least Absolute Shrinkage and Selection Operator (LASSO) is used to identify the most important features for cardiovascular disease prediction. This regularization technique helps reduce overfitting and improves model interpretability by selecting only the most relevant variables.',
      benefits: ['Feature Selection', 'Dimensionality Reduction', 'Model Interpretability'],
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Gradient Boosting',
      description: 'Gradient Boosting is an ensemble learning method that builds a strong predictive model by combining multiple weak learners. It sequentially trains models to correct the errors of previous models, resulting in high accuracy and robust predictions.',
      benefits: ['High Accuracy', 'Robust Performance', 'Handles Non-linear Relationships'],
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Model Validation',
      description: 'Our model undergoes rigorous validation using cross-validation techniques and is tested on independent datasets to ensure reliable and generalizable predictions for cardiovascular disease risk assessment.',
      benefits: ['Cross-validation', 'Independent Testing', 'Performance Metrics'],
    },
  ];

  const features = [
    'Age and Gender',
    'Blood Pressure (Systolic/Diastolic)',
    'Cholesterol Levels (Total, HDL, LDL)',
    'Blood Sugar Levels',
    'Electrocardiogram Results',
    'Exercise-Induced Angina',
    'ST Depression',
    'Number of Major Vessels',
    'Thalassemia',
  ];

  const modelResults = [
    { Models: 'Logistic Regression', Accuracy: 0.84, F1Score1: 0.86 },
    { Models: 'KNN / K-Nearest Neighbours', Accuracy: 0.86, F1Score1: 0.88 },
    { Models: 'XGBoost', Accuracy: 0.85, F1Score1: 0.86 },
    { Models: 'Random Forests', Accuracy: 0.84, F1Score1: 0.86 },
    { Models: 'SVM(Support Vector Machine)', Accuracy: 0.86, F1Score1: 0.88 },
    { Models: 'Decision Trees', Accuracy: 0.80, F1Score1: 0.82 },
    { Models: 'GA + Gradient Boosting', Accuracy: 0.82, F1Score1: 0.84 },
    { Models: 'GA + XGBoost', Accuracy: 0.86, F1Score1: 0.87 },
    { Models: 'GA + Logistic Regression', Accuracy: 0.85, F1Score1: 0.87 },
    { Models: 'GA + SVM', Accuracy: 0.85, F1Score1: 0.88 },
    { Models: 'LASSO + Gradient Boosting', Accuracy: 0.84, F1Score1: 0.85 },
    { Models: 'LASSO + XGBoost', Accuracy: 0.86, F1Score1: 0.88 },
    { Models: 'LASSO + Logistic Regression', Accuracy: 0.82, F1Score1: 0.85 },
    { Models: 'LASSO + SVM', Accuracy: 0.85, F1Score1: 0.87 },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Global styles={{
        body: { overflowX: 'hidden', background: isMobile ? '#ffcdd2' : undefined },
        html: { overflowX: 'hidden', background: isMobile ? '#ffcdd2' : undefined },
      }} />
      <Container maxWidth={false} disableGutters sx={{ width: isMobile ? '100vw' : '100%', maxWidth: isMobile ? '100vw' : undefined, minWidth: 0, px: 0, bgcolor: '#ffcdd2' }}>
        <Box sx={{ bgcolor: '#ffcdd2', minHeight: '100vh', width: '100%', maxWidth: '100vw', px: isMobile ? 1.5 : 4 }}>
      <Typography variant="h3" gutterBottom color="primary" textAlign="center">
        Research & Methodology
      </Typography>
      <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
        Understanding our AI-powered cardiovascular disease prediction model
      </Typography>

      {/* Overview Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Model Overview
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
          Our cardiovascular disease prediction model combines advanced machine learning techniques 
          with clinical expertise to provide accurate risk assessments. The model utilizes the UCI 
          Heart Disease dataset and implements a two-stage approach: feature selection using LASSO 
          followed by classification using Gradient Boosting.
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
          This approach ensures that only the most clinically relevant features are used for prediction, 
          while the ensemble method provides robust and accurate risk assessments that can help in 
          early detection and preventive care.
        </Typography>
      </Box>

      {/* Methodology Cards */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Methodology
        </Typography>
        <Grid container spacing={4}>
          {methodologies.map((method, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {method.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    {method.title}
                  </Typography>
                  <Typography variant="body2" paragraph color="text.secondary">
                    {method.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {method.benefits.map((benefit, idx) => (
                      <Chip
                        key={idx}
                        label={benefit}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Key Features Used
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      mr: 2,
                    }}
                  />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      {/* Performance Metrics */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Model Performance
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Accuracy Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Overall Accuracy</Typography>
                    <Typography variant="h6" color="primary">85.9%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Precision</Typography>
                    <Typography variant="h6" color="primary">86.0%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Recall</Typography>
                    <Typography variant="h6" color="primary">85.0%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>F1-Score</Typography>
                    <Typography variant="h6" color="primary">86.0%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

          {/* Confusion Matrix Section */}
          <Box sx={{ mb: 6, overflowX: 'auto', width: '100%', maxWidth: isMobile ? '100vw' : 500 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Confusion Matrix (LASSO + Gradient Boosting)
            </Typography>
            <Paper elevation={2} sx={{ p: 2, width: '100%', maxWidth: isMobile ? '100vw' : 500, mx: 'auto', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: isMobile ? 12 : 16 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}></th>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}>Predicted: 0</th>
                    <th style={{ border: '1px solid #ccc', padding: 8 }}>Predicted: 1</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>Actual: 0</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>44 (TN)</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>6 (FP)</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>Actual: 1</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>7 (FN)</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>43 (TP)</td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </Box>

          {/* Model Comparison Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Why We Chose LASSO + Gradient Boosting
            </Typography>
            <Typography variant="body1" paragraph>
              After comparing multiple models and feature selection methods, we decided to use <b>LASSO + Gradient Boosting</b> for our final cardiovascular disease prediction model. This combination provided the best balance between accuracy, precision, recall, and interpretability.<br/><br/>
              <b>Performance Metrics:</b><br/>
              Accuracy: <b>84%</b><br/>
              ROC AUC: <b>0.90</b><br/>
              Precision (0): <b>0.82</b> &nbsp; Precision (1): <b>0.85</b><br/>
              F1-Score (0): <b>0.81</b> &nbsp; F1-Score (1): <b>0.85</b><br/>
            </Typography>
            {/* Bar Chart: Accuracy by Model */}
            <Box sx={{ mb: 4, width: '100%', maxWidth: isMobile ? '100vw' : '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">Accuracy by Model</Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 500 : 600} minWidth={isMobile ? 320 : 600}>
                <BarChart data={modelResults} layout="vertical" margin={{ left: isMobile ? 60 : 120, right: 30, top: 10, bottom: 10 }}>
                  <XAxis type="number" domain={[0.75, 0.9]} tick={{ fontSize: isMobile ? 11 : 14 }} />
                  <YAxis type="category" dataKey="Models" width={isMobile ? 120 : 250} tick={{ fontSize: isMobile ? 11 : 13 }} />
                  <Tooltip />
                  <Bar dataKey="Accuracy" fill="#e57373" label={{ position: 'right', fontSize: isMobile ? 11 : 14 }} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            {/* Bar Chart: F1-Score (1) by Model */}
            <Box sx={{ mb: 4, width: '100%', maxWidth: isMobile ? '100vw' : '100%' }}>
              <Typography variant="h6" gutterBottom color="primary">F1-Score (Class 1) by Model</Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 500 : 600} minWidth={isMobile ? 320 : 600}>
                <BarChart data={modelResults} layout="vertical" margin={{ left: isMobile ? 60 : 120, right: 30, top: 10, bottom: 10 }}>
                  <XAxis type="number" domain={[0.75, 0.9]} tick={{ fontSize: isMobile ? 11 : 14 }} />
                  <YAxis type="category" dataKey="Models" width={isMobile ? 120 : 250} tick={{ fontSize: isMobile ? 11 : 13 }} />
                  <Tooltip />
                  <Bar dataKey="F1Score1" fill="#64b5f6" label={{ position: 'right', fontSize: isMobile ? 11 : 14 }} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            {/* Comparison Table: LASSO vs GA */}
            <Box sx={{ mb: 4, width: '100%', maxWidth: isMobile ? '100vw' : 500 }}>
              <Typography variant="h6" gutterBottom color="primary">LASSO vs GA: Mean Scores</Typography>
              <Paper elevation={2} sx={{ p: 2, maxWidth: 500 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: 8 }}>Method</th>
                      <th style={{ border: '1px solid #ccc', padding: 8 }}>Mean Accuracy</th>
                      <th style={{ border: '1px solid #ccc', padding: 8 }}>Mean ROC AUC</th>
                      <th style={{ border: '1px solid #ccc', padding: 8 }}>Mean F1-Score (1)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>LASSO</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.843</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.907</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.867</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>GA</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.845</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.910</td>
                      <td style={{ border: '1px solid #ccc', padding: 8 }}>0.857</td>
                    </tr>
                  </tbody>
                </table>
              </Paper>
            </Box>
          </Box>

      {/* Dataset Information */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Dataset Information
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            UCI Heart Disease Dataset
          </Typography>
          <Typography variant="body1" paragraph>
            Our model is trained on the UCI Heart Disease dataset, which contains comprehensive 
            medical records from multiple institutions. The dataset includes various clinical 
            parameters and has been extensively used in cardiovascular disease research.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="922 Records" color="primary" variant="outlined" />
            <Chip label="13 Features" color="primary" variant="outlined" />
            <Chip label="Multiple Institutions" color="primary" variant="outlined" />
            <Chip label="Clinical Parameters" color="primary" variant="outlined" />
          </Box>
        </Paper>
      </Box>

      {/* Future Work */}
      <Box>
        <Typography variant="h4" gutterBottom color="primary">
          Future Enhancements
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Model Improvements
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Integration of additional biomarkers
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Real-time data processing capabilities
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Personalized risk assessment algorithms
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Clinical Integration
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Electronic Health Record integration
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Automated clinical decision support
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Multi-center validation studies
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
          </Box>
      </Box>
    </Container>
    </>
  );
};

export default ResearchPage; 