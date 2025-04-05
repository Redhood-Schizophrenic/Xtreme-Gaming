import { toast } from "sonner";

const data = [
  {
    name: 'Shashank Sangawar',
    contact: '1234567890',
    remaining_time: {
      Hours: 1,
      Mins: 45
    },
    total_visits: 4,
    isMember: true,
    status: 'Active',
  },
  {
    name: 'Sahas Kamble',
    contact: '0000000000',
    remaining_time: {
      Hours: 0,
      Mins: 45
    },
    total_visits: 2,
    isMember: true,
    status: 'Active',
  },
  {
    name: 'Devanshu Umbare',
    contact: '1111111111',
    remaining_time: {
      Hours: 1,
      Mins: 23
    },
    total_visits: 1,
    isMember: true,
    status: 'Active',
  },
  {
    name: 'Chinmay Jadhav',
    contact: '8080808080',
    remaining_time: {
      Hours: 2,
      Mins: 0
    },
    total_visits: 0,
    isMember: false,
    status: 'Inactive',
  },
];

export default async function fetchCustomers() {
  try {
    return data;
  } catch (error) {
    toast.error('Error occured while fetching Customers, please try again later....')

  }
}
