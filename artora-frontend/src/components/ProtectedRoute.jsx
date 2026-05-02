// ProtectedRoute — role-based guard
import { Navigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../utils/auth';

function ProtectedRoute({ children, allowedRole }) {
  const loggedIn = isLoggedIn();
  const userRole = getUserRole();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
