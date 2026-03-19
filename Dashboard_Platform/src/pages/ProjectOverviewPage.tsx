import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Target, Users, TrendingDown, CheckCircle2, FileSearch, BarChart3, Presentation, Zap } from "lucide-react";

export default function ProjectOverviewPage() {
  return (
    <AnimatedSection className="space-y-12 max-w-5xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-10 pb-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full -z-10 pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          A Business Analytics Study of <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Advertisement Fatigue</span> 
          <span className="text-white"> in Mobile Applications</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          This project investigates advertisement fatigue in mobile applications using a powerful combination of primary survey data and text-mined secondary user review analysis.
        </p>
      </div>

      <AnimatedCard delay={0.1}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-white/5">
             <Zap size={160} />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="text-blue-400" /> Defining the Problem
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg z-10 relative">
            The study aims to deeply understand how frequent advertisements negatively impact user experience, including frustration levels, uninstall behavior, and the ultimate willingness to pay for premium, ad-free versions. By fusing survey insights with raw app review data, we provide data-driven recommendations for optimizing advertising strategies without burning out the user base.
          </p>
        </div>
      </AnimatedCard>

      {/* Objectives Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white pl-2 border-l-4 border-emerald-400">Core Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedCard delay={0.2}>
            <div className="bg-[#0f172a]/80 border border-white/5 p-6 rounded-xl hover:border-emerald-400/30 transition-colors h-full flex gap-4">
              <div className="mt-1 bg-emerald-400/10 p-2 rounded-lg h-fit text-emerald-400"><BarChart3 size={24}/></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Measure Advertisement Fatigue</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Quantify ad fatigue using structured primary survey data combined with a newly computed custom Ad Fatigue Index.</p>
              </div>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={0.3}>
            <div className="bg-[#0f172a]/80 border border-white/5 p-6 rounded-xl hover:border-blue-400/30 transition-colors h-full flex gap-4">
              <div className="mt-1 bg-blue-400/10 p-2 rounded-lg h-fit text-blue-400"><TrendingDown size={24}/></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Identify App Categories</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Determine which specific app genres (Gaming, Social, Utilities) generate the highest levels of ad-related frustration.</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4}>
            <div className="bg-[#0f172a]/80 border border-white/5 p-6 rounded-xl hover:border-purple-400/30 transition-colors h-full flex gap-4">
              <div className="mt-1 bg-purple-400/10 p-2 rounded-lg h-fit text-purple-400"><Users size={24}/></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Analyze Uninstall Behavior</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Track and correlate the tipping points linking advertisement density with active application uninstalls.</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.5}>
            <div className="bg-[#0f172a]/80 border border-white/5 p-6 rounded-xl hover:border-rose-400/30 transition-colors h-full flex gap-4">
              <div className="mt-1 bg-rose-400/10 p-2 rounded-lg h-fit text-rose-400"><CheckCircle2 size={24}/></div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Evaluate Tolerance Thresholds</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Assess the varying demographic tolerance levels and the financial willingness to pay to eliminate the ad experience.</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>

      {/* Methodology Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-white pl-2 border-l-4 border-blue-400">Project Methodology</h2>
        <div className="bg-[#0f172a]/80 border border-white/10 rounded-xl p-8 relative">
          <div className="absolute left-[39px] top-12 bottom-12 w-px bg-white/10 hidden md:block" />
          
          <div className="space-y-8">
            <div className="flex gap-6 relative">
              <div className="bg-slate-800 border-2 border-slate-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0 z-10 text-blue-400 font-bold">1</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2 flex items-center gap-2"><FileSearch size={20}/> Data Collection</h3>
                <p className="text-slate-400 leading-relaxed">Aggregated both primary data via a 411-response survey and secondary data mining 225,000+ Google Play Store reviews looking for ad complaints.</p>
              </div>
            </div>
            
            <div className="flex gap-6 relative">
              <div className="bg-slate-800 border-2 border-slate-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0 z-10 text-emerald-400 font-bold">2</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2 flex items-center gap-2"><BarChart3 size={20}/> Preprocessing & Analysis</h3>
                <p className="text-slate-400 leading-relaxed">Conducted heavy cleaning, sentiment mappings, KPI extraction, and NLP parsing. Compiled massive datasets into performant JSON aggregates for immediate frontend hydration.</p>
              </div>
            </div>

            <div className="flex gap-6 relative">
              <div className="bg-slate-800 border-2 border-slate-600 rounded-full w-12 h-12 flex items-center justify-center shrink-0 z-10 text-purple-400 font-bold">3</div>
              <div>
                <h3 className="text-xl font-medium text-white mb-2 flex items-center gap-2"><Presentation size={20}/> Machine Learning & Dashboards</h3>
                <p className="text-slate-400 leading-relaxed">Built predictive Random Forest classifiers to predict uninstalls and assembled this interactive React/Recharts dashboard leveraging ShadCN UI components for visual storytelling.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
