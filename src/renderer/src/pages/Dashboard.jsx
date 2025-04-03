import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Badge,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  ArrowUpward as TopUpIcon,
  ShoppingCart as SellIcon,
  PlayArrow as StartIcon,
  Timer as TimerIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Computer,
  People,
  AttachMoney,
  Inventory,
  Warning
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sessionsService, inventoryService, transactionsService } from '../api';

// Styled components
const ActionButton = styled(Button)(({ theme, color }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: color,
  color: 'white',
  '&:hover': {
    backgroundColor: color,
    opacity: 0.9,
  },
}));

const StationButton = styled(Button)(({ theme, status }) => ({
  width: '50px',
  height: '50px',
  margin: theme.spacing(0.5),
  backgroundColor: status === 'available' ? '#2c3e50' :
                  status === 'occupied' ? '#c0392b' :
                  status === 'reserved' ? '#d35400' : '#2c3e50',
  color: 'white',
  '&:hover': {
    backgroundColor: status === 'available' ? '#34495e' :
                    status === 'occupied' ? '#e74c3c' :
                    status === 'reserved' ? '#e67e22' : '#34495e',
  },
}));

const ZoneSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#1e2a38',
}));

const SessionDetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
}));

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State for active sessions
  const [activeSessions, setActiveSessions] = useState([]);
  // State for terminals/stations
  const [stations, setStations] = useState({
    'Regular Gaming Zone': Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: i === 5 || i === 6 ? 'occupied' : 'available'
    })),
    'Premium Gaming Zone': Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: i === 3 || i === 4 ? 'occupied' : 'available'
    })),
    'Tournament Area': Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: i === 4 ? 'occupied' : 'available'
    })),
    'Casual Gaming Zone': Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: i === 3 ? 'occupied' : 'available'
    })),
    'Gaming Zone': Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      status: i === 3 || i === 4 ? 'occupied' : 'available'
    }))
  });

  // State for clients/users
  const [clients, setClients] = useState([
    { id: 1, login: 'guest1', name: 'Deva', minutes: '15min', balance: 0 },
    { id: 2, login: 'guest2', name: 'sahas', minutes: '30min', balance: 0 },
    { id: 3, login: 'guest3', name: 'Pratik', minutes: '60min', balance: 0 },
    { id: 4, login: 'guest4', name: 'Rohan', minutes: '50min', balance: 0 },
    { id: 5, login: 'guest5', name: 'durga', minutes: '80min', balance: 0 },
    { id: 6, login: 'guest6', name: 'siddhi', minutes: '30min', balance: 0 },
    { id: 7, login: 'Pre-paid', name: 'Ganju', minutes: '20min', balance: 200 }
  ]);

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for selected station
  const [selectedStation, setSelectedStation] = useState({
    id: 'PC-05',
    date: '20-03-2025',
    time: '19:00',
    duration: '2 hours',
    subtotal: '$28',
    tax: '$2',
    total: '$30.00',
    timeRemaining: '1:45:30'
  });

  // State for chat messages
  const [chatMessages, setChatMessages] = useState([
    { station: 'Station 01', status: 'Need 2 Lays chips Packets', admin: 'Okay got it' }
  ]);

  // State for new chat message
  const [newMessage, setNewMessage] = useState('');

  // State for transactions
  const [transactions, setTransactions] = useState([
    { time: '19:00', name: 'John Doe', item: 'Lay Packets', quantity: '02', terminal: 'PC-05', session: '2 hours' }
  ]);

  // State for active clients
  const [activeClients, setActiveClients] = useState([
    { name: 'Devanshu umbare', station: 'PC-03', duration: '60min', amount: '140' },
    { name: 'Sahas Kamble', station: 'PC-04', duration: '30min', amount: '70' },
    { name: 'Rohan Baghat', station: 'PC-05', duration: '20min', amount: '50' },
    { name: 'Abhishek More', station: 'PC-06', duration: '10min', amount: '30' }
  ]);

  const [loading, setLoading] = useState(false);

  // Fetch active sessions on component mount
  useEffect(() => {
    const fetchActiveSessions = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your PocketBase
        // const sessionsData = await sessionsService.getActiveSessions();
        // setActiveSessions(sessionsData.items);

        // For now, we'll use mock data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching active sessions:', error);
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle station selection
  const handleStationSelect = (zone, stationId) => {
    setSelectedStation({
      ...selectedStation,
      id: `${zone.charAt(0)}C-${stationId.toString().padStart(2, '0')}`
    });
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { station: 'Admin', status: newMessage, admin: '' }
      ]);
      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#121a24' }}>
      {/* Top Navigation Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: '#1e2a38', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>Setup</Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">POS</Button>
          <Button color="inherit">Inventory</Button>
          <Button color="inherit">Reports</Button>
          <Button color="inherit">Setting</Button>
        </Box>
        <Box>
          <ActionButton color="#34495e" startIcon={<AddIcon />}>
            New
          </ActionButton>
          <ActionButton color="#3498db" startIcon={<TopUpIcon />}>
            Top-up
          </ActionButton>
          <ActionButton color="#f39c12" startIcon={<SellIcon />}>
            Sell
          </ActionButton>
          <ActionButton color="#2ecc71" startIcon={<StartIcon />}>
            Start
          </ActionButton>
          <ActionButton color="#9b59b6" startIcon={<TimerIcon />}>
            Add time
          </ActionButton>
          <ActionButton color="#e74c3c" startIcon={<StopIcon />}>
            Stop
          </ActionButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Client List */}
        <Paper sx={{ width: 250, m: 1, bgcolor: '#1e2a38', color: 'white', overflow: 'auto' }}>
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'gray' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                  color: 'white'
                }
              }}
            />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>ID</TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Login</TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Minutes</TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.id}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.login}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.name}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.minutes}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* Middle Panel - Station Selection */}
        <Paper sx={{ flexGrow: 1, m: 1, bgcolor: '#1e2a38', color: 'white', overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Select Your Station</Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
              Welcome to the Booking System interface
            </Typography>

            {/* Gaming Zones */}
            {Object.entries(stations).map(([zoneName, zoneStations]) => (
              <ZoneSection key={zoneName}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>{zoneName}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                  {zoneStations.map((station) => (
                    <StationButton
                      key={station.id}
                      status={station.status}
                      onClick={() => handleStationSelect(zoneName, station.id)}
                    >
                      {station.id.toString().padStart(2, '0')}
                    </StationButton>
                  ))}
                </Box>
              </ZoneSection>
            ))}

            {/* Screen Monitoring and Chat */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#121a24', p: 1, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">Screen Monitoring</Typography>
                    <Button startIcon={<RefreshIcon />} size="small" variant="contained" color="primary">
                      Refresh
                    </Button>
                  </Box>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src="https://i.imgur.com/XYQbxjl.jpg"
                      alt="Gaming Setup"
                      style={{ width: '100%', borderRadius: 4 }}
                    />
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{ position: 'absolute', top: 8, left: 8 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        p: 0.5,
                        borderRadius: 1
                      }}
                    >
                      1:45:30
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: '#121a24', p: 1, borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">Customer Chat</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 1 }}>
                    {chatMessages.map((msg, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography variant="body2" color="success.main">• {msg.station}</Typography>
                        <Typography variant="body2">Status: {msg.status}</Typography>
                        {msg.admin && (
                          <Typography variant="body2" color="text.secondary">Admin: {msg.admin}</Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <TextField
                      fullWidth
                      placeholder="Write here"
                      variant="outlined"
                      size="small"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#2c3e50',
                          color: 'white',
                          '& fieldset': { borderColor: 'transparent' },
                          '&:hover fieldset': { borderColor: 'transparent' },
                          '&.Mui-focused fieldset': { borderColor: 'transparent' }
                        }
                      }}
                    />
                    <IconButton
                      color="primary"
                      sx={{ ml: 1 }}
                      onClick={handleSendMessage}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Right Panel - Session Details */}
        <Paper sx={{ width: 300, m: 1, bgcolor: '#1e2a38', color: 'white', overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <SessionDetailItem>
              <Typography variant="body1">Station</Typography>
              <Typography variant="body1" fontWeight="bold">{selectedStation.id}</Typography>
            </SessionDetailItem>
            <SessionDetailItem>
              <Typography variant="body1">Date</Typography>
              <Typography variant="body1">{selectedStation.date}</Typography>
            </SessionDetailItem>
            <SessionDetailItem>
              <Typography variant="body1">Time</Typography>
              <Typography variant="body1">{selectedStation.time}</Typography>
            </SessionDetailItem>
            <SessionDetailItem>
              <Typography variant="body1">Duration</Typography>
              <Typography variant="body1">{selectedStation.duration}</Typography>
            </SessionDetailItem>
            <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <SessionDetailItem>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{selectedStation.subtotal}</Typography>
            </SessionDetailItem>
            <SessionDetailItem>
              <Typography variant="body1">Tax</Typography>
              <Typography variant="body1">{selectedStation.tax}</Typography>
            </SessionDetailItem>
            <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
            <SessionDetailItem>
              <Typography variant="body1">Total</Typography>
              <Typography variant="h6" color="primary">{selectedStation.total}</Typography>
            </SessionDetailItem>
            <SessionDetailItem>
              <Typography variant="body1">Time Remaining:</Typography>
              <Typography variant="body1" color="success.main">{selectedStation.timeRemaining}</Typography>
            </SessionDetailItem>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: '#2c3e50', '&:hover': { bgcolor: '#34495e' } }}
            >
              Payment Pending
            </Button>

            <Box sx={{ mt: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Client Name</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Section</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Duration</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeClients.map((client, index) => (
                      <TableRow key={index} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.name}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.station}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.duration}</TableCell>
                        <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{client.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Bottom Panel - Transactions */}
      <Paper sx={{ m: 1, bgcolor: '#1e2a38', color: 'white' }}>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Time</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Item(s)</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Quantity</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Terminal</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>Session</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' } }}>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.time}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.name}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.item}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.quantity}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.terminal}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>{transaction.session}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default Dashboard;
