import { useSurveyData } from "@/hooks/useSurveyData";
import { countBy, toChartData, averageBy } from "@/lib/surveyData";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Users, TrendingUp, Smartphone, AlertTriangle, BarChart3, Frown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area,
} from "recharts";

const COLORS = [
  "hsl(250, 85%, 65%)", "hsl(170, 75%, 50%)", "hsl(35, 95%, 60%)",
  "hsl(340, 80%, 60%)", "hsl(200, 85%, 55%)", "hsl(120, 60%, 50%)",
];
const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function OverviewPage() {
  const { data, isLoading } = useSurveyData();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading survey data...</p>
        </div>
      </div>
    );
  }

  const avgFatigue = (data.reduce((s, r) => s + (r.ad_fatigue_index || 0), 0) / data.length).toFixed(2);
  const payForAdFree = data.filter((r) => r.pay_for_adfree === "Yes").length;
  const uninstallYes = data.filter((r) => r.ads_uninstall_app === "Yes").length;
  const frustrationHigh = data.filter(r => ["Agree", "Strongly agree"].includes(r.ads_cause_frustration)).length;
  const adFreqData = toChartData(countBy(data, "ad_frequency"));
  const smartphoneData = toChartData(countBy(data, "smartphone_type"));
  const fatigueByAge = averageBy(data, "ad_fatigue_index", "age_group");

  // Likert response distribution
  const likertFields = [
    { key: "ads_interrupt_usage" as const, label: "Interrupts Usage" },
    { key: "ads_cause_frustration" as const, label: "Causes Frustration" },
    { key: "ads_reduce_enjoyment" as const, label: "Reduces Enjoyment" },
    { key: "ads_close_app" as const, label: "Close App" },
  ];
  const likertOrder = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  const likertData = likertFields.map(({ key, label }) => {
    const counts = countBy(data, key);
    const row: Record<string, string | number> = { metric: label };
    likertOrder.forEach(l => { row[l] = counts[l] || 0; });
    return row;
  });

  const radarData = [
    { metric: "Interrupt", value: data.reduce((s, r) => s + (r.ads_interrupt_usage_score || 0), 0) / data.length },
    { metric: "Frustration", value: data.reduce((s, r) => s + (r.ads_cause_frustration_score || 0), 0) / data.length },
    { metric: "Enjoyment Loss", value: data.reduce((s, r) => s + (r.ads_reduce_enjoyment_score || 0), 0) / data.length },
    { metric: "Close App", value: data.reduce((s, r) => s + (r.ads_close_app_score || 0), 0) / data.length },
  ];

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Key metrics from {data.length} survey responses</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Responses" value={data.length} icon={<Users size={20} />} variant="primary" />
          <StatCard title="Avg Fatigue Index" value={avgFatigue} subtitle="out of 5.0" icon={<TrendingUp size={20} />} variant="accent" />
          <StatCard title="Would Pay Ad-Free" value={`${Math.round((payForAdFree / data.length) * 100)}%`} subtitle={`${payForAdFree} users`} icon={<Smartphone size={20} />} variant="warm" />
          <StatCard title="High Frustration" value={`${Math.round((frustrationHigh / data.length) * 100)}%`} subtitle={`${frustrationHigh} users`} icon={<Frown size={20} />} />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Ad Frequency Distribution">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={adFreqData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {adFreqData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Smartphone Distribution">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={smartphoneData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {smartphoneData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Avg Fatigue by Age Group">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fatigueByAge} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(170, 75%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Ad Impact Radar">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220, 15%, 18%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="hsl(250, 85%, 65%)" fill="hsl(250, 85%, 65%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </AnimatedSection>

      {/* Likert Response Distribution */}
      <AnimatedSection delay={0.25}>
        <ChartCard title="User Sentiment Distribution (Likert Responses)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={likertData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis type="number" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
              <YAxis dataKey="metric" type="category" width={120} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              {likertOrder.map((level, i) => (
                <Bar key={level} dataKey={level} stackId="a" fill={[
                  "hsl(170, 75%, 50%)", "hsl(170, 60%, 40%)", "hsl(220, 15%, 35%)", "hsl(35, 95%, 60%)", "hsl(0, 72%, 55%)"
                ][i]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3 justify-center">
            {likertOrder.map((level, i) => (
              <div key={level} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-sm" style={{ background: [
                  "hsl(170, 75%, 50%)", "hsl(170, 60%, 40%)", "hsl(220, 15%, 35%)", "hsl(35, 95%, 60%)", "hsl(0, 72%, 55%)"
                ][i] }} />
                {level}
              </div>
            ))}
          </div>
        </ChartCard>
      </AnimatedSection>
    </div>
  );
}
