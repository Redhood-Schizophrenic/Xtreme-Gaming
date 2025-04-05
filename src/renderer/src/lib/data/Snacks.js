import { toast } from "sonner";

const SnacksData = [
  {
    name: "Smoodh (Rs. 15)",
    type: 'Drinkables',
    quantity: 12,
    selling_price_per: 15,
    status: 'Available',
  },
  {
    name: "Kurkure (Rs. 25)",
    type: 'Eatables',
    quantity: 34,
    selling_price_per: 25,
    status: 'Available',
  },
  {
    name: "Kurkure (Rs. 45)",
    type: 'Eatables',
    quantity: 24,
    selling_price_per: 45,
    status: 'Available',
  },
  {
    name: "Lays (Rs. 25)",
    type: 'Eatables',
    quantity: 4,
    selling_price_per: 25,
    status: 'Low Stock',
  },
];

export const fetchSnacks = async () => {
  try {
    return SnacksData;
  } catch (error) {
    toast.error('Error Fetching Snacks')
  }
} 
