import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Buy from "./pages/BuyAdvanced";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";
import Commercial from "./pages/Commercial";
import Land from "./pages/Land";
import Agents from "./pages/Agents";
import Auth from "./pages/Auth";
import PhoneAuth from "./pages/PhoneAuth";
import GoogleAuth from "./pages/GoogleAuth";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDashboard from "./pages/CompanyDashboard";
import AdminPanel from "./pages/AdminPanel";
import CompanyProperties from "./pages/CompanyProperties";
import CompanyDetails from "./pages/CompanyDetails";
import PropertyDetails from "./pages/PropertyDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/land" element={<Land />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/phone-auth" element={<PhoneAuth />} />
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/company/:companyId" element={<CompanyDetails />} />
          <Route path="/company/:companyId/properties" element={<CompanyProperties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;