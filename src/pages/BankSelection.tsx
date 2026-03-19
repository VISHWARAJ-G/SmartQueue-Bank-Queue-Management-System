import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Search } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAppState } from "@/context/AppContext";
import { BANKS } from "@/data/bankData";
import { Input } from "@/components/ui/input";

const BankSelection = () => {
  const navigate = useNavigate();
  const { setSelectedBank } = useAppState();
  const [search, setSearch] = useState("");

  const filtered = BANKS.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (bank: string) => {
    setSelectedBank(bank);
    navigate("/select-branch");
  };

  return (
    <PageShell title="Select Your Bank">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search banks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((bank, i) => (
          <motion.div
            key={bank}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
            whileHover={{ y: -2 }}
            className="bg-card p-6 rounded-lg shadow-card hover:shadow-card-hover transition-shadow flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground text-center">{bank}</h3>
            <button
              onClick={() => handleSelect(bank)}
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Select Bank
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">No banks found.</p>}
      </div>
    </PageShell>
  );
};

export default BankSelection;
