import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Shield } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const AdminShell = ({ children, title, showBack = true }: { children: ReactNode; title?: string; showBack?: boolean }) => {
  const navigate = useNavigate();
  const { adminName, logoutAdmin } = useAdmin();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shadow-card">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors" aria-label="Go back">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground text-base">SmartBank Queue</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Welcome,</span>
          <span className="text-sm font-semibold text-foreground max-w-[120px] sm:max-w-none truncate">{adminName}</span>
          <button onClick={handleLogout} className="ml-2 p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive" aria-label="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[800px] mx-auto px-4 sm:px-6 py-8">
        {title && <h1 className="text-2xl sm:text-[32px] font-bold text-foreground mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default AdminShell;
