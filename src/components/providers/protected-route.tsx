import { useAuth } from "./auth-provider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ role: requiredRole }: { role: "admin" | "user" }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === "admin" && role !== "admin") {
    // Redirect non-admins away from admin pages
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
