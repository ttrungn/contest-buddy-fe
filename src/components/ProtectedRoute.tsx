import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/services/store/store";
import { UserRole } from "@/interfaces/IAuth";

interface ProtectedRouteProps {
    children: ReactNode;
    requireAuth?: boolean;
    allowedRoles?: UserRole[];
    redirectTo?: string;
    authRedirectTo?: string; // Where to redirect authenticated users (for login/register pages)
    blockedRoles?: UserRole[]; // Roles that are not allowed to access this route
    blockedRedirectTo?: string; // Where to redirect blocked roles
}

export default function ProtectedRoute({
    children,
    requireAuth = false,
    allowedRoles = [],
    redirectTo = "/login",
    authRedirectTo, // Only redirect when explicitly provided (e.g., login/register pages)
    blockedRoles = [],
    blockedRedirectTo = "/organizer/competitions",
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const location = useLocation();

    // If route should not be accessible to authenticated users (login, register, etc.)
    if (authRedirectTo && isAuthenticated) {
        return <Navigate to={authRedirectTo} state={{ from: location }} replace />;
    }

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // If specific roles are required
    if (allowedRoles.length > 0 && isAuthenticated && user) {
        const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role));

        if (!hasAllowedRole) {
            // Redirect to a dedicated unauthorized route for consistent layout handling
            return <Navigate to="/unauthorized" state={{ from: location }} replace />;
        }
    }

    // If specific roles are blocked from this route
    if (blockedRoles.length > 0 && isAuthenticated && user) {
        const isBlocked = user.roles.some(role => blockedRoles.includes(role));
        if (isBlocked) {
            return <Navigate to={blockedRedirectTo} state={{ from: location }} replace />;
        }
    }

    // If all checks pass, render the children
    return <>{children}</>;
}