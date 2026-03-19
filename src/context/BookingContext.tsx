import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

export type CheckInStatus = "upcoming" | "ready" | "checked-in" | "absent";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  branch: string;
  branchCode: string;
  date: string;
  timeSlot: string;
  duration: number;
  documents: string[];
  bookingCode: string;
  status: "Confirmed" | "Cancelled";
  checkInStatus: CheckInStatus;
  createdAt: number;
  isWalkIn?: boolean;
  walkInName?: string;
}

export interface SlotConfig {
  timeSlots: string[];
  capacity: number;
  serviceAvailability: Record<string, boolean>;
  walkInCapacity: number;
}

export interface FrozenSlot {
  date: string;
  timeSlot: string;
  branchCode: string;
}

interface SlotKey {
  date: string;
  timeSlot: string;
  branchCode: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (id: string) => void;
  checkIn: (id: string) => void;
  getFilledSlots: (
    date: string,
    timeSlot: string,
    branchCode: string,
  ) => number;
  hasActiveBookingForService: (serviceId: string) => boolean;
  hasTimeConflict: (
    date: string,
    timeSlot: string,
    branchCode: string,
  ) => boolean;
  // Shared slot config
  slotConfigs: Record<string, Record<string, SlotConfig>>;
  publishSlotConfig: (
    branchCode: string,
    date: string,
    config: SlotConfig,
  ) => void;
  getSlotConfig: (branchCode: string, date: string) => SlotConfig;
  // Frozen slots
  frozenSlots: FrozenSlot[];
  freezeSlot: (slot: FrozenSlot) => void;
  unfreezeSlot: (slot: FrozenSlot) => void;
  isSlotFrozen: (date: string, timeSlot: string, branchCode: string) => boolean;
  // Walk-in pool
  walkInPool: Record<string, number>;
  getWalkInRemaining: (branchCode: string, serviceId: string) => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const slotKey = (k: SlotKey) => `${k.date}|${k.timeSlot}|${k.branchCode}`;
const frozenKey = (s: FrozenSlot) => `${s.date}|${s.timeSlot}|${s.branchCode}`;

const DEFAULT_TIME_SLOTS = [
  "09:00 – 10:00",
  "10:00 – 11:00",
  "11:00 – 12:00",
  "01:00 – 02:00",
  "02:00 – 03:00",
  "03:00 – 04:00",
];

const DEFAULT_SLOT_CONFIG: SlotConfig = {
  timeSlots: DEFAULT_TIME_SLOTS,
  capacity: 20,
  serviceAvailability: {},
  walkInCapacity: 0,
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [slotConfigs, setSlotConfigs] = useState<
    Record<string, Record<string, SlotConfig>>
  >({});
  const [frozenSlots, setFrozenSlots] = useState<FrozenSlot[]>([]);
  const [walkInPool, setWalkInPool] = useState<Record<string, number>>({});

  const getSlotConfig = useCallback(
    (branchCode: string, date: string): SlotConfig =>
      slotConfigs[branchCode]?.[date] || DEFAULT_SLOT_CONFIG,
    [slotConfigs],
  );

  const addBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
    const key = slotKey({
      date: booking.date,
      timeSlot: booking.timeSlot,
      branchCode: booking.branchCode,
    });
    setSlotCounts((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    // If walk-in, decrement walk-in pool
    if (booking.isWalkIn) {
      const wpKey = `${booking.branchCode}|${booking.serviceId}`;
      setWalkInPool((prev) => ({
        ...prev,
        [wpKey]: Math.max(0, (prev[wpKey] || 0) - 1),
      }));
    }
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id || b.status === "Cancelled") return b;
        const key = slotKey({
          date: b.date,
          timeSlot: b.timeSlot,
          branchCode: b.branchCode,
        });
        setSlotCounts((sc) => ({
          ...sc,
          [key]: Math.max(0, (sc[key] || 0) - 1),
        }));
        return { ...b, status: "Cancelled" };
      }),
    );
  }, []);

  const checkIn = useCallback((id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, checkInStatus: "checked-in" as CheckInStatus }
          : b,
      ),
    );
  }, []);

  const getFilledSlots = useCallback(
    (date: string, timeSlot: string, branchCode: string) => {
      const key = slotKey({ date, timeSlot, branchCode });
      return slotCounts[key] || 0;
    },
    [slotCounts],
  );

  const hasActiveBookingForService = useCallback(
    (serviceId: string) =>
      bookings.some(
        (b) =>
          b.serviceId === serviceId && b.status === "Confirmed" && !b.isWalkIn,
      ),
    [bookings],
  );

  const hasTimeConflict = useCallback(
    (date: string, timeSlot: string, branchCode: string) =>
      bookings.some(
        (b) =>
          b.status === "Confirmed" &&
          b.date === date &&
          b.timeSlot === timeSlot &&
          b.branchCode === branchCode &&
          !b.isWalkIn,
      ),
    [bookings],
  );

  const publishSlotConfig = useCallback(
    (branchCode: string, date: string, config: SlotConfig) => {
      setSlotConfigs((prev) => ({
        ...prev,
        [branchCode]: {
          ...(prev[branchCode] || {}),
          [date]: config,
        },
      }));
    },
    [],
  );

  const freezeSlot = useCallback(
    (slot: FrozenSlot) => {
      setFrozenSlots((prev) => {
        if (prev.some((s) => frozenKey(s) === frozenKey(slot))) return prev;
        return [...prev, slot];
      });
      // Transfer remaining capacity to walk-in pool (simplified: add remaining to all services)
      const key = slotKey(slot);
      const filled = slotCounts[key] || 0;
      const config =
        slotConfigs[slot.branchCode]?.[slot.date] || DEFAULT_SLOT_CONFIG;
      const remaining = Math.max(0, config.capacity - filled);
      if (remaining > 0) {
        // Add to a generic walk-in pool for the branch
        const wpKey = `${slot.branchCode}|_walkin_pool`;
        setWalkInPool((prev) => ({
          ...prev,
          [wpKey]: (prev[wpKey] || 0) + remaining,
        }));
      }
    },
    [slotCounts, slotConfigs],
  );

  const unfreezeSlot = useCallback((slot: FrozenSlot) => {
    setFrozenSlots((prev) =>
      prev.filter((s) => frozenKey(s) !== frozenKey(slot)),
    );
  }, []);

  const isSlotFrozen = useCallback(
    (date: string, timeSlot: string, branchCode: string) =>
      frozenSlots.some(
        (s) =>
          s.date === date &&
          s.timeSlot === timeSlot &&
          s.branchCode === branchCode,
      ),
    [frozenSlots],
  );

  const getWalkInRemaining = useCallback(
    (branchCode: string, serviceId: string) => {
      const config =
        slotConfigs[branchCode]?.[new Date().toISOString().split("T")[0]] ||
        DEFAULT_SLOT_CONFIG;
      // Base walk-in capacity from config + frozen slot transfers
      const poolKey = `${branchCode}|_walkin_pool`;
      const serviceKey = `${branchCode}|${serviceId}`;
      const base = config.walkInCapacity;
      const fromFrozen = walkInPool[poolKey] || 0;
      const used = -(walkInPool[serviceKey] || 0); // negative means used
      return base + fromFrozen + (walkInPool[serviceKey] || 0);
    },
    [slotConfigs, walkInPool],
  );

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        checkIn,
        getFilledSlots,
        hasActiveBookingForService,
        hasTimeConflict,
        slotConfigs,
        publishSlotConfig,
        getSlotConfig,
        frozenSlots,
        freezeSlot,
        unfreezeSlot,
        isSlotFrozen,
        walkInPool,
        getWalkInRemaining,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
};
