import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AccountCircle, ExitToApp } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme, useMediaQuery } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleDashboard = () => {
    if (user?.role === 'doctor') {
      navigate('/doctor-dashboard');
    } else {
      navigate('/patient-dashboard');
    }
    handleClose();
  };

  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    user && { label: 'Predict', onClick: () => navigate('/predict') },
    { label: 'Research', onClick: () => navigate('/research') },
    { label: 'Team', onClick: () => navigate('/team') },
  ].filter(Boolean);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 16px 0 rgba(233,30,99,0.08)',
        borderBottom: '1px solid #f8bbd0',
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 2 }} onClick={() => navigate('/') }>
          <img src="/logo.jpg" alt="Logo" style={{ height: 36, marginRight: 8 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}
          >
            CVD Gradient
          </Typography>
        </Box>
        {isMobile ? (
          <>
            <IconButton
              color="primary"
              edge="end"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={null}
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
            >
              {menuItems.map((item, idx) => (
                <MenuItem key={idx} onClick={() => { item.onClick(); setMobileMenuOpen(false); }}>
                  {item.label}
                </MenuItem>
              ))}
              {user ? [
                <MenuItem key="dashboard" onClick={() => { handleDashboard(); setMobileMenuOpen(false); }}>
                  Dashboard
                </MenuItem>,
                <MenuItem key="logout" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <ExitToApp sx={{ mr: 1 }} /> Logout
                </MenuItem>
              ] : [
                <MenuItem key="login" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                  Login
                </MenuItem>
              ]}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
            {menuItems.map((item, idx) => (
              <Button
                key={idx}
                color="primary"
                onClick={item.onClick}
                sx={{ fontWeight: 500, fontSize: '1rem', px: 2, borderRadius: 2, '&:hover': { bgcolor: 'primary.50' } }}
              >
                {item.label}
              </Button>
            ))}
            {user ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{ ml: 1 }}
                  color="primary"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="secondary"
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 600, borderRadius: 2, boxShadow: 1 }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 