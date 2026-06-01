
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  // If no user, kick to login. 'replace' means back button won't loop.
  return user ? children : <Navigate to="/login" replace />;
}