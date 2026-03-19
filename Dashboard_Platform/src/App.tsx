import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import OverviewPage from "@/pages/OverviewPage";
import DemographicsPage from "@/pages/DemographicsPage";
import AdAnalysisPage from "@/pages/AdAnalysisPage";
import BehaviorPage from "@/pages/BehaviorPage";
import InsightsPage from "@/pages/InsightsPage";
import SecondaryPredictorPage from "./pages/SecondaryPredictorPage";
import AFIPredictorPage from "./pages/AFIPredictorPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/demographics" element={<DemographicsPage />} />
            <Route path="/ad-analysis" element={<AdAnalysisPage />} />
            <Route path="/behavior" element={<BehaviorPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/secondary/predictor" element={<SecondaryPredictorPage />} />
            <Route path="/afi-predictor" element={<AFIPredictorPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
