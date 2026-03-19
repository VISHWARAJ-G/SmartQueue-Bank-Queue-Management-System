import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Snowflake, ClipboardCheck, UserPlus, Building2, Phone } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { useAdmin } from "@/context/AdminContext";

const cards = [
  { id: "slot-customize", name: "Slot Customization & Publish", icon: Settings, path: "/admin/slots" },
  { id: "slot-freeze", name: "Slot Freeze", icon: Snowflake, path: "/admin/freeze" },
  { id: "booking-check", name: "Booking Check", icon: ClipboardCheck, path: "/admin/booking-check" },
  { id: "walkin", name: "Walk-In Management", icon: UserPlus, path: "/admin/walkin" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminName, adminPhone, adminBank, adminBranchCode, adminBranchName, isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) { navigate("/staff-login"); return null; }

  return (
    <AdminShell showBack={false}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
        {/* Admin info */}
        <div className="bg-card p-5 rounded-lg shadow-card">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Staff Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground block">Name</span><span className="font-medium text-foreground">{adminName}</span></div>
            <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-medium text-foreground font-mono">{adminPhone}</span></div>
            <div className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-medium text-foreground">{adminBank}</span></div>
            <div><span className="text-muted-foreground block">Branch</span><span className="font-medium text-foreground">{adminBranchCode} – {adminBranchName}</span></div>
          </div>
        </div>

        {/* Action cards */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.button
                key={card.id}
                onClick={() => navigate(card.path)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-card p-6 rounded-lg shadow-card hover:shadow-card-hover transition-shadow flex items-center gap-4 text-left w-full"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-base font-semibold text-foreground">{card.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AdminShell>
  );
};

export default AdminDashboard;
