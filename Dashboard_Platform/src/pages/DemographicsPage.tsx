import { useSurveyData } from "@/hooks/useSurveyData";
import { countBy, toChartData, averageBy } from "@/lib/surveyData";
import { ChartCard } from "@/components/ChartCard";
import { StatCard } from "@/components/StatCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(250, 85%, 65%)", "hsl(170, 75%, 50%)", "hsl(35, 95%, 60%)",
  "hsl(340, 80%, 60%)", "hsl(200, 85%, 55%)", "hsl(120, 60%, 50%)",
];
const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function DemographicsPage() {
  const { data, isLoading } = useSurveyData();
  if (isLoading || !data) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const ageData = toChartData(countBy(data, "age_group"));
  const genderData = toChartData(countBy(data, "gender"));
  const occData = toChartData(countBy(data, "occupation"));
  const fatigueByGender = averageBy(data, "ad_fatigue_index", "gender");
  const fatigueByOcc = averageBy(data, "ad_fatigue_index", "occupation");

  // Smartphone by age group cross-tab
  const smartphoneByAge: Record<string, Record<string, number>> = {};
  data.forEach(r => {
    const age = r.age_group || "Unknown";
    const phone = r.smartphone_type || "Unknown";
    if (!smartphoneByAge[age]) smartphoneByAge[age] = {};
    smartphoneByAge[age][phone] = (smartphoneByAge[age][phone] || 0) + 1;
  });
  const phoneTypes = [...new Set(data.map(r => r.smartphone_type).filter(Boolean))];
  const crossPhoneData = Object.entries(smartphoneByAge).map(([age, phones]) => ({
    name: age, ...phones,
  }));

  const topAge = ageData[0];
  const topGender = genderData[0];

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Demographics</h1>
          <p className="text-muted-foreground text-sm mt-1">Respondent profile breakdown</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Dominant Age Group" value={topAge?.name || "-"} subtitle={`${topAge?.value} respondents`} variant="primary" />
          <StatCard title="Top Gender" value={topGender?.name || "-"} subtitle={`${topGender?.value} respondents`} variant="accent" />
          <StatCard title="Occupations" value={occData.length} subtitle="distinct categories" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Age Group Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Gender Split">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Smartphone Preference by Age Group">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={crossPhoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(220, 10%, 55%)" }} />
                {phoneTypes.map((type, i) => (
                  <Bar key={type} dataKey={type} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === phoneTypes.length - 1 ? [4, 4, 0, 0] : undefined} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fatigue Index by Gender">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fatigueByGender}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(340, 80%, 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fatigue Index by Occupation" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fatigueByOcc} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="hsl(35, 95%, 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </AnimatedSection>
    </div>
  );
}
