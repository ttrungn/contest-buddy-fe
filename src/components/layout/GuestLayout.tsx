import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatUpdated from "../ChatUpdated";
import FeedbackLink from "./FeedbackLink";
import { useAppSelector } from "@/services/store/store";
import { isOrganizer } from "@/lib/roleUtils";

export default function GuestLayout() {
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);
    const userIsOrganizer = isAuthenticated && isOrganizer(user);
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
                {isAuthenticated && !userIsOrganizer && <ChatUpdated />}
            </div>
            <Footer />
        </>
    );
}


