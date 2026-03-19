export interface AFIPredictionInput {
  age_group: string;
  occupation: string;
  gender: string;
  smartphone_type: string;
  screen_time: string;
  most_used_category: string;
  ad_frequency: string;
  frequent_ad_format: string;
  most_excessive_ad_category: string;
  ads_interrupt_usage: string;
  ads_cause_frustration: string;
  ads_reduce_enjoyment: string;
  ads_close_app: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface AFIPredictionOutput {
  afi_score: number;
  afi_level: string;
  top_features: FeatureImportance[];
  model_used: string;
  r2_score: number;
}

export interface SegmentInput {
  ads_interrupt_usage_score: number;
  ads_cause_frustration_score: number;
  ads_reduce_enjoyment_score: number;
  ads_close_app_score: number;
  ad_fatigue_index: number;
}

export interface PCA_Coords {
  x: number;
  y: number;
}

export interface ClusterCharacteristics {
  avg_afi: number;
  uninstall_rate: string;
  wtp_adfree: string;
}

export interface SegmentOutput {
  cluster_id: number;
  segment_name: string;
  segment_description: string;
  pca_coordinates: PCA_Coords;
  cluster_characteristics: ClusterCharacteristics;
}

export interface ForecastData {
  date: string;
  predicted_complaints: number;
  lower: number;
  upper: number;
}

export interface ForecastOutput {
  category: string;
  forecast: ForecastData[];
  trend: string;
  weekly_peak_day: string;
  summary: string;
}

export interface CategoryBenchmarks {
  avg_AFI: number;
  complaint_rate: string;
  uninstall_rate: string;
  wtp_adfree: string;
  worst_format: string;
}
