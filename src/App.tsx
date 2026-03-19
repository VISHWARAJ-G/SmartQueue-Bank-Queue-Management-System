import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { BookingProvider } from "@/context/BookingContext";
import { AdminProvider } from "@/context/AdminContext";
import Landing from "./pages/Landing";
import About from "./pages/About";
import ServicesInfo from "./pages/ServicesInfo";
import BankSelection from "./pages/BankSelection";
import BranchSelection from "./pages/BranchSelection";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import ServiceCategory from "./pages/ServiceCategory";
import SlotBooking from "./pages/SlotBooking";
import BookingSummary from "./pages/BookingSummary";
import MyBookings from "./pages/MyBookings";
import StaffLogin from "./pages/StaffLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SlotCustomization from "./pages/SlotCustomization";
import SlotFreeze from "./pages/SlotFreeze";
import BookingCheck from "./pages/BookingCheck";
import WalkInManagement from "./pages/WalkInManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BookingProvider>
          <AdminProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/about" element={<About />} />
                <Route path="/services-info" element={<ServicesInfo />} />
                <Route path="/select-bank" element={<BankSelection />} />
                <Route path="/select-branch" element={<BranchSelection />} />
                <Route path="/authenticate" element={<Authentication />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services/:categoryId" element={<ServiceCategory />} />
                <Route path="/book-slot/:serviceId" element={<SlotBooking />} />
                <Route path="/booking-summary/:bookingId" element={<BookingSummary />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/slots" element={<SlotCustomization />} />
                <Route path="/admin/freeze" element={<SlotFreeze />} />
                <Route path="/admin/booking-check" element={<BookingCheck />} />
                <Route path="/admin/walkin" element={<WalkInManagement />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AdminProvider>
        </BookingProvider>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
