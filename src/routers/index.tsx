
import { Route, Routes } from "react-router-dom";
import Index from "../pages/Index";
import Profile from "../pages/Profile";
import Calendar from "../pages/Calendar";
import Competition from "../pages/Competition";
import Community from "../pages/Community";
import Teams from "../pages/Teams";
import CompetitionManagement from "../pages/CompetitionManagement";
import UserManagement from "../pages/UserManagement";
import Reports from "../pages/Reports";
import Analytics from "../pages/Analytics";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import UserDetails from "../pages/UserDetails";
import TeamDetails from "../pages/TeamDetails";
import MyCompetitions from "../pages/MyCompetitions";
import OrganizerBilling from "../pages/OrganizerBilling";
import OrganizerProfile from "../pages/OrganizerProfile";
import OrganizerRegister from "../pages/OrganizerRegister";
import About from "../pages/About";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import EmailVerification from "../pages/EmailVerification";
import ResendVerification from "../pages/ResendVerification";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const AppRouter = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/competition/:id" element={<Competition />} />
            <Route path="/community" element={<Community />} />
            <Route path="/about" element={<About />} />
            <Route path="/user/:id" element={<UserDetails />} />

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

            {/* Protected routes - require authentication */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute requireAuth>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/calendar"
                element={
                    <ProtectedRoute requireAuth>
                        <Calendar />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teams"
                element={
                    <ProtectedRoute requireAuth>
                        <Teams />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teams/:id"
                element={
                    <ProtectedRoute requireAuth>
                        <TeamDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-competitions"
                element={
                    <ProtectedRoute requireAuth>
                        <MyCompetitions />
                    </ProtectedRoute>
                }
            />

            {/* Admin only routes */}
            <Route
                path="/admin/competitions"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["admin"]}>
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
                path="/admin/reports"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["admin"]}>
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
                path="/admin/billing"
                element={
                    <ProtectedRoute requireAuth allowedRoles={["organizer", "admin"]}>
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

            {/* Settings - protected */}
            <Route
                path="/settings"
                element={
                    <ProtectedRoute requireAuth>
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

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRouter;