import { createContext, useContext, useState, ReactNode } from "react";

type UserRole = "participant" | "admin";

interface UserRoleContextType {
  userRole: UserRole;
  toggleUserRole: () => void;
  isAdmin: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("participant");

  const toggleUserRole = () => {
    setUserRole(prev => prev === "participant" ? "admin" : "participant");
  };

  const isAdmin = userRole === "admin";

  return (
    <UserRoleContext.Provider value={{ userRole, toggleUserRole, isAdmin }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
} 