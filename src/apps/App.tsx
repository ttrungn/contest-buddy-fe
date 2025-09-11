import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { UserRoleProvider } from "../contexts/UserRoleContext";
import { ChatProvider } from "../contexts/ChatContext";
import { BalanceProvider } from "../contexts/BalanceContext";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import Footer from "../components/Footer";
import AppRouter from "../routers";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserRoleProvider>
        <ChatProvider>
          <BalanceProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
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
              </BrowserRouter>
            </TooltipProvider>
          </BalanceProvider>
        </ChatProvider>
      </UserRoleProvider>
    </QueryClientProvider>
  );
};

export default App;
