import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Zap, 
  Smile, 
  Frown, 
  XOctagon, 
  Info,
  Clock,
  Layout,
  CalendarDays,
  Activity
} from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface AFIPrediction {
  ads_interrupt_usage_score: number;
  ads_cause_frustration_score: number;
  ads_reduce_enjoyment_score: number;
  ads_close_app_score: number;
  afi_score: number;
}

export default function AFIPredictorPage() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [inputs, setInputs] = useState({
    screen_time: "4–6 hours",
    ad_frequency: "Often",
    frequent_ad_format: "Unskippable ads",
    most_annoying_ad_time: "Evening"
  });
  const [prediction, setPrediction] = useState<AFIPrediction | null>(null);

  // Fetch valid options on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/afi/options`)
      .then(res => res.json())
      .then(data => setOptions(data.categorical_options))
      .catch(err => console.error("Error fetching options:", err));
  }, []);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/afi/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      if (data.status === "success") {
        setPrediction(data.predictions);
      }
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAfiColor = (score: number) => {
    if (score >= 4) return "text-destructive";
    if (score >= 3) return "text-yellow-500";
    return "text-accent";
  };

  const getAfiLabel = (score: number) => {
    if (score >= 4) return "Critical Fatigue";
    if (score >= 3) return "Elevated Risk";
    return "Optimal Experience";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Multi-Score AFI Predictor</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Predict core sentiment scores and the aggregate Ad Fatigue Index (AFI) using our high-precision Multi-Output Random Forest model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <Card className="glass-card lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              Behavioral Inputs
            </CardTitle>
            <CardDescription>Configure user behavior context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Screen Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Screen Time (Daily)
                </label>
                <Select
                  value={inputs.screen_time}
                  onValueChange={(v) => setInputs(prev => ({ ...prev, screen_time: v }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select screen time" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.screen_time?.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ad Frequency */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Ad Encounter Frequency
                </label>
                <Select
                  value={inputs.ad_frequency}
                  onValueChange={(v) => setInputs(prev => ({ ...prev, ad_frequency: v }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.ad_frequency?.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Frequent Format */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layout className="h-4 w-4" /> Primary Ad Format
                </label>
                <Select
                  value={inputs.frequent_ad_format}
                  onValueChange={(v) => setInputs(prev => ({ ...prev, frequent_ad_format: v }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.frequent_ad_format?.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Annoying Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> Most Intrusive Time
                </label>
                <Select
                  value={inputs.most_annoying_ad_time}
                  onValueChange={(v) => setInputs(prev => ({ ...prev, most_annoying_ad_time: v }))}
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.most_annoying_ad_time?.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full glow-primary font-bold" 
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? "Analyzing Context..." : "Run ML Prediction"}
            </Button>
          </CardContent>
        </Card>

        {/* Prediction Display */}
        <div className="lg:col-span-2 space-y-6">
          {!prediction ? (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-card/20 opacity-60">
              <Brain className="h-16 w-16 text-muted-foreground mb-4 animate-pulse" />
              <p className="text-lg font-medium">Ready for Inference</p>
              <p className="text-sm text-muted-foreground">Select user behavior context and run the model</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in duration-300">
              {/* Main Gauge */}
              <Card className="glass-card stat-gradient shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Brain className="h-40 w-40" />
                </div>
                <CardContent className="p-8 pt-10">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all opacity-0 group-hover:opacity-100"></div>
                      <h4 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">Predicted AFI Score</h4>
                      <div className={`text-7xl font-black mt-2 tabular-nums ${getAfiColor(prediction.afi_score)}`}>
                        {prediction.afi_score}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold border-2 ${getAfiColor(prediction.afi_score)} bg-background`}>
                      {getAfiLabel(prediction.afi_score)}
                    </Badge>
                  </div>

                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Score Item 1 */}
                    <ScoreMetric 
                      label="Usage Interruption" 
                      score={prediction.ads_interrupt_usage_score} 
                      icon={<Zap className="h-4 w-4" />}
                      description="Impact on active task execution"
                    />
                    {/* Score Item 2 */}
                    <ScoreMetric 
                      label="Frustration Level" 
                      score={prediction.ads_cause_frustration_score} 
                      icon={<Frown className="h-4 w-4" />}
                      description="Reported emotional stress trigger"
                    />
                    {/* Score Item 3 */}
                    <ScoreMetric 
                      label="Enjoyment Reduction" 
                      score={prediction.ads_reduce_enjoyment_score} 
                      icon={<Smile className="h-4 w-4" />}
                      description="Erosion of core app value/fun"
                    />
                    {/* Score Item 4 */}
                    <ScoreMetric 
                      label="Session Abandonment" 
                      score={prediction.ads_close_app_score} 
                      icon={<XOctagon className="h-4 w-4" />}
                      description="Likelihood of immediate app exit"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed">
                  <strong>ML Insight:</strong> These predictions are derived from 411 unique user survey responses. Scores above 3.5 generally correlate with a significant increase (68%+) in churn risk.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreMetric({ label, score, icon, description }: { label: string, score: number, icon: React.ReactNode, description: string }) {
  const percentage = (score / 5) * 100;
  
  return (
    <div className="space-y-3 p-4 rounded-xl bg-background/40 border border-border/40 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-primary">{icon}</span>
          {label}
        </div>
        <span className="font-bold tabular-nums text-lg">{score}/5.0</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-[11px] text-muted-foreground leading-tight italic">{description}</p>
    </div>
  );
}
