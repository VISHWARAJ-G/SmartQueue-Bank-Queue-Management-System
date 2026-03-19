import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageShell from "@/components/PageShell";
import { useAppState } from "@/context/AppContext";
import { USER_DB, FIXED_OTP } from "@/data/bankData";
import { toast } from "sonner";

const Authentication = () => {
  const navigate = useNavigate();
  const { setMobileNumber, setCustomerName } = useAppState();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = () => {
    setError("");
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    const name = USER_DB[mobile];
    if (!name) {
      setError("Mobile number not registered with this bank.");
      return;
    }
    setMobileNumber(mobile);
    setCustomerName(name);
    setOtpSent(true);
    toast.success("OTP sent to your registered mobile number.");
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    if (otp === FIXED_OTP) {
      toast.success("Authentication successful. Your session is now active.");
      navigate("/dashboard");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  return (
    <PageShell title={otpSent ? "OTP Verification" : "Account Verification"}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
        className="bg-card p-6 rounded-lg shadow-card"
      >
        {!otpSent ? (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Enter your registered mobile number to continue.
            </p>
            <div>
              <label htmlFor="mobile" className="text-sm font-medium text-foreground mb-1.5 block">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(e) => { setMobile(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="Enter 10-digit number"
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-base focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              OTP sent to your registered mobile number ending in ****{mobile.slice(-4)}.
            </p>
            <div>
              <label htmlFor="otp" className="text-sm font-medium text-foreground mb-1.5 block">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                placeholder="6-digit OTP"
                className="w-full h-12 px-4 rounded-lg border border-input bg-card text-foreground text-base font-mono tracking-[0.3em] text-center focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              {otpError && <p className="text-destructive text-sm mt-2">{otpError}</p>}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              Verify OTP
            </button>
            <button
              onClick={() => { setOtpSent(false); setOtp(""); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Change mobile number
            </button>
          </div>
        )}
      </motion.div>
    </PageShell>
  );
};

export default Authentication;
