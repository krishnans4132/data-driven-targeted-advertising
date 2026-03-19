import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import { dailyMentions, forecastResults } from "@/data/forecastData";

const ForecastChart = () => {
  // Combine historical and forecast data
  const combined = [
    ...dailyMentions.map(d => ({
      ds: d.ds,
      actual: d.y,
      forecast: null as number | null,
      upper: null as number | null,
      lower: null as number | null,
    })),
    // Overlap last point
    {
      ds: dailyMentions[dailyMentions.length - 1].ds,
      actual: dailyMentions[dailyMentions.length - 1].y,
      forecast: forecastResults[0].yhat,
      upper: forecastResults[0].yhat_upper,
      lower: forecastResults[0].yhat_lower,
    },
    ...forecastResults.map(d => ({
      ds: d.ds,
      actual: null as number | null,
      forecast: d.yhat,
      upper: d.yhat_upper,
      lower: d.yhat_lower,
    })),
  ];

  const forecastStartDate = dailyMentions[dailyMentions.length - 1].ds;

  return (
    <section className="glass-card glow-border p-6 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center gap-2 mb-6">
        <LineChartIcon className="w-5 h-5 text-chart-forecast" />
        <h2 className="text-xl font-semibold font-mono text-foreground">Ad Mention Forecast — Time Series</h2>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combined} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="ds"
              stroke="hsl(215 15% 55%)"
              fontSize={10}
              fontFamily="JetBrains Mono"
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval={9}
            />
            <YAxis
              stroke="hsl(215 15% 55%)"
              fontSize={10}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 18% 10%)",
                border: "1px solid hsl(220 16% 18%)",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
                color: "hsl(210 20% 92%)",
              }}
              labelFormatter={(label) => {
                const d = new Date(label);
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: "11px" }}
            />

            {/* Confidence interval area */}
            <Area
              dataKey="upper"
              stroke="none"
              fill="hsl(160 84% 39% / 0.1)"
              name="Upper Bound"
              dot={false}
              activeDot={false}
            />
            <Area
              dataKey="lower"
              stroke="none"
              fill="hsl(220 20% 7%)"
              name="Lower Bound"
              dot={false}
              activeDot={false}
            />

            {/* Actual line */}
            <Line
              dataKey="actual"
              stroke="hsl(199 89% 48%)"
              strokeWidth={2}
              dot={false}
              name="Actual Mentions"
              connectNulls={false}
            />

            {/* Forecast line */}
            <Line
              dataKey="forecast"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              name="Forecasted Mentions"
              connectNulls={false}
            />

            <ReferenceLine
              x={forecastStartDate}
              stroke="hsl(215 15% 35%)"
              strokeDasharray="3 3"
              label={{
                value: "Forecast Start",
                position: "top",
                style: {
                  fill: "hsl(215 15% 55%)",
                  fontSize: 10,
                  fontFamily: "JetBrains Mono",
                },
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ForecastChart;
