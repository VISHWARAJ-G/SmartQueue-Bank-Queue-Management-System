import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, UserCog } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shadow-card">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground text-base">SmartBank Queue</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-primary/10 text-primary">Home</NavLink>
          <NavLink to="/about" className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-primary/10 text-primary">About Us</NavLink>
          <NavLink to="/services-info" className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" activeClassName="bg-primary/10 text-primary">Services</NavLink>
          <Button variant="outline" size="sm" onClick={() => navigate("/staff-login")} className="ml-2">
            <UserCog className="w-4 h-4 mr-1" /> Staff Login
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-[32px] font-bold text-foreground">SmartBank Queue</h1>
              <p className="text-muted-foreground mt-2 text-base max-w-md">
                Book your bank visit in advance and skip the queue.
              </p>
            </div>
            <button
              onClick={() => navigate("/select-bank")}
              className="w-full max-w-sm h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity mt-4"
            >
              Book Appointment
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
