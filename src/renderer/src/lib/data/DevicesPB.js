import { toast } from "sonner";
import pbService from '../services/PocketBase';

// Sample device data for initial setup
const sampleDevices = [
  {
    name: 'PC-1',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-2',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-3',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-4',
    type: "PC Gaming",
    status: "Occupied"
  },
  {
    name: 'PC-5',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-6',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-7',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-8',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-9',
    type: "PC Gaming",
    status: "Available"
  },
  {
    name: 'PC-10',
    type: "PC Gaming",
    status: "Available"
  },
];

// Function to initialize devices in PocketBase if they don't exist
export const initializeDevices = async () => {
  try {
    // Check if devices collection exists and has data
    const existingDevices = await pbService.getFullList('devices');
    
    // If no devices exist, create them
    if (!existingDevices || existingDevices.length === 0) {
      for (const device of sampleDevices) {
        await pbService.create('devices', device);
      }
      toast.success('Devices initialized successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing devices:', error);
    // If the collection doesn't exist, this will fail silently
    // The app will show the "No devices found" message
    return false;
  }
};

// Function to fetch devices from PocketBase
export const fetchDevicesFromPB = async () => {
  try {
    const devices = await pbService.getFullList('devices');
    return devices;
  } catch (error) {
    toast.error('Error fetching devices from PocketBase');
    console.error('Error fetching devices:', error);
    return [];
  }
};
