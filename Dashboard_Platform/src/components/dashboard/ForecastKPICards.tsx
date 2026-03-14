import { TrendingUp, TrendingDown, Calendar, CalendarRange } from "lucide-react";
import { getForecastKPIs } from "@/data/forecastData";

const ForecastKPICards = () => {
  const { total7, total30, trendDirection, trendPercent } = getForecastKPIs();
  const isUp = trendDirection === "increasing";

  const cards = [
    {
      label: "Next 7 Days",
      value: total7,
      icon: Calendar,
      suffix: "mentions",
    },
    {
      label: "Next 30 Days",
      value: total30,
      icon: CalendarRange,
      suffix: "mentions",
    },
    {
      label: "Trend Direction",
      value: `${trendPercent}%`,
      icon: isUp ? TrendingUp : TrendingDown,
      suffix: isUp ? "Increasing" : "Decreasing",
      trendColor: isUp ? "text-kpi-up" : "text-kpi-down",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass-card glow-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${card.trendColor || "text-primary"}`} />
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-mono">{card.label}</span>
            </div>
            <div className={`text-3xl font-bold font-mono ${card.trendColor || "text-foreground"}`}>
              {card.value}
            </div>
            <div className="text-muted-foreground text-xs font-mono mt-1">{card.suffix}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ForecastKPICards;
