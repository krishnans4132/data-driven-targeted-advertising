import { useState } from 'react';
import { 
  AFIPredictionInput, 
  AFIPredictionOutput, 
  SegmentInput, 
  SegmentOutput, 
  ForecastOutput,
  CategoryBenchmarks
} from '../types/intelligence';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function useIntelligence() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prediction, setPrediction] = useState<AFIPredictionOutput | null>(null);
  const [segment, setSegment] = useState<SegmentOutput | null>(null);
  const [forecast, setForecast] = useState<ForecastOutput | null>(null);
  const [benchmarks, setBenchmarks] = useState<CategoryBenchmarks | null>(null);

  const analyze = async (input: AFIPredictionInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Predict AFI
      const afiRes = await fetch(`${API_BASE_URL}/api/predict-afi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!afiRes.ok) throw new Error("Failed to predict AFI");
      const afiData: AFIPredictionOutput = await afiRes.json();
      setPrediction(afiData);

      // 2. Predict Segment based on user input and predicted AFI
      // Map Likert -> Scores (1-5) safely
      const likertMap: Record<string, number> = {
        "Strongly disagree": 1,
        "Disagree": 2,
        "Neutral": 3,
        "Agree": 4,
        "Strongly agree": 5
      };

      const segPayload: SegmentInput = {
        ads_interrupt_usage_score: likertMap[input.ads_interrupt_usage] || 3,
        ads_cause_frustration_score: likertMap[input.ads_cause_frustration] || 3,
        ads_reduce_enjoyment_score: likertMap[input.ads_reduce_enjoyment] || 3,
        ads_close_app_score: likertMap[input.ads_close_app] || 3,
        ad_fatigue_index: afiData.afi_score
      };

      const segRes = await fetch(`${API_BASE_URL}/api/segment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(segPayload)
      });
      if (!segRes.ok) throw new Error("Failed to segment user");
      const segData: SegmentOutput = await segRes.json();
      setSegment(segData);

      // 3. Forecast
      const forecastEncode = encodeURIComponent(input.most_used_category);
      const foreRes = await fetch(`${API_BASE_URL}/api/forecast?category=${forecastEncode}&days=30`);
      if (!foreRes.ok) throw new Error("Failed to load forecast");
      const foreData: ForecastOutput = await foreRes.json();
      setForecast(foreData);

      // 4. Benchmarks
      const benchRes = await fetch(`${API_BASE_URL}/api/category-benchmarks?category=${forecastEncode}`);
      if (!benchRes.ok) throw new Error("Failed to load benchmarks");
      const benchData: CategoryBenchmarks = await benchRes.json();
      setBenchmarks(benchData);

    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPrediction(null);
    setSegment(null);
    setForecast(null);
    setBenchmarks(null);
    setError(null);
  };

  return {
    analyze,
    reset,
    isLoading,
    error,
    prediction,
    segment,
    forecast,
    benchmarks
  };
}
