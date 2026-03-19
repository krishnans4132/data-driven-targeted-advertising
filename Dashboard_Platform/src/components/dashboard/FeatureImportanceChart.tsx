import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { featureImportance } from "@/data/modelData";
import { TreePine } from "lucide-react";

const FeatureImportanceChart = () => {
  const sorted = [...featureImportance].sort((a, b) => b.importance - a.importance);

  return (
    <section className="glass-card glow-border p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-6">
        <TreePine className="w-5 h-5 text-chart-bar" />
        <h2 className="text-xl font-semibold font-mono text-foreground">Random Forest — Feature Importance</h2>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <XAxis
              type="number"
              domain={[0, 0.3]}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              stroke="hsl(215 15% 55%)"
              fontSize={11}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              type="category"
              dataKey="feature"
              width={180}
              stroke="hsl(215 15% 55%)"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Importance"]}
              contentStyle={{
                backgroundColor: "hsl(220 18% 10%)",
                border: "1px solid hsl(220 16% 18%)",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
                color: "hsl(210 20% 92%)",
              }}
            />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
              {sorted.map((_, index) => (
                <Cell
                  key={index}
                  fill={index < 4
                    ? `hsl(265 70% ${60 - index * 5}%)`
                    : `hsl(265 30% ${50 - index * 3}%)`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default FeatureImportanceChart;
