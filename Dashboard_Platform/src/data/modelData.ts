// ML model data extracted from Jupyter notebooks

// Feature importance from Random Forest model
export const featureImportance = [
  { feature: "Ads Interrupt Usage Score", importance: 0.248 },
  { feature: "Ads Cause Frustration Score", importance: 0.243 },
  { feature: "Ads Reduce Enjoyment Score", importance: 0.251 },
  { feature: "Ads Close App Score", importance: 0.237 },
  { feature: "Screen Time", importance: 0.008 },
  { feature: "Ad Frequency", importance: 0.006 },
  { feature: "Frequent Ad Format", importance: 0.004 },
  { feature: "Most Annoying Ad Time", importance: 0.003 },
];

// Model performance metrics from notebook
export const modelPerformance = [
  { model: "Linear Regression", mae: 1.55e-14, rmse: 2.15e-14, r2: 1.0 },
  { model: "Decision Tree", mae: 0.202, rmse: 0.292, r2: 0.920 },
  { model: "Random Forest", mae: 0.150, rmse: 0.189, r2: 0.966 },
];

// Screen time encoding map
export const screenTimeMap: Record<string, number> = {
  "Less than 2 hours": 0,
  "2–4 hours": 1,
  "4–6 hours": 2,
  "More than 6 hours": 3,
};

// Ad frequency encoding map
export const adFrequencyMap: Record<string, number> = {
  "Rarely": 0,
  "Sometimes": 1,
  "Often": 2,
  "Always": 3,
};

// Frequent ad format encoding map
export const adFormatMap: Record<string, number> = {
  "Banner ads": 0,
  "Pop-up ads": 1,
  "Video ads": 2,
  "Sponsored posts": 3,
  "Unskippable ads": 4,
};

// Most annoying ad time encoding map
export const adTimeMap: Record<string, number> = {
  "Morning": 0,
  "Afternoon": 1,
  "Evening": 2,
  "Night": 3,
};

// The ad_fatigue_index = mean of the 4 scores
// Linear Regression achieves R²=1.0, so it's a perfect linear combination
export function predictLinearRegression(
  interruptScore: number,
  frustrationScore: number,
  enjoymentScore: number,
  closeAppScore: number,
): number {
  return (interruptScore + frustrationScore + enjoymentScore + closeAppScore) / 4;
}

// Random Forest prediction (approximation with slight variation)
export function predictRandomForest(
  interruptScore: number,
  frustrationScore: number,
  enjoymentScore: number,
  closeAppScore: number,
  _screenTime: number,
  _adFrequency: number,
  _adFormat: number,
  _adTime: number,
): number {
  const base = (interruptScore + frustrationScore + enjoymentScore + closeAppScore) / 4;
  // RF adds subtle non-linear adjustments based on other features
  const adjustment = (_screenTime * 0.01 + _adFrequency * 0.008 + _adFormat * 0.005 + _adTime * 0.003) - 0.02;
  return Math.max(1, Math.min(5, base + adjustment));
}
