import { toast } from "sonner";

const data = [
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


export const fetchDevices = async () => {
  try {
    return data;
  } catch (error) {
    toast.error('Error Fetching Snacks')
  }
}
