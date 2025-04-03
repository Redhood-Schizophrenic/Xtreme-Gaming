import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Collapse,
  Box,
  Toolbar
} from '@mui/material';
import { 
  Dashboard, 
  People, 
  Inventory, 
  PointOfSale, 
  Computer, 
  BarChart, 
  Settings,
  ExpandLess,
  ExpandMore,
  Timer,
  Receipt,
  Group,
  Storage,
  Backup
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Drawer width
const drawerWidth = 240;

function Sidebar({ open }) {
  const location = useLocation();
  const { isAdmin, isStaff } = useAuth();
  
  // State for nested menu items
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Toggle functions for nested menus
  const handleInventoryClick = () => {
    setInventoryOpen(!inventoryOpen);
  };

  const handleReportsClick = () => {
    setReportsOpen(!reportsOpen);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          transition: 'transform 0.3s ease-in-out',
          transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/" 
              selected={isActive('/')}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/sessions" 
              selected={isActive('/sessions')}
            >
              <ListItemIcon>
                <Timer />
              </ListItemIcon>
              <ListItemText primary="Sessions" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/pos" 
              selected={isActive('/pos')}
            >
              <ListItemIcon>
                <PointOfSale />
              </ListItemIcon>
              <ListItemText primary="Point of Sale" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              to="/terminals" 
              selected={isActive('/terminals')}
            >
              <ListItemIcon>
                <Computer />
              </ListItemIcon>
              <ListItemText primary="Terminals" />
            </ListItemButton>
          </ListItem>

          {/* Inventory Section */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleInventoryClick}>
              <ListItemIcon>
                <Inventory />
              </ListItemIcon>
              <ListItemText primary="Inventory" />
              {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/inventory/products" 
                selected={isActive('/inventory/products')}
              >
                <ListItemIcon>
                  <Storage />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>
              <ListItemButton 
                sx={{ pl: 4 }} 
                component={Link} 
                to="/inventory/stock" 
                selected={isActive('/inventory/stock')}
              >
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Stock" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Reports Section - Admin/Staff Only */}
          {isStaff() && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={handleReportsClick}>
                  <ListItemIcon>
                    <BarChart />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                  {reportsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton 
                    sx={{ pl: 4 }} 
                    component={Link} 
                    to="/reports/daily" 
                    selected={isActive('/reports/daily')}
                  >
                    <ListItemIcon>
                      <Receipt />
                    </ListItemIcon>
                    <ListItemText primary="Daily Report" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }} 
                    component={Link} 
                    to="/reports/sales" 
                    selected={isActive('/reports/sales')}
                  >
                    <ListItemIcon>
                      <BarChart />
                    </ListItemIcon>
                    <ListItemText primary="Sales Report" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}

          {/* Admin Only Section */}
          {isAdmin() && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton 
                  component={Link} 
                  to="/users" 
                  selected={isActive('/users')}
                >
                  <ListItemIcon>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton 
                  component={Link} 
                  to="/groups" 
                  selected={isActive('/groups')}
                >
                  <ListItemIcon>
                    <Group />
                  </ListItemIcon>
                  <ListItemText primary="PC Groups" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={handleSettingsClick}>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                  {settingsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton 
                    sx={{ pl: 4 }} 
                    component={Link} 
                    to="/settings/pricing" 
                    selected={isActive('/settings/pricing')}
                  >
                    <ListItemIcon>
                      <Receipt />
                    </ListItemIcon>
                    <ListItemText primary="Pricing" />
                  </ListItemButton>
                  <ListItemButton 
                    sx={{ pl: 4 }} 
                    component={Link} 
                    to="/settings/backup" 
                    selected={isActive('/settings/backup')}
                  >
                    <ListItemIcon>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText primary="Backup & Restore" />
                  </ListItemButton>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
