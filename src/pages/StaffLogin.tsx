import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BANKS, BRANCHES } from "@/data/bankData";
import { validateStaff } from "@/data/staffData";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "sonner";

const StaffLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();
  const [bank, setBank] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const branches = bank ? BRANCHES[bank] || [] : [];

  const handleLogin = () => {
    setError("");
    if (!bank || !branchCode || !phone) {
      setError("All fields are required.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    const staff = validateStaff(bank, branchCode, phone);
    if (!staff) {
      setError("Invalid credentials. Access denied.");
      return;
    }
    const branch = branches.find((b) => b.code === branchCode);
    loginAdmin({
      adminName: staff.name,
      adminPhone: staff.phone,
      adminBank: bank,
      adminBranchCode: branchCode,
      adminBranchName: branch?.name || "",
    });
    toast.success(`Welcome, ${staff.name}`);
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center shadow-card">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground text-base">SmartBank Queue</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-lg shadow-card p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Staff Login</h1>
              <p className="text-sm text-muted-foreground mt-1">Login with your branch credentials</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Bank Name</label>
                <Select value={bank} onValueChange={(v) => { setBank(v); setBranchCode(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                  <SelectContent>
                    {BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Branch Code</label>
                <Select value={branchCode} onValueChange={setBranchCode} disabled={!bank}>
                  <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => <SelectItem key={b.code} value={b.code}>{b.code} – {b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                />
              </div>

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <Button onClick={handleLogin} className="w-full" size="lg">
                Login
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default StaffLogin;
