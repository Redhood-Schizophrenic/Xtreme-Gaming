import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

function DashboardLayout({ children }) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#121a24',
      color: 'white'
    }}>
      <CssBaseline />
      {/* Render either the children or the outlet */}
      {children || <Outlet />}
    </Box>
  );
}

export default DashboardLayout;
