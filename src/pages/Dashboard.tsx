import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, CreditCard, Wallet, Landmark, MoreHorizontal } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAppState } from "@/context/AppContext";

const cards = [
  { id: "booked-slots", name: "Booked Slots", icon: CalendarCheck, path: "/my-bookings" },
  { id: "account-services", name: "Account Services", icon: CreditCard, path: "/services/account-services" },
  { id: "loan-services", name: "Loan Services", icon: Wallet, path: "/services/loan-services" },
  { id: "cash-services", name: "Cash Services", icon: Landmark, path: "/services/cash-services" },
  { id: "other-services", name: "Other Services", icon: MoreHorizontal, path: "/services/other-services" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { customerName, selectedBank, selectedBranch, selectedBranchCode, mobileNumber } = useAppState();

  if (!customerName) {
    navigate("/");
    return null;
  }

  return (
    <PageShell showBack={false}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="flex flex-col gap-6"
      >
        {/* Context banner */}
        <div className="bg-card p-5 rounded-lg shadow-card">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Current Selection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block">Bank</span>
              <span className="font-medium text-foreground">{selectedBank}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Branch</span>
              <span className="font-medium text-foreground">{selectedBranchCode} – {selectedBranch}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Mobile</span>
              <span className="font-medium text-foreground font-mono tabular-nums">{mobileNumber}</span>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">What would you like to do?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <motion.button
                key={card.id}
                onClick={() => navigate(card.path)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
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
    </PageShell>
  );
};

export default Dashboard;
