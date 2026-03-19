import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Clock, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { SERVICE_CATEGORIES } from "@/data/serviceData";

const ServicesInfo = () => (
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
      </nav>
    </header>

    <main className="flex-1 w-full max-w-[720px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Our Services</h1>
        <p className="text-muted-foreground mb-8">Browse all banking services available for appointment booking.</p>
      </motion.div>

      {SERVICE_CATEGORIES.map((cat, ci) => (
        <motion.section
          key={cat.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: ci * 0.08 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-4">{cat.name}</h2>
          <div className="flex flex-col gap-3">
            {cat.services.map((s) => (
              <div key={s.id} className="bg-card rounded-lg shadow-card p-5">
                <h3 className="font-semibold text-foreground">{s.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.duration} min</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{s.documents.length} docs required</span>
                </div>
                <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                  {s.documents.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>
      ))}
    </main>

    <footer className="border-t border-border py-6 text-center">
      <p className="text-sm text-muted-foreground">Serving every customer — with or without a smartphone</p>
    </footer>
  </div>
);

export default ServicesInfo;
