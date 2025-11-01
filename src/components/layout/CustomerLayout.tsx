import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatUpdated from "../ChatUpdated";
import FeedbackLink from "./FeedbackLink";
import { useAppSelector } from "@/services/store/store";
import { isOrganizer, isAdmin } from "@/lib/roleUtils";

export default function CustomerLayout() {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const userIsOrganizer = isAuthenticated && isOrganizer(user);
    const userIsAdmin = isAuthenticated && isAdmin(user);
    const shouldShowChat = isAuthenticated && !userIsOrganizer && !userIsAdmin;
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background">
                <main>
                    <div className="container py-8">
                        <Outlet />
                    </div>
                </main>
                <FeedbackLink />
                {shouldShowChat && <ChatUpdated />}
            </div>
            <Footer />
        </>
    );
}


