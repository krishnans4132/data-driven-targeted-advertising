import { useSurveyData } from "@/hooks/useSurveyData";
import { countBy, toChartData, countMultiValue, averageBy } from "@/lib/surveyData";
import { ChartCard } from "@/components/ChartCard";
import { StatCard } from "@/components/StatCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
} from "recharts";

const COLORS = [
  "hsl(250, 85%, 65%)", "hsl(170, 75%, 50%)", "hsl(35, 95%, 60%)",
  "hsl(340, 80%, 60%)", "hsl(200, 85%, 55%)", "hsl(120, 60%, 50%)",
  "hsl(280, 70%, 60%)", "hsl(15, 90%, 55%)",
];
const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, value, index } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6} fill={COLORS[index % COLORS.length]} fillOpacity={0.85} stroke="hsl(220, 20%, 7%)" strokeWidth={2} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="hsl(0, 0%, 100%)" fontSize={11} fontWeight={600}>{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="hsl(0, 0%, 85%)" fontSize={10}>{value}</text>
        </>
      )}
    </g>
  );
};

export default function BehaviorPage() {
  const { data, isLoading } = useSurveyData();
  if (isLoading || !data) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const screenTimeData = toChartData(countBy(data, "screen_time"));
  const appCatData = toChartData(countMultiValue(data, "most_used_category"));
  const dailyAppCatData = toChartData(countMultiValue(data, "daily_app_categories"));
  const payData = toChartData(countBy(data, "pay_for_adfree"));
  const uninstallData = toChartData(countBy(data, "ads_uninstall_app"));
  const fatigueByScreen = averageBy(data, "ad_fatigue_index", "screen_time");

  const topScreenTime = screenTimeData[0];
  const topAppCat = appCatData[0];
  const heavyUsers = data.filter(r => r.screen_time === "More than 6 hours" || r.screen_time === "4–6 hours").length;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Behavior</h1>
          <p className="text-muted-foreground text-sm mt-1">Screen time, app usage & response patterns</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Top Screen Time" value={topScreenTime?.name || "-"} subtitle={`${topScreenTime?.value} users`} variant="primary" />
          <StatCard title="Top App Category" value={topAppCat?.name || "-"} subtitle={`${topAppCat?.value} mentions`} variant="accent" />
          <StatCard title="Heavy Users (4+ hrs)" value={`${Math.round((heavyUsers / data.length) * 100)}%`} subtitle={`${heavyUsers} users`} variant="warm" />
          <StatCard title="Unique Categories" value={dailyAppCatData.length} subtitle="daily app categories" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Screen Time Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={screenTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {screenTimeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Daily App Categories (Treemap)">
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={dailyAppCatData.slice(0, 10)}
                dataKey="value"
                aspectRatio={4 / 3}
                content={<CustomTreemapContent />}
              />
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Most Used App Categories">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appCatData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis type="number" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {appCatData.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Willingness to Pay for Ad-Free">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={payData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {payData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Uninstalled Apps Due to Ads">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={uninstallData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {uninstallData.map((_, i) => <Cell key={i} fill={[COLORS[3], COLORS[1]][i] || COLORS[0]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fatigue Index by Screen Time">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={fatigueByScreen} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220, 15%, 18%)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 40%)", fontSize: 10 }} />
                <Radar dataKey="value" stroke="hsl(35, 95%, 60%)" fill="hsl(35, 95%, 60%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </AnimatedSection>
    </div>
  );
}
