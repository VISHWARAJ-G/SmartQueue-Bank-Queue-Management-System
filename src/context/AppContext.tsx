import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  selectedBank: string;
  selectedBranch: string;
  selectedBranchCode: string;
  mobileNumber: string;
  customerName: string;
}

interface AppContextType extends AppState {
  setSelectedBank: (bank: string) => void;
  setSelectedBranch: (branch: string) => void;
  setSelectedBranchCode: (code: string) => void;
  setMobileNumber: (number: string) => void;
  setCustomerName: (name: string) => void;
  reset: () => void;
}

const initial: AppState = {
  selectedBank: "",
  selectedBranch: "",
  selectedBranchCode: "",
  mobileNumber: "",
  customerName: "",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(initial);

  const set = (key: keyof AppState) => (value: string) =>
    setState((prev) => ({ ...prev, [key]: value }));

  return (
    <AppContext.Provider
      value={{
        ...state,
        setSelectedBank: set("selectedBank"),
        setSelectedBranch: set("selectedBranch"),
        setSelectedBranchCode: set("selectedBranchCode"),
        setMobileNumber: set("mobileNumber"),
        setCustomerName: set("customerName"),
        reset: () => setState(initial),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};
