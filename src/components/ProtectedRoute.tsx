import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export type UserRole = string;

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login while saving the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = (user as any).role || user.user_metadata?.role || "";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If the user doesn't have the required role, redirect to their default home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
