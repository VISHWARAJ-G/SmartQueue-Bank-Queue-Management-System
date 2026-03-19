import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { useBookings, CheckInStatus } from "@/context/BookingContext";
import { useAppState } from "@/context/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const INITIAL_SHOW = 5;

const canCancel = (booking: {
  date: string;
  timeSlot: string;
  status: string;
}) => {
  if (booking.status === "Cancelled") return false;
  const startTime = booking.timeSlot.split("–")[0].trim();
  const [h, m] = startTime.split(":").map(Number);
  const slotDate = new Date(booking.date);
  slotDate.setHours(h, m, 0, 0);
  return slotDate.getTime() - Date.now() > 60 * 60 * 1000;
};

const getAutoCheckInStatus = (booking: {
  date: string;
  timeSlot: string;
  checkInStatus: CheckInStatus;
  status: string;
}): CheckInStatus => {
  if (booking.status === "Cancelled") return booking.checkInStatus;
  if (booking.checkInStatus === "checked-in") return "checked-in";
  const startTime = booking.timeSlot.split("–")[0].trim();
  const endTime = booking.timeSlot.split("–")[1].trim();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const now = Date.now();
  const slotStart = new Date(booking.date);
  slotStart.setHours(sh, sm, 0, 0);
  const slotEnd = new Date(booking.date);
  slotEnd.setHours(eh, em, 0, 0);
  if (now > slotEnd.getTime()) return "absent";
  if (now >= slotStart.getTime()) return "ready";
  return "upcoming";
};

const checkInBadge = (status: CheckInStatus) => {
  switch (status) {
    case "upcoming":
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground">
          <Clock className="w-3 h-3" /> Upcoming
        </span>
      );
    case "ready":
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border-2 border-primary text-primary font-medium">
          <UserCheck className="w-3 h-3" /> Ready for Check-In
        </span>
      );
    case "checked-in":
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-600 font-medium border border-green-500/30">
          <CheckCircle2 className="w-3 h-3" /> Checked In
        </span>
      );
    case "absent":
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive font-medium border border-destructive/30">
          <AlertTriangle className="w-3 h-3" /> Absent
        </span>
      );
  }
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { customerName } = useAppState();
  const { bookings, cancelBooking, checkIn } = useBookings();
  const [showAll, setShowAll] = useState(false);

  if (!customerName) {
    navigate("/");
    return null;
  }

  const visible = showAll ? bookings : bookings.slice(0, INITIAL_SHOW);

  return (
    <PageShell title="My Bookings">
      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No bookings yet.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((b, i) => {
            const ciStatus = getAutoCheckInStatus(b);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="bg-card rounded-lg shadow-card p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {b.serviceName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {b.serviceCategory}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge
                      variant={
                        b.status === "Confirmed" ? "default" : "destructive"
                      }
                      className="shrink-0"
                    >
                      {b.status}
                    </Badge>
                    {b.status === "Confirmed" && checkInBadge(ciStatus)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Branch:</span>{" "}
                    <span className="font-medium text-foreground">
                      {b.branchCode} – {b.branch}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    <span className="font-medium text-foreground">
                      {b.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time:</span>{" "}
                    <span className="font-medium text-foreground">
                      {b.timeSlot}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Code:</span>{" "}
                    <span className="font-mono font-semibold text-primary">
                      {b.bookingCode}
                    </span>
                  </div>
                </div>

                {/* Documents */}
                <details className="group">
                  <summary className="text-sm font-medium text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                    <FileText className="w-4 h-4 text-muted-foreground" />{" "}
                    Required Documents
                  </summary>
                  <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-5">
                    {b.documents.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </details>

                <details className="group mt-2">
                  <summary className="text-sm font-medium text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                    <FileText className="w-4 h-4 text-muted-foreground" />{" "}
                    Instructions
                  </summary>
                  <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-0.5 pl-5">
                    <li>
                      Please arrive at least 5 minutes before your scheduled
                      time.
                    </li>
                    <li>
                      If your slot is expired, meet the bank officials for
                      further assistance.
                    </li>
                  </ul>
                </details>

                {/* Actions */}
                {b.status === "Confirmed" && (
                  <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                    {/* Simulate Check-In */}
                    {ciStatus !== "checked-in" && ciStatus !== "absent" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => checkIn(b.id)}
                        className="text-green-600 border-green-500/30 hover:bg-green-500/10"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Simulate
                        Check-In
                      </Button>
                    )}
                    {/* Cancel */}
                    <div className="ml-auto">
                      {canCancel(b) &&
                      ciStatus !== "checked-in" &&
                      ciStatus !== "absent" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Cancel
                              Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Cancel Booking?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will cancel your appointment for{" "}
                                {b.serviceName} on {b.date} at {b.timeSlot}.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Keep Booking
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => cancelBooking(b.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Cancel Booking
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {ciStatus === "checked-in"
                            ? "Already checked in — Thank you for visiting our branch"
                            : "Cannot cancel within 1 hour of appointment"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {bookings.length > INITIAL_SHOW && (
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="mx-auto"
            >
              {showAll ? "Show Less" : "Show More History"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mx-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </PageShell>
  );
};

export default MyBookings;
