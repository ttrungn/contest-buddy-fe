import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../services/store/store";
import { UserRoleProvider } from "../contexts/UserRoleContext";
import { ChatProvider } from "../contexts/ChatContext";
import { BalanceProvider } from "../contexts/BalanceContext";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import Footer from "../components/Footer";
import AppRouter from "../routers";

const queryClient = new QueryClient();

// Layout wrapper component to conditionally show navbar/footer
const LayoutWrapper = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    // Full screen layout for auth pages
    return <AppRouter />;
  }

  // Normal layout with navbar and footer
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <main>
          <div className="container py-8">
            <AppRouter />
          </div>
        </main>
        <Chat />
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <UserRoleProvider>
            <ChatProvider>
              <BalanceProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <LayoutWrapper />
                  </BrowserRouter>
                </TooltipProvider>
              </BalanceProvider>
            </ChatProvider>
          </UserRoleProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
