import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const authData = await authService.login(username, password);
      setCurrentUser(authData.record);
      return authData.record;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.register(userData);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Update profile function
  const updateProfile = async (userId, userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.updateProfile(userId, userData);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (userId, currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await authService.changePassword(userId, currentPassword, newPassword);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return currentUser && currentUser.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole('Admin');

  // Check if user is staff
  const isStaff = () => hasRole('Staff') || hasRole('Admin');

  // Check if user is client
  const isClient = () => hasRole('Client');

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAdmin,
    isStaff,
    isClient
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
