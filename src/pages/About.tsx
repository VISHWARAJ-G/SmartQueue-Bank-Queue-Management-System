import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, Users, Lock } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const team = ["Hindhu G", "Lathika L J", "Santhosh T", "Vishwaraj G"];
const values = [
  { icon: Zap, label: "Fast", desc: "Instant slot booking with zero delays" },
  { icon: Users, label: "Inclusive", desc: "Works for every customer, with or without a smartphone" },
  { icon: Lock, label: "Secure", desc: "Bank-grade security for all transactions" },
];

const About = () => (
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

    <main className="flex-1 w-full max-w-[720px] mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Problem */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">What Problem We Solve</h1>
        <p className="text-muted-foreground leading-relaxed">
          Millions of Indians waste hours standing in Bank Queues everyday. Existing digital solutions works only for smartphone users — leaving elderly and rural customers. We built a system that gives every customers a fair, timed slot — with or without a smartphone.
        </p>
      </motion.section>

      {/* Mission */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="text-center py-8 bg-primary/5 rounded-xl">
        <h2 className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">Our Mission</h2>
        <p className="text-xl sm:text-2xl font-bold text-foreground">Zero Queue. Zero Wait. Every Bank. Every Customer.</p>
      </motion.section>

      {/* Team */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h2 className="text-xl font-bold text-foreground mb-6">Our Team</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {team.map((name) => (
            <div key={name} className="bg-card rounded-lg shadow-card p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-lg">{name[0]}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Values */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <h2 className="text-xl font-bold text-foreground mb-6">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {values.map((v) => (
            <div key={v.label} className="bg-card rounded-lg shadow-card p-5 text-center">
              <v.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{v.label}</h3>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </main>

    {/* Footer */}
    <footer className="border-t border-border py-6 text-center">
      <p className="text-sm text-muted-foreground">Serving every customer — with or without a smartphone</p>
    </footer>
  </div>
);

export default About;
