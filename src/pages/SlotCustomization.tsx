import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2 } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { useAdmin } from "@/context/AdminContext";
import { useBookings, SlotConfig } from "@/context/BookingContext";
import { ALL_SERVICES } from "@/data/serviceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useEffect } from "react";

const SlotCustomization = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminBranchCode } = useAdmin();
  const { getSlotConfig, publishSlotConfig } = useBookings();

  if (!isAdminLoggedIn) {
    navigate("/staff-login");
    return null;
  }

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const existing = getSlotConfig(adminBranchCode, selectedDate);

    setTimeSlots([...existing.timeSlots]);
    setCapacity(existing.capacity);
    setWalkInCapacity(existing.walkInCapacity);

    const init: Record<string, boolean> = {};
    ALL_SERVICES.forEach((s) => {
      init[s.id] = existing.serviceAvailability[s.id] !== false;
    });

    setServiceAvail(init);
  }, [selectedDate]);

  const existing = getSlotConfig(adminBranchCode, selectedDate);

  const [timeSlots, setTimeSlots] = useState<string[]>([...existing.timeSlots]);
  const [capacity, setCapacity] = useState(existing.capacity);
  const [walkInCapacity, setWalkInCapacity] = useState(existing.walkInCapacity);
  const [serviceAvail, setServiceAvail] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      ALL_SERVICES.forEach((s) => {
        init[s.id] = existing.serviceAvailability[s.id] !== false;
      });
      return init;
    },
  );
  const [newSlot, setNewSlot] = useState("");

  const addTimeSlot = () => {
    const trimmed = newSlot.trim();
    if (!trimmed) return;
    if (timeSlots.includes(trimmed)) {
      toast.error("Slot already exists");
      return;
    }
    setTimeSlots((prev) => [...prev, trimmed]);
    setNewSlot("");
  };

  const removeTimeSlot = (slot: string) =>
    setTimeSlots((prev) => prev.filter((s) => s !== slot));

  const handlePublish = () => {
    const config: SlotConfig = {
      timeSlots,
      capacity,
      serviceAvailability: serviceAvail,
      walkInCapacity,
    };
    publishSlotConfig(adminBranchCode, selectedDate, config);
    toast.success(
      "Slot configuration published successfully. Users will see updated slots.",
    );
  };

  return (
    <AdminShell title="Slot Customization & Publish">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        {/* Time Slots */}
        <div className="bg-card p-5 rounded-lg shadow-card">
          <label className="text-sm font-medium">Select Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 w-60"
          />
        </div>
        <div className="bg-card p-5 rounded-lg shadow-card space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Time Slots
          </h3>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-md text-sm"
              >
                <span className="text-foreground font-medium">{slot}</span>
                <button
                  onClick={() => removeTimeSlot(slot)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 04:00 – 05:00"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="max-w-[200px]"
            />
            <Button variant="outline" size="sm" onClick={addTimeSlot}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-card p-5 rounded-lg shadow-card space-y-4">
          <h3 className="font-semibold text-foreground">Slot Capacity</h3>
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">
              Online slots per time slot:
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">
              Walk-in capacity per service:
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              value={walkInCapacity}
              onChange={(e) => setWalkInCapacity(Number(e.target.value))}
              className="w-24"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Online : Walk-in recommended ratio = 3 : 2
          </p>
        </div>

        {/* Service availability */}
        <div className="bg-card p-5 rounded-lg shadow-card space-y-4">
          <h3 className="font-semibold text-foreground">
            Service Availability
          </h3>
          <div className="space-y-3">
            {ALL_SERVICES.map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({s.category})
                  </span>
                </div>
                <Switch
                  checked={serviceAvail[s.id] !== false}
                  onCheckedChange={(v) =>
                    setServiceAvail((prev) => ({ ...prev, [s.id]: v }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handlePublish} size="lg" className="w-full">
          Publish Configuration
        </Button>
      </motion.div>
    </AdminShell>
  );
};

export default SlotCustomization;
