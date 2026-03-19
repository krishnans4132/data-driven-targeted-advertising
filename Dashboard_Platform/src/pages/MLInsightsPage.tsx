import AdFatiguePrediction from "@/components/dashboard/AdFatiguePrediction";
import ForecastChart from "@/components/dashboard/ForecastChart";
import FeatureImportanceChart from "@/components/dashboard/FeatureImportanceChart";
import ForecastKPICards from "@/components/dashboard/ForecastKPICards";
import ModelPerformanceTable from "@/components/dashboard/ModelPerformanceTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function MLDashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />

      {/* ML Prediction Section */}
      <AdFatiguePrediction />

      {/* Feature Importance Section */}
      <FeatureImportanceChart />

      {/* Model Performance Section */}
      <ModelPerformanceTable />

      {/* Forecast Section */}
      <div className="space-y-4">
        <ForecastKPICards />
        <ForecastChart />
      </div>
    </div>
  );
}
