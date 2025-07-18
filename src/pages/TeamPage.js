import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  School,
  Work,
  Email,
  LinkedIn,
  GitHub,
} from '@mui/icons-material';

const TeamPage = () => {
  const teamMembers = [
    {
      name: 'Himanshu Rautela',
      role: 'Student, IIIT Kota',
      avatar: 'HR',
      bio: 'Developed the entire website, contributed to model implementation, and ensured seamless integration of all components.',
      education: 'B.Tech, IIIT Kota',
      linkedin: 'https://www.linkedin.com/in/himanshu-rautela/',
    },
    {
      name: 'Manas Rajpal',
      role: 'Student, IIIT Kota',
      avatar: 'MR',
      bio: 'Contributed to writing the research paper.',
      education: 'B.Tech, IIIT Kota',
      linkedin: 'https://www.linkedin.com/in/manas-rajpal-81b197256/',
    },
    {
      name: 'Megh Kakadiya',
      role: 'Student, IIIT Kota',
      avatar: 'MK',
      bio: 'Led the implementation of machine learning models and performed major data analysis for the project.',
      education: 'B.Tech, IIIT Kota',
      linkedin: 'https://www.linkedin.com/in/megh-kakadiya-04ab83311/',
    },
  ];

  const advisors = [
    {
      name: 'Dr. Parikshit Kishor Singh',
      role: 'Mentor',
      title: 'HOD, ECE Dept, IIIT Kota',
      avatar: 'PKS',
      linkedin: 'https://www.linkedin.com/in/parikshit-singh-25496b20/',
      bio: 'Formed and guided the team for this major college project, providing direction and support throughout.'
    },
    {
      name: 'Mr. Snehanshu Shekhar',
      role: 'Mentor',
      title: 'Professor, BIT Mesra',
      avatar: 'SS',
      researchgate: 'https://www.researchgate.net/profile/Snehanshu-Shekhar',
      bio: 'Actively advised the team, offering valuable insights and mentorship during the project.'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom color="primary" textAlign="center">
        Our Team
      </Typography>
      <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
        Meet the experts behind our cardiovascular disease prediction platform
      </Typography>

      {/* Mission Statement */}
      <Paper elevation={2} sx={{ p: 4, mb: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom color="primary">
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', maxWidth: 800, mx: 'auto' }}>
          Our project is inspired by the vision of <b>Ayushman Bharat</b>—to make quality healthcare accessible and affordable for all. We aim to leverage artificial intelligence for early detection and risk assessment of cardiovascular diseases, empowering both patients and clinicians. Guided by our mentors and driven by a passion for impact, we strive to build technology that serves society at scale.
        </Typography>
      </Paper>

      {/* Core Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Core Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', transition: 'box-shadow 0.3s', boxShadow: 1, '&:hover': { boxShadow: '0 0 16px 4px #ff8a80' } }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {member.avatar}
                    </Avatar>
                    <Typography variant="h6" gutterBottom color="primary">
                      {member.name}
                    </Typography>
                    <Typography variant="subtitle1" color="secondary.main" gutterBottom>
                      {member.role}
                    </Typography>
                  </Box>

                  <Typography variant="body2" paragraph color="text.secondary">
                    {member.bio}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <School sx={{ fontSize: 16, mr: 1 }} />
                      {member.education}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {/* No expertise for students */}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {member.linkedin && (
                      <Chip
                        icon={<LinkedIn />}
                        label="LinkedIn"
                        size="small"
                        variant="outlined"
                        color="primary"
                        component="a"
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Mentors & Advisors */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Mentors & Advisors
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {advisors.map((advisor, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ height: '100%', transition: 'box-shadow 0.3s', boxShadow: 1, '&:hover': { boxShadow: '0 0 16px 4px #ff8a80' } }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'secondary.main',
                        fontSize: '1.5rem',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {advisor.avatar}
                    </Avatar>
                    <Typography variant="h6" gutterBottom color="primary">
                        {advisor.name}
                      </Typography>
                    <Typography variant="subtitle1" color="secondary.main" gutterBottom>
                        {advisor.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {advisor.title}
                      </Typography>
                    {advisor.bio && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {advisor.bio}
                      </Typography>
                    )}
                    </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    {advisor.linkedin && (
                      <Chip
                        icon={<LinkedIn />}
                        label="LinkedIn"
                        size="small"
                        variant="outlined"
                        color="primary"
                        component="a"
                        href={advisor.linkedin}
                        target="_blank"
                        rel="noopener"
                      />
                    )}
                    {advisor.researchgate && (
                      <Chip
                        label="ResearchGate"
                        size="small"
                        variant="outlined"
                        color="primary"
                        component="a"
                        href={advisor.researchgate}
                        target="_blank"
                        rel="noopener"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Values */}
      <Box>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Our Values
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Innovation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continuously advancing the state-of-the-art in medical AI and cardiovascular health prediction.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Clinical Excellence
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensuring our solutions meet the highest standards of clinical validation and patient safety.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Accessibility
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Making advanced cardiovascular risk assessment available to healthcare providers and patients worldwide.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TeamPage; 