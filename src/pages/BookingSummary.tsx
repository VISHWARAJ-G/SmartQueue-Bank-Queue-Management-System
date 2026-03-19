import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, FileText } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useBookings } from "@/context/BookingContext";
import { useAppState } from "@/context/AppContext";

const BookingSummary = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const { customerName } = useAppState();

  const booking = bookings.find((b) => b.id === bookingId);

  useEffect(() => {
    if (!customerName) { navigate("/"); return; }
    if (!booking) { navigate("/dashboard"); return; }
    const timer = setTimeout(() => navigate("/my-bookings"), 5000);
    return () => clearTimeout(timer);
  }, [booking, customerName, navigate]);

  if (!booking) return null;

  return (
    <PageShell showBack={false}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            A confirmation message with booking code <span className="font-mono font-semibold text-foreground">{booking.bookingCode}</span> has been sent to your registered mobile number.
          </p>
        </div>

        <div className="bg-card w-full rounded-lg shadow-card p-5 space-y-3">
          <div className="text-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Booking Code</span>
            <div className="text-2xl font-bold font-mono text-primary mt-1">{booking.bookingCode}</div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground block">Category</span><span className="font-medium text-foreground">{booking.serviceCategory}</span></div>
            <div><span className="text-muted-foreground block">Service</span><span className="font-medium text-foreground">{booking.serviceName}</span></div>
            <div><span className="text-muted-foreground block">Branch</span><span className="font-medium text-foreground">{booking.branch}</span></div>
            <div><span className="text-muted-foreground block">Date</span><span className="font-medium text-foreground">{booking.date}</span></div>
            <div><span className="text-muted-foreground block">Time Slot</span><span className="font-medium text-foreground">{booking.timeSlot}</span></div>
            <div><span className="text-muted-foreground block">Duration</span><span className="font-medium text-foreground">{booking.duration} min</span></div>
          </div>

          <hr className="border-border" />

          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4" /> Documents Required
            </h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-0.5">
              {booking.documents.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Redirecting to My Bookings in a few seconds…</p>
      </motion.div>
    </PageShell>
  );
};

export default BookingSummary;
