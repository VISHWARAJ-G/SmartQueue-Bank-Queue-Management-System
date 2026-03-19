import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Globe } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useAppState } from "@/context/AppContext";
import { useBookings, Booking } from "@/context/BookingContext";
import { getServiceById } from "@/data/serviceData";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ONLINE_ELIGIBLE = ["kyc-update", "mobile-update", "address-change"];

const generateBookingCode = () =>
  "BK" + Math.floor(100000 + Math.random() * 900000);

const SlotBooking = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { customerName, selectedBranch, selectedBranchCode } = useAppState();
  const {
    addBooking,
    getFilledSlots,
    hasActiveBookingForService,
    hasTimeConflict,
    bookings,
    getSlotConfig,
    isSlotFrozen,
  } = useBookings();

  const [date, setDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onlineOpen, setOnlineOpen] = useState(() =>
    ONLINE_ELIGIBLE.includes(serviceId || ""),
  );

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";

  const config = getSlotConfig(selectedBranchCode, dateStr);

  if (!customerName) {
    navigate("/");
    return null;
  }

  const service = getServiceById(serviceId || "");
  if (!service) {
    navigate("/dashboard");
    return null;
  }

  // Check if service is disabled by admin
  if (config.serviceAvailability[service.id] === false) {
    return (
      <PageShell title="Book a Slot">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">
            This service is currently unavailable at this branch.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </PageShell>
    );
  }

  if (hasActiveBookingForService(service.id)) {
    return (
      <PageShell title="Book a Slot">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">
            You have already booked this service. Multiple bookings are not
            allowed.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </PageShell>
    );
  }

  const handleSlotSelect = (slot: string) => {
    if (hasTimeConflict(dateStr, slot, selectedBranchCode)) {
      toast.error(
        "You already have another appointment during this time. Please choose a different time slot.",
      );
      return;
    }
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!date || !selectedSlot) return;
    const booking: Booking = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      branch: selectedBranch,
      branchCode: selectedBranchCode,
      date: dateStr,
      timeSlot: selectedSlot,
      duration: service.duration,
      documents: service.documents,
      bookingCode: generateBookingCode(),
      status: "Confirmed",
      checkInStatus: "upcoming",
      createdAt: Date.now(),
    };
    addBooking(booking);
    setConfirmOpen(false);
    navigate(`/booking-summary/${booking.id}`);
  };

  return (
    <PageShell title="Book a Slot">
      <Dialog open={onlineOpen} onOpenChange={setOnlineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Online Service
              Available
            </DialogTitle>
            <DialogDescription>
              This service can be completed faster using online banking. You may
              proceed online or continue to book an in-branch appointment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOnlineOpen(false)}>
              Go to Online Service
            </Button>
            <Button onClick={() => setOnlineOpen(false)}>
              Continue Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-card p-5 rounded-lg shadow-card space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            {service.name}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {service.duration} Minutes
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {selectedBranchCode} – {selectedBranch}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Date
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
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setSelectedSlot(null);
                }}
                disabled={(d) => d < new Date(new Date().toDateString())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {date && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Available Slots – {format(date, "dd MMM yyyy")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {config.timeSlots.map((slot) => {
                const frozen = isSlotFrozen(dateStr, slot, selectedBranchCode);
                const filled = getFilledSlots(
                  dateStr,
                  slot,
                  selectedBranchCode,
                );
                const remaining = config.capacity - filled;
                const capacityFull = remaining <= 0;
                const sameServiceConflict = bookings.some(
                  (b) =>
                    b.status === "Confirmed" &&
                    b.serviceId === service.id &&
                    b.date === dateStr &&
                    b.timeSlot === slot &&
                    b.branchCode === selectedBranchCode,
                );
                const otherServiceConflict =
                  !sameServiceConflict &&
                  hasTimeConflict(dateStr, slot, selectedBranchCode);
                const conflicted = sameServiceConflict || otherServiceConflict;
                const disabled = capacityFull || conflicted || frozen;
                const selected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    disabled={disabled}
                    onClick={() => handleSlotSelect(slot)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      disabled && "opacity-50 cursor-not-allowed bg-muted",
                      selected &&
                        !disabled &&
                        "border-primary bg-primary/5 ring-2 ring-primary/20",
                      !selected &&
                        !disabled &&
                        "bg-card shadow-card hover:shadow-card-hover cursor-pointer",
                    )}
                  >
                    <div className="font-semibold text-foreground text-sm">
                      {slot}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {frozen ? (
                        <span className="text-blue-600 font-medium">
                          SLOT FREEZED
                        </span>
                      ) : sameServiceConflict ? (
                        <span className="text-destructive font-medium">
                          Already Booked (This Service)
                        </span>
                      ) : otherServiceConflict ? (
                        <span className="text-destructive font-medium">
                          Already Booked (Other Service)
                        </span>
                      ) : (
                        <>
                          {filled} / {config.capacity} filled ·{" "}
                          <span
                            className={cn(
                              remaining <= 3 && remaining > 0
                                ? "text-destructive font-medium"
                                : "",
                            )}
                          >
                            {remaining} remaining
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedSlot && (
          <Button
            onClick={() => setConfirmOpen(true)}
            className="w-full"
            size="lg"
          >
            Book Now
          </Button>
        )}

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Booking</DialogTitle>
              <DialogDescription>
                Please confirm your appointment booking.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm py-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">
                  {service.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch</span>
                <span className="font-medium text-foreground">
                  {selectedBranch}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">
                  {date && format(date, "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-medium text-foreground">
                  {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">
                  {service.duration} Minutes
                </span>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </PageShell>
  );
};

export default SlotBooking;
