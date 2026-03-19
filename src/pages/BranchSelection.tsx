import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAppState } from "@/context/AppContext";
import { BRANCHES } from "@/data/bankData";
import { Input } from "@/components/ui/input";

const BranchSelection = () => {
  const navigate = useNavigate();
  const { selectedBank, setSelectedBranch, setSelectedBranchCode } = useAppState();
  const branches = BRANCHES[selectedBank] || [];
  const [search, setSearch] = useState("");

  const filtered = branches.filter(
    (b) => b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (branch: { code: string; name: string }) => {
    setSelectedBranch(branch.name);
    setSelectedBranchCode(branch.code);
    navigate("/authenticate");
  };

  if (!selectedBank) {
    navigate("/select-bank");
    return null;
  }

  return (
    <PageShell title="Select Your Branch">
      <p className="text-muted-foreground mb-4">{selectedBank}</p>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by branch name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((branch, i) => (
          <motion.div
            key={branch.code}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0.2, 0, 0, 1] }}
            whileHover={{ y: -1 }}
            className="bg-card p-5 rounded-lg shadow-card hover:shadow-card-hover transition-shadow flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <span className="text-xs font-mono text-muted-foreground tabular-nums uppercase tracking-wider">
                {branch.code}
              </span>
              <h3 className="font-semibold text-foreground mt-1 text-base">{branch.name}</h3>
            </div>
            <button
              onClick={() => handleSelect(branch)}
              className="shrink-0 h-10 px-5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Select
            </button>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">No branches found.</p>}
      </div>
    </PageShell>
  );
};

export default BranchSelection;
