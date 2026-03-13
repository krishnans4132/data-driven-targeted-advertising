import Papa from "papaparse";

export interface SurveyRow {
  age_group: string;
  occupation: string;
  gender: string;
  smartphone_type: string;
  screen_time: string;
  daily_app_categories: string;
  most_used_category: string;
  ad_frequency: string;
  frequent_ad_format: string;
  most_excessive_ad_category: string;
  ads_interrupt_usage: string;
  ads_cause_frustration: string;
  ads_reduce_enjoyment: string;
  ads_close_app: string;
  ads_uninstall_app: string;
  tolerated_ad_format: string;
  most_annoying_ad_time: string;
  pay_for_adfree: string;
  ads_interrupt_usage_score: number;
  ads_cause_frustration_score: number;
  ads_reduce_enjoyment_score: number;
  ads_close_app_score: number;
  ad_fatigue_index: number;
}

export async function loadSurveyData(): Promise<SurveyRow[]> {
  const res = await fetch("/data/survey.csv");
  const text = await res.text();
  const result = Papa.parse<SurveyRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return result.data;
}

export function countBy(data: SurveyRow[], key: keyof SurveyRow): Record<string, number> {
  const counts: Record<string, number> = {};
  data.forEach((row) => {
    const val = String(row[key] ?? "Unknown");
    counts[val] = (counts[val] || 0) + 1;
  });
  return counts;
}

export function averageBy(data: SurveyRow[], key: keyof SurveyRow, groupKey: keyof SurveyRow) {
  const groups: Record<string, { sum: number; count: number }> = {};
  data.forEach((row) => {
    const group = String(row[groupKey] ?? "Unknown");
    const val = Number(row[key]);
    if (!isNaN(val)) {
      if (!groups[group]) groups[group] = { sum: 0, count: 0 };
      groups[group].sum += val;
      groups[group].count += 1;
    }
  });
  return Object.entries(groups).map(([name, { sum, count }]) => ({
    name,
    value: Math.round((sum / count) * 100) / 100,
  }));
}

export function toChartData(counts: Record<string, number>) {
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function countMultiValue(data: SurveyRow[], key: keyof SurveyRow): Record<string, number> {
  const counts: Record<string, number> = {};
  data.forEach((row) => {
    const val = String(row[key] ?? "");
    val.split(",").forEach((v) => {
      const trimmed = v.trim();
      if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1;
    });
  });
  return counts;
}
