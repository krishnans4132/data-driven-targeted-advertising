import { useSurveyData } from "@/hooks/useSurveyData";
import { countBy, toChartData, averageBy } from "@/lib/surveyData";
import { ChartCard } from "@/components/ChartCard";
import { StatCard } from "@/components/StatCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(250, 85%, 65%)", "hsl(170, 75%, 50%)", "hsl(35, 95%, 60%)",
  "hsl(340, 80%, 60%)", "hsl(200, 85%, 55%)", "hsl(120, 60%, 50%)",
];
const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function AdAnalysisPage() {
  const { data, isLoading } = useSurveyData();
  if (isLoading || !data) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const adFormatData = toChartData(countBy(data, "frequent_ad_format"));
  const toleratedData = toChartData(countBy(data, "tolerated_ad_format"));
  const excessiveData = toChartData(countBy(data, "most_excessive_ad_category"));
  const annoyingTimeData = toChartData(countBy(data, "most_annoying_ad_time"));
  const fatigueByFormat = averageBy(data, "ad_fatigue_index", "frequent_ad_format");

  // Format tolerance gap: compare frequency vs tolerance
  const allFormats = [...new Set([...adFormatData.map(d => d.name), ...toleratedData.map(d => d.name)])];
  const gapData = allFormats.map(name => ({
    name,
    encountered: adFormatData.find(d => d.name === name)?.value || 0,
    tolerated: toleratedData.find(d => d.name === name)?.value || 0,
  })).sort((a, b) => b.encountered - a.encountered);

  const topAnnoying = adFormatData[0];
  const topTolerated = toleratedData[0];
  const topExcessive = excessiveData[0];

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ad Analysis</h1>
          <p className="text-muted-foreground text-sm mt-1">Ad format preferences and pain points</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Most Frequent Format" value={topAnnoying?.name || "-"} subtitle={`${topAnnoying?.value} encounters`} variant="primary" />
          <StatCard title="Most Tolerated" value={topTolerated?.name || "-"} subtitle={`${topTolerated?.value} users`} variant="accent" />
          <StatCard title="Most Excessive Category" value={topExcessive?.name || "-"} subtitle={`${topExcessive?.value} mentions`} variant="warm" />
          <StatCard title="Ad Formats Tracked" value={adFormatData.length} subtitle="distinct types" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Ad Format: Encountered vs Tolerated" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={gapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} angle={-15} textAnchor="end" height={55} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(220, 10%, 55%)" }} />
                <Bar dataKey="encountered" name="Frequently Seen" fill="hsl(340, 80%, 60%)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                <Bar dataKey="tolerated" name="Users Tolerate" fill="hsl(170, 75%, 50%)" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Frequent Ad Formats">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adFormatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {adFormatData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tolerated Ad Formats">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={toleratedData} cx="50%" cy="50%" innerRadius={55} outerRadius={105} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {toleratedData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Excessive Ad Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={excessiveData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(340, 80%, 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Annoying Ad Time">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={annoyingTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="hsl(250, 85%, 65%)" fill="hsl(250, 85%, 65%)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fatigue by Ad Format" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fatigueByFormat}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                <YAxis domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(170, 75%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </AnimatedSection>
    </div>
  );
}
