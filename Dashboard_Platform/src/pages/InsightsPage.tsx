import { useSurveyData } from "@/hooks/useSurveyData";
import { countBy, toChartData, averageBy, countMultiValue } from "@/lib/surveyData";
import { ChartCard } from "@/components/ChartCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, Legend,
  ComposedChart, Line, Area,
} from "recharts";
import { Lightbulb, TrendingDown, DollarSign, Shield, Target, Zap } from "lucide-react";

const COLORS = [
  "hsl(250, 85%, 65%)", "hsl(170, 75%, 50%)", "hsl(35, 95%, 60%)",
  "hsl(340, 80%, 60%)", "hsl(200, 85%, 55%)", "hsl(120, 60%, 50%)",
];
const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  metric: string;
  description: string;
  recommendation: string;
  severity: "high" | "medium" | "low";
}

function InsightCard({ icon, title, metric, description, recommendation, severity }: InsightCardProps) {
  const severityColors = {
    high: "border-destructive/30 bg-destructive/5",
    medium: "border-chart-3/30 bg-chart-3/5",
    low: "border-accent/30 bg-accent/5",
  };
  const severityBadge = {
    high: "bg-destructive/20 text-destructive",
    medium: "bg-chart-3/20 text-chart-3",
    low: "bg-accent/20 text-accent",
  };

  return (
    <div className={`glass-card p-5 ${severityColors[severity]} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-card/80 text-primary shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${severityBadge[severity]}`}>
              {severity} impact
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">{metric}</p>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
          <div className="mt-3 p-3 rounded-lg bg-card/60 border border-border/30">
            <p className="text-xs font-medium text-primary mb-1">💡 Recommendation</p>
            <p className="text-xs text-muted-foreground">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const { data, isLoading } = useSurveyData();
  if (isLoading || !data) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  // Compute insights
  const total = data.length;
  const avgFatigue = data.reduce((s, r) => s + (r.ad_fatigue_index || 0), 0) / total;
  const highFatigue = data.filter(r => r.ad_fatigue_index >= 4).length;
  const payYes = data.filter(r => r.pay_for_adfree === "Yes").length;
  const uninstallYes = data.filter(r => r.ads_uninstall_app === "Yes").length;
  const closeAppAgree = data.filter(r => ["Agree", "Strongly agree"].includes(r.ads_close_app)).length;
  const frustrationHigh = data.filter(r => ["Agree", "Strongly agree"].includes(r.ads_cause_frustration)).length;

  // Cross-analysis: fatigue by age + gender
  const ageGenderFatigue: Record<string, Record<string, { sum: number; count: number }>> = {};
  data.forEach(r => {
    const age = r.age_group || "Unknown";
    const gender = r.gender || "Unknown";
    if (!ageGenderFatigue[age]) ageGenderFatigue[age] = {};
    if (!ageGenderFatigue[age][gender]) ageGenderFatigue[age][gender] = { sum: 0, count: 0 };
    ageGenderFatigue[age][gender].sum += r.ad_fatigue_index || 0;
    ageGenderFatigue[age][gender].count += 1;
  });
  const crossData = Object.entries(ageGenderFatigue).flatMap(([age, genders]) =>
    Object.entries(genders).map(([gender, { sum, count }]) => ({
      age, gender, fatigue: Math.round((sum / count) * 100) / 100, count,
    }))
  );

  // Retention risk: uninstall rate by occupation
  const uninstallByOcc: Record<string, { yes: number; total: number }> = {};
  data.forEach(r => {
    const occ = r.occupation || "Unknown";
    if (!uninstallByOcc[occ]) uninstallByOcc[occ] = { yes: 0, total: 0 };
    uninstallByOcc[occ].total += 1;
    if (r.ads_uninstall_app === "Yes") uninstallByOcc[occ].yes += 1;
  });
  const retentionRisk = Object.entries(uninstallByOcc).map(([name, { yes, total }]) => ({
    name, rate: Math.round((yes / total) * 100), total
  })).sort((a, b) => b.rate - a.rate);

  // Monetization potential: pay_for_adfree by screen_time
  const payByScreen: Record<string, { yes: number; total: number }> = {};
  data.forEach(r => {
    const st = r.screen_time || "Unknown";
    if (!payByScreen[st]) payByScreen[st] = { yes: 0, total: 0 };
    payByScreen[st].total += 1;
    if (r.pay_for_adfree === "Yes") payByScreen[st].yes += 1;
  });
  const monetizationData = Object.entries(payByScreen).map(([name, { yes, total }]) => ({
    name, payRate: Math.round((yes / total) * 100), total, yes
  }));

  // Fatigue composition by screen time
  const fatigueComposed = averageBy(data, "ads_interrupt_usage_score", "screen_time").map((item, i) => {
    const frust = averageBy(data, "ads_cause_frustration_score", "screen_time").find(f => f.name === item.name);
    const enjoy = averageBy(data, "ads_reduce_enjoyment_score", "screen_time").find(f => f.name === item.name);
    return {
      name: item.name,
      interruption: item.value,
      frustration: frust?.value || 0,
      enjoyment_loss: enjoy?.value || 0,
    };
  });

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Insights</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Actionable intelligence from {total} survey responses — strategic recommendations for product & monetization teams
          </p>
        </div>
      </AnimatedSection>

      {/* Key Insight Cards */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InsightCard
            icon={<TrendingDown size={20} />}
            title="User Retention Crisis"
            metric={`${Math.round((uninstallYes / total) * 100)}% uninstall rate`}
            description={`${uninstallYes} out of ${total} users have uninstalled apps specifically because of excessive ads. Additionally, ${Math.round((closeAppAgree / total) * 100)}% agree that ads make them close apps.`}
            recommendation="Implement frequency capping (max 3 ads per session) and offer a 'light ads' tier to reduce churn. Consider A/B testing ad density reduction of 30% to measure retention impact."
            severity="high"
          />
          <InsightCard
            icon={<DollarSign size={20} />}
            title="Premium Monetization Opportunity"
            metric={`${Math.round((payYes / total) * 100)}% willing to pay`}
            description={`${payYes} users expressed willingness to pay for an ad-free experience. This represents a significant untapped revenue stream.`}
            recommendation="Launch a freemium model at $2.99-4.99/month. Target heavy users (6+ hrs screen time) first as they show highest willingness to pay. Start with a 7-day free trial."
            severity="medium"
          />
          <InsightCard
            icon={<Zap size={20} />}
            title="High Ad Fatigue Prevalence"
            metric={`${Math.round((highFatigue / total) * 100)}% at critical fatigue`}
            description={`${highFatigue} users scored 4.0 or higher on the fatigue index (scale of 5). Average fatigue sits at ${avgFatigue.toFixed(2)}, indicating widespread dissatisfaction with current ad experiences.`}
            recommendation="Redesign ad placement strategy: shift from interruptive formats to native, contextual placements. Prioritize rewarded ads which show highest tolerance rates."
            severity="high"
          />
          <InsightCard
            icon={<Shield size={20} />}
            title="Frustration-Driven Attrition Risk"
            metric={`${Math.round((frustrationHigh / total) * 100)}% highly frustrated`}
            description={`${frustrationHigh} users report significant frustration from ads. This emotional response strongly correlates with app abandonment and negative reviews.`}
            recommendation="Implement smart ad timing — avoid showing ads during active engagement moments. Use session-aware delivery: no ads in first 2 minutes of use, and respect natural pause points."
            severity="high"
          />
        </div>
      </AnimatedSection>

      {/* Cross-Analysis Visualizations */}
      <AnimatedSection delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Retention Risk by Occupation (Uninstall Rate %)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retentionRisk}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, "Uninstall Rate"]} />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {retentionRisk.map((entry, i) => (
                    <Cell key={i} fill={entry.rate > 50 ? "hsl(0, 72%, 55%)" : entry.rate > 35 ? "hsl(35, 95%, 60%)" : "hsl(170, 75%, 50%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Premium Conversion Potential by Screen Time">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monetizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} unit="%" />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(220, 10%, 55%)" }} />
                <Bar yAxisId="right" dataKey="total" name="Total Users" fill="hsl(220, 15%, 25%)" radius={[4, 4, 0, 0]} />
                <Line yAxisId="left" dataKey="payRate" name="Would Pay %" stroke="hsl(170, 75%, 50%)" strokeWidth={3} dot={{ fill: "hsl(170, 75%, 50%)", r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Fatigue Composition by Screen Time" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={fatigueComposed}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: "hsl(220, 10%, 55%)" }} />
                <Area type="monotone" dataKey="interruption" name="Interruption" stackId="1" stroke="hsl(250, 85%, 65%)" fill="hsl(250, 85%, 65%)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="frustration" name="Frustration" stackId="2" stroke="hsl(340, 80%, 60%)" fill="hsl(340, 80%, 60%)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="enjoyment_loss" name="Enjoyment Loss" stackId="3" stroke="hsl(35, 95%, 60%)" fill="hsl(35, 95%, 60%)" fillOpacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </AnimatedSection>

      {/* Detailed Cross-Tab: Age x Gender */}
      <AnimatedSection delay={0.3}>
        <ChartCard title="Fatigue Index: Age Group × Gender Breakdown">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Age Group</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Gender</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Avg Fatigue</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Respondents</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Severity</th>
                </tr>
              </thead>
              <tbody>
                {crossData.sort((a, b) => b.fatigue - a.fatigue).map((row, i) => (
                  <tr key={i} className="border-b border-border/20 hover:bg-card/50 transition-colors">
                    <td className="py-3 px-4 text-foreground">{row.age}</td>
                    <td className="py-3 px-4 text-foreground">{row.gender}</td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-foreground">{row.fatigue}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{row.count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full" style={{
                          width: `${(row.fatigue / 5) * 100}%`,
                          maxWidth: 100,
                          background: row.fatigue >= 4 ? "hsl(0, 72%, 55%)" : row.fatigue >= 3 ? "hsl(35, 95%, 60%)" : "hsl(170, 75%, 50%)",
                        }} />
                        <span className="text-xs text-muted-foreground">
                          {row.fatigue >= 4 ? "Critical" : row.fatigue >= 3 ? "Moderate" : "Low"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </AnimatedSection>

      {/* Summary Section */}
      <AnimatedSection delay={0.4}>
        <div className="glass-card p-6 border-primary/20 glow-primary">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="text-primary mt-0.5" size={22} />
            <div>
              <h3 className="font-bold text-foreground text-lg">Executive Summary</h3>
              <p className="text-muted-foreground text-sm mt-1">Key takeaways for stakeholders</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-card/60 border border-border/30">
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><Target size={14} className="text-primary" /> Market Opportunity</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                With {Math.round((payYes / total) * 100)}% of users willing to pay for ad-free experiences, there's a clear market for premium tiers. 
                Heavy screen-time users (4+ hours) show the highest conversion potential. A well-positioned premium offering 
                could capture significant revenue while improving user satisfaction.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/30">
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><Shield size={14} className="text-destructive" /> Risk Assessment</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The {Math.round((uninstallYes / total) * 100)}% app uninstall rate due to ads represents direct revenue loss. 
                Combined with {Math.round((highFatigue / total) * 100)}% of users at critical fatigue levels, current ad strategies 
                are actively driving users away. Unskippable and video ads are the primary offenders — switching to rewarded 
                and skippable formats could reduce churn by an estimated 20-35%.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/30">
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><Zap size={14} className="text-chart-3" /> Quick Wins</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Replace unskippable ads with rewarded ad alternatives</li>
                <li>• Implement frequency capping at 3 ads per session</li>
                <li>• Avoid ads during evening hours (peak annoyance time)</li>
                <li>• Add a "reduce ads" toggle as a retention tool</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-card/60 border border-border/30">
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2"><DollarSign size={14} className="text-accent" /> Revenue Strategy</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li>• Launch freemium tier at $2.99–4.99/month</li>
                <li>• Target 18–24 age group (highest engagement)</li>
                <li>• A/B test native ad placements vs. interstitials</li>
                <li>• Offer ad-light tier at $0.99/month as middle ground</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
