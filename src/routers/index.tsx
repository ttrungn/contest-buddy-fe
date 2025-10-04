
import { Route, Routes, Navigate } from "react-router-dom";
import Index from "../pages/Index";
import Profile from "../pages/user/Profile";
import Calendar from "../pages/user/Calendar";
import Competition from "../pages/competition/Competition";
import Community from "../pages/user/Community";
import Teams from "../pages/competition/Teams";
import CompetitionManagement from "../pages/organizer/CompetitionManagement";
import UserManagement from "../pages/admin/UserManagement";
import Reports from "../pages/organizer/Reports";
import Analytics from "../pages/organizer/Analytics";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";
import UserDetails from "../pages/user/UserDetails";
import TeamDetails from "../pages/competition/TeamDetails";
import MyCompetitions from "../pages/competition/MyCompetitions";
import OrganizerBilling from "../pages/organizer/OrganizerBilling";
import OrganizerProfile from "../pages/organizer/OrganizerProfile";
import OrganizerRegister from "../pages/organizer/OrganizerRegister";
import About from "../pages/About";
import Home from "../pages/Home";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import EmailVerification from "../pages/auth/EmailVerification";
import ResendVerification from "../pages/auth/ResendVerification";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Unauthorized from "../pages/auth/Unauthorized";

const AppRouter = () => {
    return (
        <Routes>
            {/* Root redirects to home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute blockedRoles={["organizer"]}>
                        <Home />
                    </ProtectedRoute>
                }
            />
            {/* Competitions listing page */}
            <Route
                path="/competitions"
                element={
                    <ProtectedRoute blockedRoles={["organizer"]}>
                        <Index />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/competition/:id"
                element={
                    <ProtectedRoute blockedRoles={["organizer"]}>
                        <Competition />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/community" 
                element={
                    <ProtectedRoute blockedRoles={["organizer"]}>
                        <Community />
                    </ProtectedRoute>
                } 
            />
            <Route path="/about" element={<About />} />
            <Route 
                path="/user/:id" 
                element={
                    <ProtectedRoute blockedRoles={["organizer"]}>
                        <UserDetails />
                    </ProtectedRoute>
                } 
            />

            {/* Auth routes - only accessible when NOT logged in */}
            <Route
                path="/login"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <Login />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/register/organizer"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <OrganizerRegister />
                    </ProtectedRoute>
                }
            />

            {/* Email verification routes - block when authenticated */}
            <Route
                path="/verify-email"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <EmailVerification />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/verify-email/:token"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <EmailVerification />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/resend-verification"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <ResendVerification />
                    </ProtectedRoute>
                }
            />

            {/* Password reset routes - block when authenticated */}
            <Route
                path="/forgot-password"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <ForgotPassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <ResetPassword />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reset-password/:token"
                element={
                    <ProtectedRoute authRedirectTo="/">
                        <ResetPassword />
                    </ProtectedRoute>
                }
            />

            {/* Unauthorized - public route to render full-screen message without navbar/footer */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes - require authentication */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/calendar"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <Calendar />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teams"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <Teams />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teams/:id"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <TeamDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-competitions"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <MyCompetitions />
                    </ProtectedRoute>
                }
            />

            {/* Organizer-only management routes */}
            <Route
                path="/organizer/competitions"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["organizer"]}>
                        <CompetitionManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["admin"]}>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer/reports"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["organizer"]}>
                        <Reports />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/analytics"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["admin"]}>
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            {/* Organizer routes */}
            <Route
                path="/organizer/billing"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["organizer"]}>
                        <OrganizerBilling />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer-profile"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["organizer", "admin"]}>
                        <OrganizerProfile />
                    </ProtectedRoute>
                }
            />

            {/* Backward-compatible redirects from old admin paths */}
            <Route path="/admin/competitions" element={<Navigate to="/organizer/competitions" replace />} />
            <Route path="/admin/reports" element={<Navigate to="/organizer/reports" replace />} />
            <Route path="/admin/billing" element={<Navigate to="/organizer/billing" replace />} />

            {/* Settings - protected */}
            <Route
                path="/settings"
                element={
                    <ProtectedRoute requireAuth blockedRoles={["organizer"]}>
                        <div className="container py-8">
                            <h1 className="text-2xl font-bold">
                                Cài đặt - Đang phát triển
                            </h1>
                            <p className="text-muted-foreground">
                                Tính năng này sẽ sớm được ra mắt!
                            </p>
                        </div>
                    </ProtectedRoute>
                }
            />

            {/* 404 route - redirect wildcard to dedicated /404 */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}

export default AppRouter;