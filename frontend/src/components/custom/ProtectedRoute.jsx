import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <Navigate to="/" replace />;

  const role = user.publicMetadata?.role || localStorage.getItem("role");

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    // redirect to their own dashboard
    return <Navigate to={role === "doctor" ? "/dashboard-doctor" : "/dashboard"} replace />;
  }

  return children;
}
