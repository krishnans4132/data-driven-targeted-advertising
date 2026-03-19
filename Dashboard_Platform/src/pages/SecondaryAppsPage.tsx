import { useSecondaryData } from "@/hooks/useSecondaryData";
import { ChartCard } from "@/components/ChartCard";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Trophy, Medal, Award } from "lucide-react";

const tooltipStyle = { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, color: "hsl(220, 10%, 92%)" };

export default function SecondaryAppsPage() {
  const { data, isLoading, error } = useSecondaryData();

  if (isLoading || !data) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading app data...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error loading data.</div>;

  // Take top 15 apps with the highest ad mention rates
  const topApps = [...data.appMetrics].sort((a, b) => b.adMentionRate - a.adMentionRate).slice(0, 15);
  const [first, second, third] = topApps;

  return (
    <AnimatedSection className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">App Frustration Leaderboard</h1>
        <p className="text-slate-400">Isolating the specific applications generating the highest percentage of ad-related complaints.</p>
      </div>

      {/* Podium Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pt-4">
        <AnimatedCard delay={0.2} className="mt-8">
           <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
              <Medal className="text-slate-400 mb-3" size={40} />
              <h3 className="text-xl font-bold text-white mb-1">{second?.name || "N/A"}</h3>
              <p className="text-2xl font-black text-slate-300">{second?.adMentionRate}%</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Complaint Rate</p>
           </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
           <div className="bg-[#1e1b4b]/80 border border-indigo-500/30 rounded-xl p-8 flex flex-col items-center text-center relative shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] transform scale-105 z-10">
              <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <Trophy className="text-yellow-400 mb-4 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={56} />
              <h3 className="text-2xl font-black text-white mb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">{first?.name || "N/A"}</h3>
              <p className="text-4xl font-black text-yellow-400 mt-2">{first?.adMentionRate}%</p>
              <p className="text-sm text-slate-300 uppercase tracking-widest mt-2 font-semibold">Highest Friction</p>
           </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} className="mt-8">
           <div className="bg-orange-950/20 border border-orange-900/50 rounded-xl p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
              <Award className="text-orange-600 mb-3" size={40} />
              <h3 className="text-xl font-bold text-white mb-1">{third?.name || "N/A"}</h3>
              <p className="text-2xl font-black text-orange-500">{third?.adMentionRate}%</p>
              <p className="text-sm text-slate-500 uppercase tracking-widest mt-1">Complaint Rate</p>
           </div>
        </AnimatedCard>
      </div>

      <AnimatedCard delay={0.4}>
        <ChartCard title="Top 15 Most Complained About Applications">
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={topApps} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                   <stop offset="0%" stopColor="hsl(280, 85%, 60%)" stopOpacity={0.8}/>
                   <stop offset="100%" stopColor="hsl(340, 80%, 60%)" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 15%)" horizontal={false} />
              <XAxis type="number" stroke="hsl(220, 10%, 50%)" unit="%" />
              <YAxis dataKey="name" type="category" stroke="hsl(220, 10%, 60%)" tick={{ fontSize: 13, fill: 'white' }} width={120} />
              <Tooltip itemStyle={{ color: '#4ade80', fontWeight: 600 }} labelStyle={{ color: '#4ade80', fontWeight: 'bold' }} contentStyle={tooltipStyle} cursor={{ fill: "hsl(220, 10%, 15%)" }} />
              <Bar dataKey="adMentionRate" name="Ad Complaint Rate" fill="url(#barGradient)" radius={[0, 4, 4, 0]}>
                {topApps.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(340, 90%, 60%)" : "url(#barGradient)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </AnimatedCard>
    </AnimatedSection>
  );
}
