import { Navigate } from 'react-router';
import { useAuth } from "../../contexts/AuthContext";

// User
export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
//
// // Admin route component
// function AdminRoute({ children }) {
//   const { currentUser, loading, isAdmin } = useAuth();
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//
//   if (!currentUser) {
//     return <Navigate to="/login" />;
//   }
//
//   if (!isAdmin()) {
//     return <Navigate to="/" />;
//   }
//
//   return children;
// }
//
// // Staff route component
// function StaffRoute({ children }) {
//   const { currentUser, loading, isStaff } = useAuth();
//
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//
//   if (!currentUser) {
//     return <Navigate to="/login" />;
//   }
//
//   if (!isStaff()) {
//     return <Navigate to="/" />;
//   }
//
//   return children;
// }
