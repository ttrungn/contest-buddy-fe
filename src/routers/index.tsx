
import { Route, Routes, Navigate } from "react-router-dom";
import { useAppSelector } from "@/services/store/store";
import { isAdmin, isOrganizer, isCustomer } from "@/lib/roleUtils";
import Home from "../pages/Home";
import Index from "../pages/Index";
import Competition from "../pages/competition/Competition";
import Community from "../pages/user/Community";
import UserDetails from "../pages/user/UserDetails";
import Profile from "../pages/user/Profile";
import Calendar from "../pages/user/Calendar";
import Settings from "../pages/user/Settings";
import Teams from "../pages/competition/Teams";
import TeamDetails from "../pages/competition/TeamDetails";
import MyCompetitions from "../pages/competition/MyCompetitions";
import OrganizerRegister from "../pages/organizer/OrganizerRegister";
import OrganizerProfile from "../pages/organizer/OrganizerProfile";
import CompetitionManagement from "../pages/organizer/CompetitionManagement";
import OrganizerBilling from "../pages/organizer/OrganizerBilling";
import Reports from "../pages/organizer/Reports";
import Analytics from "../pages/organizer/Analytics";
import { PlanManagement } from "../pages/admin";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import EmailVerification from "../pages/auth/EmailVerification";
import ResendVerification from "../pages/auth/ResendVerification";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Unauthorized from "../pages/auth/Unauthorized";
import NotFound from "../pages/NotFound";
import { PaymentCancel, PaymentSuccess } from "../pages/payment";
import PaymentHistory from "../pages/payment/PaymentHistory";
import PaymentDetail from "../pages/payment/PaymentDetail";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import GuestLayout from "../components/layout/GuestLayout";
import CustomerLayout from "../components/layout/CustomerLayout";

const AppRouter = () => {
    const InitialRedirect = () => {
        const { isAuthenticated, user, needsVerification } = useAppSelector((s) => s.auth);
        if (!isAuthenticated) {
            return <Navigate to="/home" replace />;
        }
        if (isCustomer(user) && needsVerification) {
            return <Navigate to="/verify-email" replace />;
        }
        if (isAdmin(user)) {
            return <Navigate to="/admin/analytics" replace />;
        }
        if (isOrganizer(user)) {
            return <Navigate to="/organizer/competitions" replace />;
        }
        return <Navigate to="/home" replace />;
    };
    return (
        <Routes>
            <Route path="/" element={<InitialRedirect />} />

            {/* Auth routes (no site chrome) */}
            <Route path="/login" element={<ProtectedRoute authRedirectTo="/"><Login /></ProtectedRoute>} />
            <Route path="/register/organizer" element={<ProtectedRoute authRedirectTo="/"><OrganizerRegister /></ProtectedRoute>} />
            <Route path="/verify-email" element={<ProtectedRoute authRedirectTo="/"><EmailVerification /></ProtectedRoute>} />
            <Route path="/verify-email/:token" element={<ProtectedRoute authRedirectTo="/"><EmailVerification /></ProtectedRoute>} />
            <Route path="/resend-verification" element={<ProtectedRoute authRedirectTo="/"><ResendVerification /></ProtectedRoute>} />
            <Route path="/forgot-password" element={<ProtectedRoute authRedirectTo="/"><ForgotPassword /></ProtectedRoute>} />
            <Route path="/reset-password" element={<ProtectedRoute authRedirectTo="/"><ResetPassword /></ProtectedRoute>} />
            <Route path="/reset-password/:token" element={<ProtectedRoute authRedirectTo="/"><ResetPassword /></ProtectedRoute>} />

            {/* Payment callback routes (no site chrome) */}
            <Route path="/payment/return" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            {/* Public & guest routes (with site chrome) */}
            <Route element={<GuestLayout />}>
                <Route path="/about" element={<About />} />

                {/* Public consumer pages (block organizer) */}
                <Route path="/home" element={<ProtectedRoute blockedRoles={["organizer"]}><Home /></ProtectedRoute>} />
                <Route path="/competitions" element={<ProtectedRoute blockedRoles={["organizer"]}><Index /></ProtectedRoute>} />
                <Route path="/competition/:id" element={<ProtectedRoute blockedRoles={["organizer"]}><Competition /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute blockedRoles={["organizer"]}><Community /></ProtectedRoute>} />
                <Route path="/user/:id" element={<ProtectedRoute blockedRoles={["organizer"]}><UserDetails /></ProtectedRoute>} />
            </Route>

            {/* Customer area */}
            <Route element={<ProtectedRoute requireAuth allowedRoles={["customer"]}><CustomerLayout /></ProtectedRoute>}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/teams/:id" element={<TeamDetails />} />
                <Route path="/my-competitions" element={<MyCompetitions />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Organizer area */}
            <Route element={<ProtectedRoute requireAuth allowedRoles={["organizer"]}><CustomerLayout /></ProtectedRoute>}>
                <Route path="/organizer/competitions" element={<CompetitionManagement />} />
                <Route path="/organizer/reports" element={<Reports />} />
                <Route path="/organizer/billing" element={<OrganizerBilling />} />
                <Route path="/organizer/payment-history" element={<PaymentHistory />} />
                <Route path="/organizer/payment-history/:orderId" element={<PaymentDetail />} />
                <Route path="/organizer-profile" element={<OrganizerProfile />} />
            </Route>

            {/* Admin area */}
            <Route element={<ProtectedRoute requireAuth allowedRoles={["admin"]}><CustomerLayout /></ProtectedRoute>}>
                <Route path="/admin/users" element={<Analytics />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/plans" element={<PlanManagement />} />
                <Route path="/admin/competitions" element={<Navigate to="/organizer/competitions" replace />} />
                <Route path="/admin/reports" element={<Navigate to="/organizer/reports" replace />} />
                <Route path="/admin/billing" element={<Navigate to="/organizer/billing" replace />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}

export default AppRouter;