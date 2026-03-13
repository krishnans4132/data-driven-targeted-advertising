import { useQuery } from "@tanstack/react-query";
import { loadSurveyData } from "@/lib/surveyData";

export function useSurveyData() {
  return useQuery({
    queryKey: ["survey-data"],
    queryFn: loadSurveyData,
    staleTime: Infinity,
  });
}
