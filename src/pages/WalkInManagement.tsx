import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { useAdmin } from "@/context/AdminContext";
import { useBookings, Booking } from "@/context/BookingContext";
import { ALL_SERVICES, getServiceById } from "@/data/serviceData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const generateBookingCode = () =>
  "BK" + Math.floor(100000 + Math.random() * 900000);

const WalkInManagement = () => {
  const {
    addBooking,
    getSlotConfig,
    getWalkInRemaining,
    bookings,
    walkInPool,
  } = useBookings();
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminBranchCode, adminBranchName } = useAdmin();

  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const config = getSlotConfig(adminBranchCode, today);

  if (!isAdminLoggedIn) {
    navigate("/staff-login");
    return null;
  }

  const handleSubmit = () => {
    setError("");

    if (!name.trim() || !serviceId || !timeSlot) {
      setError("All fields are required.");
      return;
    }

    const service = getServiceById(serviceId);
    if (!service) {
      setError("Invalid service selected.");
      return;
    }

    const remainingWalkIn = getWalkInRemaining(
      adminBranchCode,
      serviceId,
      today,
      timeSlot,
    );

    if (remainingWalkIn <= 0) {
      setError("Walk-in limit reached");
      return;
    }

    const booking: Booking = {
      id: crypto.randomUUID(),
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      branch: adminBranchName,
      branchCode: adminBranchCode,
      date: today,
      timeSlot,
      duration: service.duration,
      documents: service.documents,
      bookingCode: generateBookingCode(),
      status: "Confirmed",
      checkInStatus: "upcoming",
      createdAt: Date.now(),
      isWalkIn: true,
      walkInName: name.trim(),
    };

    addBooking(booking);

    toast.success("Walk-in booking created successfully.");
    setName("");
    setServiceId("");
    setTimeSlot("");
  };
  const remainingWalkIn = getWalkInRemaining(
    adminBranchCode,
    serviceId,
    today,
    timeSlot,
  );

  const totalAllowed =
    (config.walkInCapacity !== undefined ? config.walkInCapacity : 6) +
    (walkInPool[`${adminBranchCode}|${today}|${timeSlot}`] || 0);

  const walkInCount = totalAllowed - remainingWalkIn;

  return (
    <AdminShell title="Walk-In Management">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-card p-5 rounded-lg shadow-card space-y-2">
          <p className="text-sm text-muted-foreground">
            Register walk-in customers. Walk-in bookings are created for today's
            date ({today}) at your branch ({adminBranchCode} – {adminBranchName}
            ).
          </p>
        </div>

        <div className="bg-card p-5 rounded-lg shadow-card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" /> New Walk-In Entry
          </h3>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Customer Name
            </label>
            <Input
              placeholder="Enter customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Service
            </label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {ALL_SERVICES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Time Slot
            </label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
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

          {serviceId && timeSlot && (
            <p className="text-xs text-muted-foreground">
              Walk-in: {walkInCount} / {totalAllowed} · Remaining:{" "}
              {remainingWalkIn}
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Create Walk-In Booking
          </Button>
        </div>
      </motion.div>
    </AdminShell>
  );
};

export default WalkInManagement;
