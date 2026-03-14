import { useState } from "react";
import { Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  screenTimeMap,
  adFrequencyMap,
  adFormatMap,
  adTimeMap,
  predictLinearRegression,
  predictRandomForest,
} from "@/data/modelData";

interface PredictionResult {
  linear: number;
  randomForest: number;
}

const AdFatiguePrediction = () => {
  const [screenTime, setScreenTime] = useState("4–6 hours");
  const [adFrequency, setAdFrequency] = useState("Often");
  const [adFormat, setAdFormat] = useState("Video ads");
  const [adTime, setAdTime] = useState("Evening");
  const [interruptScore, setInterruptScore] = useState(3);
  const [frustrationScore, setFrustrationScore] = useState(3);
  const [enjoymentScore, setEnjoymentScore] = useState(3);
  const [closeAppScore, setCloseAppScore] = useState(3);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handlePredict = () => {
    const lr = predictLinearRegression(interruptScore, frustrationScore, enjoymentScore, closeAppScore);
    const rf = predictRandomForest(
      interruptScore, frustrationScore, enjoymentScore, closeAppScore,
      screenTimeMap[screenTime], adFrequencyMap[adFrequency],
      adFormatMap[adFormat], adTimeMap[adTime],
    );
    setResult({ linear: lr, randomForest: rf });
  };

  const getFatigueLevel = (score: number) => {
    if (score <= 2) return { label: "Low", color: "text-accent" };
    if (score <= 3.5) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "High", color: "text-destructive" };
  };

  return (
    <section className="glass-card glow-border p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold font-mono text-foreground">ML Prediction — Ad Fatigue</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Screen Time</Label>
          <Select value={screenTime} onValueChange={setScreenTime}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(screenTimeMap).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Ad Frequency</Label>
          <Select value={adFrequency} onValueChange={setAdFrequency}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(adFrequencyMap).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Frequent Ad Format</Label>
          <Select value={adFormat} onValueChange={setAdFormat}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(adFormatMap).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">Most Annoying Ad Time</Label>
          <Select value={adTime} onValueChange={setAdTime}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.keys(adTimeMap).map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Ads Interrupt Usage", value: interruptScore, setter: setInterruptScore },
          { label: "Ads Cause Frustration", value: frustrationScore, setter: setFrustrationScore },
          { label: "Ads Reduce Enjoyment", value: enjoymentScore, setter: setEnjoymentScore },
          { label: "Ads Close App", value: closeAppScore, setter: setCloseAppScore },
        ].map(({ label, value, setter }) => (
          <div key={label} className="space-y-3">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">{label}</Label>
            <div className="flex items-center gap-3">
              <Slider
                min={1} max={5} step={1}
                value={[value]}
                onValueChange={([v]) => setter(v)}
                className="flex-1"
              />
              <span className="font-mono text-primary font-bold w-6 text-right">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handlePredict} className="w-full md:w-auto gap-2 font-mono">
        <Zap className="w-4 h-4" />
        Predict Ad Fatigue
      </Button>

      {result && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-mono text-xs uppercase">Model</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-mono text-xs uppercase">Predicted Fatigue Index</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-mono text-xs uppercase">Level</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Linear Regression", value: result.linear },
                { name: "Random Forest", value: result.randomForest },
              ].map(({ name, value }) => {
                const level = getFatigueLevel(value);
                return (
                  <tr key={name} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-foreground">{name}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-primary text-lg">
                      {value.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-semibold ${level.color}`}>
                      {level.label}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdFatiguePrediction;
