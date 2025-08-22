import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRouter from "../routers";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { BalanceProvider } from "@/contexts/BalanceContext";

function App() {
  return (
    <BrowserRouter>
      <UserRoleProvider>
        <BalanceProvider>
          <AppRouter />
        </BalanceProvider>
      </UserRoleProvider>
    </BrowserRouter>
  );
}

export default App;
