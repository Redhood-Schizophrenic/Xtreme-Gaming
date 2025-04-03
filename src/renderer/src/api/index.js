import pb from './pocketbase';
import authService from './auth';
import usersService from './users';
import inventoryService from './inventory';
import sessionsService from './sessions';
import transactionsService from './transactions';
import groupsService from './groups';
import pricingService from './pricing';

// Export all API services
export {
  pb,
  authService,
  usersService,
  inventoryService,
  sessionsService,
  transactionsService,
  groupsService,
  pricingService
};

// Export a default API object with all services
const api = {
  pb,
  auth: authService,
  users: usersService,
  inventory: inventoryService,
  sessions: sessionsService,
  transactions: transactionsService,
  groups: groupsService,
  pricing: pricingService
};

export default api;
