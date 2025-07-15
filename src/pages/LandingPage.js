import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Favorite,
  Psychology,
  TrendingUp,
  Security,
  Speed,
  Verified,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your health data to predict cardiovascular disease risk.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and stored securely. We prioritize your privacy.',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Instant Results',
      description: 'Get your risk assessment in seconds with our optimized prediction model.',
    },
    {
      icon: <Verified sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Clinically Validated',
      description: 'Our model is based on extensive research and validated clinical data.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #e91e63 100%)',
          color: 'white',
          py: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Overlay for better text contrast */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.32)',
          zIndex: 1,
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 4px 24px rgba(0,0,0,0.55)',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 2,
              px: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              display: 'inline-block',
              fontSize: { xs: '1.5rem', sm: '2.125rem', md: '3.75rem' },
              lineHeight: { xs: 1.2, sm: 1.3, md: 1.2 },
              wordWrap: 'break-word',
              maxWidth: '100%',
            }}
          >
            Predict Cardiovascular Disease Risk
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: { xs: 3, sm: 4 },
              opacity: 0.98,
              color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.35)',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 1,
              px: { xs: 1, sm: 2 },
              py: { xs: 0.5, sm: 1 },
              display: 'inline-block',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
              wordWrap: 'break-word',
              maxWidth: '100%',
            }}
          >
            Advanced AI-powered risk assessment using LASSO feature selection and Gradient Boosting
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/predict')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.2rem' },
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Start Prediction
          </Button>
        </Container>
      </Box>

      {/* About CVD Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom color="primary">
              Understanding Cardiovascular Disease
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              Cardiovascular disease (CVD) is a leading cause of death worldwide, affecting millions of people each year. 
              It encompasses various conditions affecting the heart and blood vessels, including coronary artery disease, 
              heart failure, and stroke.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
              Early detection and risk assessment are crucial for prevention and timely intervention. 
              Our advanced machine learning model helps identify individuals at risk, enabling proactive healthcare measures.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Chip
                icon={<TrendingUp />}
                label="Early Detection"
                color="primary"
                sx={{ mr: 1, mb: 1 }}
              />
              <Chip
                icon={<Favorite />}
                label="Preventive Care"
                color="secondary"
                sx={{ mr: 1, mb: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" gutterBottom color="primary">
                Key Risk Factors
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Age and gender
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Blood pressure levels
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Cholesterol levels
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Diabetes and blood sugar
                </Typography>
                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                  Lifestyle factors
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" gutterBottom color="primary">
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom color="primary">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom color="primary">
            Ready to Assess Your Risk?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
            Take the first step towards better heart health. Our AI model will analyze your data 
            and provide you with a comprehensive risk assessment.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/predict')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 