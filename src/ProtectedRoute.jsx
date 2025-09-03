import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '@/store/slices/authSlice';

/**
 * ProtectedRoute - Component that protects routes based on authentication and user roles
 * 
 * @param {Object} props
 * @param {Array} props.allowedRoles - Array of roles allowed to access this route
 * @param {string} [props.redirectPath='/'] - Path to redirect to if not authenticated or not authorized
 * @returns {JSX.Element} - Renders the child components if authorized, otherwise redirects
 */
const ProtectedRoute = ({ allowedRoles, redirectPath = '/' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if roles are specified and if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser?.role;
    const hasRequiredRole = allowedRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      // User doesn't have the required role, redirect to dashboard or unauthorized page
      return <Navigate to="/app/product" state={{ from: location }} replace />;
    }
  }

  // User is authenticated and authorized, render the child route
  return <Outlet />;
};

export default ProtectedRoute;