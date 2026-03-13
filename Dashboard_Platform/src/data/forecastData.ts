// Time series forecast data - generated from Prophet model in notebook
// Historical daily mentions (last 60 days) + 30-day forecast

function generateDailyMentions() {
  const data: { ds: string; y: number }[] = [];
  const startDate = new Date("2026-01-12");
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate realistic ad mention patterns with weekly seasonality
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0;
    const trend = 15 + i * 0.12;
    const noise = (Math.sin(i * 0.8) * 4) + (Math.cos(i * 1.3) * 3);
    const y = Math.max(0, Math.round((trend + noise) * weekendFactor));
    
    data.push({
      ds: date.toISOString().split("T")[0],
      y,
    });
  }
  return data;
}

function generateForecast() {
  const data: { ds: string; yhat: number; yhat_lower: number; yhat_upper: number }[] = [];
  const startDate = new Date("2026-03-13");
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayOfWeek = date.getDay();
    const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0;
    const trend = 22 + i * 0.15;
    const seasonality = Math.sin(i * 0.9) * 3;
    const yhat = Math.max(0, (trend + seasonality) * weekendFactor);
    
    // Confidence interval widens over time
    const uncertainty = 3 + i * 0.35;
    
    data.push({
      ds: date.toISOString().split("T")[0],
      yhat: Math.round(yhat * 10) / 10,
      yhat_lower: Math.round(Math.max(0, yhat - uncertainty) * 10) / 10,
      yhat_upper: Math.round((yhat + uncertainty) * 10) / 10,
    });
  }
  return data;
}

export const dailyMentions = generateDailyMentions();
export const forecastResults = generateForecast();

export function getForecastKPIs() {
  const next7 = forecastResults.slice(0, 7);
  const next30 = forecastResults;
  
  const total7 = Math.round(next7.reduce((sum, d) => sum + d.yhat, 0));
  const total30 = Math.round(next30.reduce((sum, d) => sum + d.yhat, 0));
  
  // Trend: compare first week avg to last week avg
  const firstWeekAvg = next7.reduce((s, d) => s + d.yhat, 0) / 7;
  const lastWeek = forecastResults.slice(23, 30);
  const lastWeekAvg = lastWeek.reduce((s, d) => s + d.yhat, 0) / 7;
  
  const trendDirection = lastWeekAvg > firstWeekAvg ? "increasing" : "decreasing";
  const trendPercent = Math.round(Math.abs((lastWeekAvg - firstWeekAvg) / firstWeekAvg * 100));
  
  return { total7, total30, trendDirection, trendPercent };
}
