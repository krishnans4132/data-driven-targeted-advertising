import { useQuery } from "@tanstack/react-query";

export interface SecondaryData {
  overview: {
    totalReviews: number;
    totalAdMentions: number;
    adMentionRate: string;
  };
  sentimentDistribution: { name: string; value: number; fill: string }[];
  adSentimentDistribution: { name: string; value: number; fill: string }[];
  categoryMetrics: {
    name: string;
    totalReviews: number;
    adMentions: number;
    adMentionRate: number;
    avgRatingAll: number;
    avgRatingWithAds: number | null;
    avgRatingWithoutAds: number | null;
    ratingDrop: number;
    sentimentDistribution: { name: string; value: number; fill: string }[];
    adSentimentDistribution: { name: string; value: number; fill: string }[];
  }[];
  continentMetrics: {
    name: string;
    totalReviews: number;
    adMentions: number;
    adMentionRate: number;
    avgRatingAll: number;
    avgRatingWithAds: number | null;
    avgRatingWithoutAds: number | null;
    ratingDrop: number;
  }[];
  appMetrics: {
    name: string;
    totalReviews: number;
    adMentions: number;
    adMentionRate: number;
    avgRatingAll: number;
    avgRatingWithAds: number | null;
    avgRatingWithoutAds: number | null;
    ratingDrop: number;
  }[];
}

async function fetchSecondaryData(): Promise<SecondaryData> {
  const res = await fetch("/data/secondary_aggregated.json");
  if (!res.ok) throw new Error("Failed to load secondary data");
  return res.json();
}

export function useSecondaryData() {
  return useQuery({
    queryKey: ["secondary-data"],
    queryFn: fetchSecondaryData,
    staleTime: Infinity,
  });
}
