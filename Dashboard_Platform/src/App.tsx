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
import ProjectOverviewPage from "@/pages/ProjectOverviewPage";
import SurveyLayout from "@/components/SurveyLayout";
import SecondaryLayout from "@/components/SecondaryLayout";
import SecondaryOverviewPage from "@/pages/SecondaryOverviewPage";
import SecondaryInsightsPage from "@/pages/SecondaryInsightsPage";
import SecondaryAppsPage from "@/pages/SecondaryAppsPage";
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
            <Route path="/" element={<ProjectOverviewPage />} />
            <Route element={<SecondaryLayout />}>
              <Route path="/secondary" element={<SecondaryOverviewPage />} />
              <Route path="/secondary/insights" element={<SecondaryInsightsPage />} />
              <Route path="/secondary/apps" element={<SecondaryAppsPage />} />
              <Route path="/secondary/predictor" element={<SecondaryPredictorPage />} />
            </Route>
            
            <Route element={<SurveyLayout />}>
              <Route path="/survey" element={<OverviewPage />} />
              <Route path="/demographics" element={<DemographicsPage />} />
              <Route path="/ad-analysis" element={<AdAnalysisPage />} />
              <Route path="/behavior" element={<BehaviorPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/afi-predictor" element={<AFIPredictorPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
