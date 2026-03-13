import { BarChart3 } from "lucide-react";
import { modelPerformance } from "@/data/modelData";

const ModelPerformanceTable = () => {
  return (
    <section className="glass-card glow-border p-6 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-semibold font-mono text-foreground">Model Performance Comparison</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Model", "MAE", "RMSE", "R²"].map(h => (
                <th key={h} className="text-left py-3 px-4 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelPerformance.map((row) => (
              <tr key={row.model} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-4 font-mono text-foreground">{row.model}</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{row.mae < 0.001 ? "≈ 0" : row.mae.toFixed(3)}</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{row.rmse < 0.001 ? "≈ 0" : row.rmse.toFixed(3)}</td>
                <td className="py-3 px-4 font-mono font-bold text-primary">{row.r2.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ModelPerformanceTable;
