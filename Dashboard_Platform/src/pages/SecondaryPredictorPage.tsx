import { useEffect, useState } from "react";
import { Star, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Prediction {
  category: string;
  continent: string;
  adMentioned: boolean;
  predictedRating: number;
}

type SeverityLevel = "High Risk" | "Moderate Risk" | "Low Risk";

function getSeverity(rating: number): { level: SeverityLevel; color: string; bg: string; bar: string; icon: React.ReactNode } {
  if (rating < 2.5) return { level: "High Risk",     color: "text-red-500",   bg: "bg-red-500/10 border-red-500/30",   bar: "bg-red-500",   icon: <TrendingDown className="w-4 h-4" /> };
  if (rating > 3.5) return { level: "Low Risk",      color: "text-green-500", bg: "bg-green-500/10 border-green-500/30", bar: "bg-green-500", icon: <TrendingUp className="w-4 h-4" /> };
  return               { level: "Moderate Risk", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30",  bar: "bg-amber-400", icon: <Minus className="w-4 h-4" /> };
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        return (
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-muted-foreground/30 absolute" fill="currentColor" />
            <div className="overflow-hidden absolute inset-0" style={{ width: `${fill * 100}%` }}>
              <Star className="w-5 h-5 text-amber-400" fill="currentColor" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function SecondaryPredictorPage() {
  const [predictions, setPredictions]   = useState<Prediction[]>([]);
  const [loadError,   setLoadError]     = useState(false);
  const [category,    setCategory]      = useState("");
  const [continent,   setContinent]     = useState("");
  const [hasAds,      setHasAds]        = useState(true);
  const [isLoading,   setIsLoading]    = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BACKEND_URL}/api/rating/all-predictions`)
      .then(r => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(data => {
        setPredictions(data);
        setIsLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setIsLoading(false);
      });
  }, []);

  const categories = [...new Set(predictions.map(p => p.category))].sort();
  const continents = [...new Set(predictions.map(p => p.continent))].sort();

  // Set defaults once data loads
  useEffect(() => {
    if (categories.length && !category) setCategory(categories[0]);
    if (continents.length && !continent) setContinent(continents[0]);
  }, [predictions]);

  const lookup = (cat: string, cont: string, ad: boolean) =>
    predictions.find(p => p.category === cat && p.continent === cont && p.adMentioned === ad);

  const current   = lookup(category, continent, hasAds);
  const withAds   = lookup(category, continent, true);
  const withoutAds = lookup(category, continent, false);

  const severity = current ? getSeverity(current.predictedRating) : null;

  // Comparison bar chart data  — all continents for selected category
  const comparisonData = continents.map(cont => ({
    continent: cont,
    withAds:    lookup(category, cont, true)?.predictedRating  ?? 0,
    withoutAds: lookup(category, cont, false)?.predictedRating ?? 0,
  }));

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-6xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-mono">Rating Risk Predictor</h2>
        <p className="text-muted-foreground mt-1">
          Random Forest model trained on <span className="font-semibold text-foreground">225K+ Google Play Store reviews</span>.
          Predicts the star rating impact of ads by category and region.
        </p>
      </div>

      {loadError && (
        <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
          Could not load <code>rating_predictions.json</code> — make sure the dev server is running and the file exists in <code>/public</code>.
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>Select app category, reviewer region, and ad presence to get a predicted star rating.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">App Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select category…" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Reviewer Region</Label>
              <Select value={continent} onValueChange={setContinent}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select continent…" /></SelectTrigger>
                <SelectContent>{continents.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Ad Mentioned in Review</Label>
              <div className="flex gap-2 h-10">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setHasAds(val)}
                    className={`flex-1 rounded-md border text-sm font-medium transition-all ${
                      hasAds === val
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-secondary hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {val ? "Yes — ads cited" : "No — no ad mention"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results row */}
      {current && severity && (
        <div className="grid md:grid-cols-3 gap-4">
          {/* Predicted Rating */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-widest font-normal">Predicted Rating</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 pb-6">
              <span className="text-6xl font-extrabold font-mono text-primary">{current.predictedRating.toFixed(2)}</span>
              <span className="text-muted-foreground text-sm">/5.00</span>
              <StarDisplay rating={current.predictedRating} />
            </CardContent>
          </Card>

          {/* Severity badge */}
          <Card className={`md:col-span-1 border ${severity.bg}`}>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest font-normal text-muted-foreground">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 pb-6">
              <div className={`flex items-center gap-2 text-2xl font-bold ${severity.color}`}>
                {severity.icon}
                {severity.level}
              </div>
              <div className="w-full mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>1.0</span><span>3.0</span><span>5.0</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${severity.bar}`}
                    style={{ width: `${((current.predictedRating - 1) / 4) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {severity.level === "High Risk" && "Ad presence is linked to very low ratings in this category/region."}
                {severity.level === "Moderate Risk" && "Ad presence has a moderate impact on ratings here."}
                {severity.level === "Low Risk" && "Ad presence has minimal negative effect on ratings here."}
              </p>
            </CardContent>
          </Card>

          {/* Ads vs No-Ads comparison */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest font-normal text-muted-foreground">Ads vs No-Ads Delta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pb-6">
              {[
                { label: "With Ads", value: withAds?.predictedRating ?? 0, color: "bg-red-500" },
                { label: "Without Ads", value: withoutAds?.predictedRating ?? 0, color: "bg-green-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold font-mono">{value.toFixed(2)} ⭐</span>
                  </div>
                  <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
              {withAds && withoutAds && (
                <p className="text-xs text-muted-foreground pt-1">
                  Δ <strong className="text-foreground">{Math.abs(withoutAds.predictedRating - withAds.predictedRating).toFixed(2)}</strong> star drop when ads are present in <strong className="text-foreground">{category}</strong> reviews from <strong className="text-foreground">{continent}</strong>.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison bar chart — all regions for this category */}
      {category && comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Regional Comparison — {category}</CardTitle>
            <CardDescription>Predicted rating with vs without ads across all reviewer regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Legend */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> With Ads</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Without Ads</span>
              </div>
              {comparisonData.map(({ continent: cont, withAds: wa, withoutAds: woa }) => (
                <div key={cont} className={`rounded-lg p-3 border ${cont === continent ? "border-primary/50 bg-primary/5" : "border-transparent"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold w-28 flex-shrink-0">{cont}</span>
                    {cont === continent && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold">Selected</span>}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20">With Ads</span>
                      <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(wa / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-red-500 w-8 text-right">{wa.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20">Without Ads</span>
                      <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(woa / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-green-500 w-8 text-right">{woa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Model info footer */}
      <div className="text-xs text-muted-foreground border border-border rounded-lg p-3 space-y-0.5">
        <p><span className="font-semibold text-foreground">Model:</span> Random Forest Regressor (n_estimators=100, random_state=42)</p>
        <p><span className="font-semibold text-foreground">Training data:</span> 225,273 Google Play Store reviews (secondary dataset)</p>
        <p><span className="font-semibold text-foreground">Features:</span> <code>category_enc</code>, <code>continent_enc</code>, <code>ad_flag</code> → target: <code>rating</code></p>
        <p><span className="font-semibold text-foreground">Notebook:</span> <code>notebook/10_rating_predictor.ipynb</code></p>
      </div>
    </div>
  );
}
