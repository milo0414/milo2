import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-mark" />
        <p>正在为您准备...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    const redirectTo = user.role === 'staff' ? '/staff/orders' : '/customer/menu';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
