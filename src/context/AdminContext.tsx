import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface AdminState {
  adminName: string;
  adminPhone: string;
  adminBank: string;
  adminBranchCode: string;
  adminBranchName: string;
}

interface AdminContextType extends AdminState {
  isAdminLoggedIn: boolean;
  loginAdmin: (state: AdminState) => void;
  logoutAdmin: () => void;
}

const initial: AdminState = {
  adminName: "",
  adminPhone: "",
  adminBank: "",
  adminBranchCode: "",
  adminBranchName: "",
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AdminState>(initial);

  const loginAdmin = useCallback((s: AdminState) => setState(s), []);
  const logoutAdmin = useCallback(() => setState(initial), []);

  return (
    <AdminContext.Provider value={{ ...state, isAdminLoggedIn: !!state.adminName, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
