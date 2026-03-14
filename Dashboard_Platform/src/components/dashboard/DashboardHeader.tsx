import { Activity } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 animate-pulse-glow">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
          Ad Intelligence Dashboard
        </h1>
      </div>
      <p className="text-muted-foreground text-sm ml-14">
        ML-powered ad fatigue prediction & mention forecasting
      </p>
    </header>
  );
};

export default DashboardHeader;
