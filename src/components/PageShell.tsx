import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, HelpCircle, LogOut, Shield } from "lucide-react";
import { useAppState } from "@/context/AppContext";

const PageShell = ({ children, title, showBack = true }: { children: ReactNode; title?: string; showBack?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerName, reset } = useAppState();
  const isLanding = location.pathname === "/";
  const isPublicPage = ["/", "/about", "/services-info"].includes(location.pathname);
  const isLoggedIn = !!customerName;

  const handleLogout = () => {
    reset();
    navigate("/");
  };

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shadow-card">
        <div className="flex items-center gap-3">
          {showBack && !isLanding && !isPublicPage && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-md hover:bg-muted transition-colors" aria-label="Go back">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <button onClick={handleLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground text-base">SmartBank Queue</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome,</span>
              <span className="text-sm font-semibold text-foreground max-w-[120px] sm:max-w-none truncate">{customerName}</span>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
          {!isLoggedIn && !isPublicPage && (
            <button className="p-2 -mr-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-[640px] mx-auto px-4 sm:px-6 py-8">
        {title && <h1 className="text-2xl sm:text-[32px] font-bold text-foreground mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default PageShell;
