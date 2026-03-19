import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import AdminShell from "@/components/AdminShell";
import { useAdmin } from "@/context/AdminContext";
import { useBookings, CheckInStatus } from "@/context/BookingContext";
import { ALL_SERVICES } from "@/data/serviceData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getAutoStatus = (booking: {
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

const BookingCheck = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminBranchCode } = useAdmin();
  const { bookings, checkIn, getSlotConfig } = useBookings();

  const [serviceId, setServiceId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [date, setDate] = useState<Date>();
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});

  const selectedDate = date ? format(date, "yyyy-MM-dd") : "";
  const config = getSlotConfig(adminBranchCode, selectedDate);

  const filtered = useMemo(() => {
    if (!serviceId || !timeSlot || !selectedDate) return [];
    return bookings.filter(
      (b) =>
        b.branchCode === adminBranchCode &&
        b.serviceId === serviceId &&
        b.timeSlot === timeSlot &&
        b.date === selectedDate &&
        b.status === "Confirmed",
    );
  }, [bookings, adminBranchCode, serviceId, timeSlot, selectedDate]);

  const isSlotExpired = useMemo(() => {
    if (!timeSlot || !selectedDate) return false;
    const endTime = timeSlot.split("–")[1]?.trim();
    if (!endTime) return false;
    const [eh, em] = endTime.split(":").map(Number);
    const slotEnd = new Date(selectedDate);
    slotEnd.setHours(eh, em, 0, 0);
    return Date.now() > slotEnd.getTime();
  }, [timeSlot, selectedDate]);

  if (!isAdminLoggedIn) {
    navigate("/staff-login");
    return null;
  }

  const handleVerify = (bookingId: string, expectedCode: string) => {
    const entered = codeInputs[bookingId] || "";
    if (entered.toUpperCase() === expectedCode.toUpperCase()) {
      checkIn(bookingId);
      toast.success("Customer checked in successfully.");
    } else {
      toast.error("Invalid booking code.");
    }
  };

  return (
    <AdminShell title="Booking Check">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-card p-5 rounded-lg shadow-card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" /> Select Service &
            Slot
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Service
              </label>
              <Select
                value={serviceId}
                onValueChange={(v) => {
                  setServiceId(v);
                  setTimeSlot("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_SERVICES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Time Slot
              </label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select slot" />
                </SelectTrigger>
                <SelectContent>
                  {config.timeSlots.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {serviceId && timeSlot && selectedDate && (
          <div className="space-y-3">
            {isSlotExpired && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive font-medium">
                This slot has expired. Remaining users will be marked as Absent.
              </div>
            )}
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No bookings found for this selection.
              </p>
            ) : (
              filtered.map((b, i) => {
                const status = getAutoStatus(b);
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-card rounded-lg shadow-card p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium text-foreground text-sm">
                          {b.isWalkIn ? b.walkInName : b.bookingCode}
                        </span>
                        {b.isWalkIn && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (Walk-In)
                          </span>
                        )}
                      </div>
                      <div>
                        {status === "checked-in" && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-600 font-medium border border-green-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Checked In
                          </span>
                        )}
                        {status === "absent" && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive font-medium border border-destructive/30">
                            <AlertTriangle className="w-3 h-3" /> Absent
                          </span>
                        )}
                        {status === "upcoming" && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-muted-foreground/30 text-muted-foreground">
                            <Clock className="w-3 h-3" /> Upcoming
                          </span>
                        )}
                        {status === "ready" && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border-2 border-primary text-primary font-medium">
                            Ready
                          </span>
                        )}
                      </div>
                    </div>

                    {status !== "checked-in" && status !== "absent" && (
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Enter booking code"
                          value={codeInputs[b.id] || ""}
                          onChange={(e) =>
                            setCodeInputs((prev) => ({
                              ...prev,
                              [b.id]: e.target.value,
                            }))
                          }
                          className="flex-1"
                          disabled={isSlotExpired}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleVerify(b.id, b.bookingCode)}
                          disabled={isSlotExpired}
                        >
                          Verify
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </motion.div>
    </AdminShell>
  );
};

export default BookingCheck;
