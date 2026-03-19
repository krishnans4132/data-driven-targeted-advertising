import { useState } from "react";
import { useSecondaryData } from "@/hooks/useSecondaryData";
import { StatCard } from "@/components/StatCard";
import { ChartCard } from "@/components/ChartCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Database, AlertCircle, BarChart3, TrendingDown, Filter } from "lucide-react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function SecondaryOverviewPage() {
  const { data, isLoading, error } = useSecondaryData();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  if (isLoading || !data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading overview...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error loading data.</div>;

  const { overview, categoryMetrics, sentimentDistribution, adSentimentDistribution } = data;
  
  const categories = categoryMetrics.map(c => c.name);
  
  // Set initial category if not set
  if (!selectedCategory && categories.length > 0) {
    setSelectedCategory(categories[0]);
  }

  const currentCategoryData = categoryMetrics.find(c => c.name === (selectedCategory || categories[0]));

  const displaySentiment = currentCategoryData 
    ? currentCategoryData.sentimentDistribution 
    : sentimentDistribution;

  const displayAdSentiment = currentCategoryData 
    ? currentCategoryData.adSentimentDistribution 
    : adSentimentDistribution;

  return (
    <AnimatedSection className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Overview & Sentiment Dashboard</h1>
          <p className="text-slate-400">High-level KPIs and overarching sentiment comparisons from 225k+ user reviews.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-white/10">
          <Filter size={18} className="text-indigo-400 ml-2" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-white border-none focus:ring-0 cursor-pointer pr-8 py-1 text-sm font-medium"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 bg-[#0f172a]/30 p-4 rounded-xl border border-white/5">
        <AnimatedCard delay={0.1}>
          <StatCard
            title="Total Analyzed Reviews"
            value={currentCategoryData ? currentCategoryData.totalReviews.toLocaleString() : overview.totalReviews.toLocaleString()}
            icon={<Database size={20} />}
            subtitle={currentCategoryData ? `In ${selectedCategory}` : "Across 7 app categories"}
          />
        </AnimatedCard>
        <AnimatedCard delay={0.2}>
          <StatCard
            title="Total Ad Mentions"
            value={currentCategoryData ? currentCategoryData.adMentions.toLocaleString() : overview.totalAdMentions.toLocaleString()}
            icon={<AlertCircle size={20} />}
            subtitle="Explicit ad complaints"
            variant="warm"
          />
        </AnimatedCard>
        <AnimatedCard delay={0.3}>
          <StatCard
            title="Ad Mention Rate"
            value={`${currentCategoryData ? currentCategoryData.adMentionRate : overview.adMentionRate}%`}
            icon={<BarChart3 size={20} />}
            subtitle="Overall ad-related reviews"
          />
        </AnimatedCard>
        <AnimatedCard delay={0.4}>
          <StatCard
            title="Avg Rating Drop"
            value={`-${currentCategoryData ? currentCategoryData.ratingDrop.toFixed(2) : (categoryMetrics.reduce((sum, cat) => sum + cat.ratingDrop, 0) / categoryMetrics.length).toFixed(2)}`}
            icon={<TrendingDown size={20} />}
            subtitle="Impact of ad mentions"
            variant="warm"
          />
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <AnimatedCard delay={0.5}>
          <ChartCard title={selectedCategory === "All Categories" ? "General App Sentiment" : `App Sentiment: ${selectedCategory}`}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={displaySentiment}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  stroke="none"
                >
                  {displaySentiment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} style={{ filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.3))" }} />
                  ))}
                </Pie>
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </AnimatedCard>

        <AnimatedCard delay={0.6}>
          <ChartCard title={selectedCategory === "All Categories" ? "Sentiment When Ads Are Mentioned" : `Ad Sentiment: ${selectedCategory}`}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <defs>
                   <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#991b1b" stopOpacity={1}/>
                   </linearGradient>
                </defs>
                <Pie
                  data={displayAdSentiment}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  stroke="none"
                >
                  {displayAdSentiment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Negative' ? "url(#redGradient)" : entry.fill} style={{ filter: entry.name === 'Negative' ? "drop-shadow(0px 0px 15px rgba(239, 68, 68, 0.5))" : "drop-shadow(0px 4px 10px rgba(0,0,0,0.3))"}} />
                  ))}
                </Pie>
                <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}
