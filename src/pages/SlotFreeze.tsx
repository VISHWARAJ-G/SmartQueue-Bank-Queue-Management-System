import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Snowflake, Lock, Unlock } from "lucide-react";
import { format } from "date-fns";
import AdminShell from "@/components/AdminShell";
import { useAdmin } from "@/context/AdminContext";
import { useBookings } from "@/context/BookingContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const SlotFreeze = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminBranchCode } = useAdmin();
  const {
    getSlotConfig,
    freezeSlot,
    unfreezeSlot,
    isSlotFrozen,
    getFilledSlots,
  } = useBookings();

  const [date, setDate] = useState<Date>();

  if (!isAdminLoggedIn) {
    navigate("/staff-login");
    return null;
  }

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";

  const config = getSlotConfig(adminBranchCode, dateStr);

  const handleFreeze = (slot: string) => {
    freezeSlot({ date: dateStr, timeSlot: slot, branchCode: adminBranchCode });
    toast.success(
      `Slot ${slot} frozen. Remaining capacity transferred to walk-in pool.`,
    );
  };

  const handleUnfreeze = (slot: string) => {
    unfreezeSlot({
      date: dateStr,
      timeSlot: slot,
      branchCode: adminBranchCode,
    });
    toast.success(`Slot ${slot} unfrozen.`);
  };

  return (
    <AdminShell title="Slot Freeze">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <div className="bg-card p-5 rounded-lg shadow-card space-y-2">
          <p className="text-sm text-muted-foreground">
            Freeze slots to make them unavailable for online booking. Remaining
            capacity will be transferred to the walk-in pool.
          </p>
        </div>

        {/* Date picker */}
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
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().toDateString())}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Slots */}
        {date && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.timeSlots.map((slot) => {
              const frozen = isSlotFrozen(dateStr, slot, adminBranchCode);
              const filled = getFilledSlots(dateStr, slot, adminBranchCode);
              const remaining = config.capacity - filled;
              return (
                <div
                  key={slot}
                  className={cn(
                    "p-4 rounded-lg border",
                    frozen
                      ? "bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-800"
                      : "bg-card shadow-card",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground text-sm">
                      {slot}
                    </span>
                    {frozen && <Snowflake className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {filled} / {config.capacity} filled · {remaining} remaining
                    {frozen && (
                      <span className="block text-blue-600 font-medium mt-1">
                        SLOT FREEZED
                      </span>
                    )}
                  </div>
                  {frozen ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfreeze(slot)}
                      className="w-full"
                    >
                      <Unlock className="w-3.5 h-3.5 mr-1" /> Unfreeze
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFreeze(slot)}
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      <Lock className="w-3.5 h-3.5 mr-1" /> Freeze Slot
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AdminShell>
  );
};

export default SlotFreeze;
