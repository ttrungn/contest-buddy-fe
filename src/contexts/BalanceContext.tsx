import { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  balance: number;
  updateBalance: (amount: number) => void;
  deductBalance: (amount: number) => void;
  addBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(60000000);

  const updateBalance = (amount: number) => {
    setBalance(amount);
  };

  const deductBalance = (amount: number) => {
    setBalance(prev => Math.max(0, prev - amount));
  };

  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, updateBalance, deductBalance, addBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
} 