import { useSecondaryData } from "@/hooks/useSecondaryData";
import { ChartCard } from "@/components/ChartCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function SecondaryInsightsPage() {
  const { data, isLoading, error } = useSecondaryData();

  if (isLoading || !data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading insights...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error loading data.</div>;

  const { categoryMetrics, continentMetrics } = data;

  return (
    <AnimatedSection className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Category & Geographic Insights</h1>
        <p className="text-muted-foreground">Advanced breakdown of advertisement complaints across application genres and global regions.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Radar Chart for Categories */}
        <AnimatedCard delay={0.1}>
          <ChartCard title="Ad Friction Profile by Category">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={categoryMetrics} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <defs>
                  <linearGradient id="colorRadar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(340, 80%, 60%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(340, 80%, 60%)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <PolarGrid stroke="hsl(220, 10%, 20%)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 60%)", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "hsl(220, 10%, 40%)" }} />
                <Radar name="Ad Mention Rate (%)" dataKey="adMentionRate" stroke="hsl(340, 80%, 60%)" fill="url(#colorRadar)" fillOpacity={1} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </AnimatedCard>

        {/* Composed Chart for Geography */}
        <AnimatedCard delay={0.2}>
          <ChartCard title="Global Rating Impact via Continents">
             <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={continentMetrics} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="colorGeoBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(200, 85%, 55%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(200, 85%, 55%)" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 15%)" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(220, 10%, 50%)" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="hsl(200, 85%, 55%)" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(340, 80%, 60%)" domain={[0, 5]} />
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Legend verticalAlign="top" height={36} />
                <Bar yAxisId="left" dataKey="totalReviews" name="Total Reviews" fill="url(#colorGeoBar)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgRatingWithAds" name="Rating w/ Ads" stroke="hsl(340, 80%, 60%)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="avgRatingWithoutAds" name="Rating (No Ads)" stroke="hsl(170, 75%, 50%)" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}
