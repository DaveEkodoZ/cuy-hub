import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersModule from "./pages/modules/UsersModule";
import RessourcesModule from "./pages/modules/RessourcesModule";
import ReunionsModule from "./pages/modules/ReunionsModule";
import CommunicationModule from "./pages/modules/CommunicationModule";
import ActivitesModule from "./pages/modules/ActivitesModule";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module/utilisateurs/*" element={<UsersModule />} />
          <Route path="/module/ressources/*" element={<RessourcesModule />} />
          <Route path="/module/reunions/*" element={<ReunionsModule />} />
          <Route path="/module/communication/*" element={<CommunicationModule />} />
          <Route path="/module/activites/*" element={<ActivitesModule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
