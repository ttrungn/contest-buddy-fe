import { createRoot } from "react-dom/client";
import "./apps/index.css";
import App from "./apps/App";
import { Provider } from "react-redux";
import { store, persistor } from "./services/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { UserRoleProvider } from "./contexts/UserRoleContext";
import { ChatProvider } from "./contexts/ChatContext";
import { BalanceProvider } from "./contexts/BalanceContext";

const container = document.getElementById("root");
const root = createRoot(container!);
const queryClient = new QueryClient();

root.render(
    <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <UserRoleProvider>
                    <ChatProvider>
                        <BalanceProvider>
                            <TooltipProvider>
                                <Toaster />
                                <Sonner />
                                <App />
                            </TooltipProvider>
                        </BalanceProvider>
                    </ChatProvider>
                </UserRoleProvider>
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);
