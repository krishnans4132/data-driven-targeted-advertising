// List of categories for Intake Form
export const APP_CATEGORIES = [
  "Gaming",
  "Social Media",
  "Video / OTT",
  "News / Reading",
  "Shopping / E-commerce",
  "Education",
  "Utility"
];

export const AD_FREQUENCIES = [
  "Rarely",
  "Sometimes",
  "Often",
  "Always"
];

export const AD_FORMATS = [
  "Banner ads",
  "Interstitial ads",
  "Rewarded video ads",
  "Skippable video ads",
  "Unskippable ads",
  "Pop-over ads",
  "Auto-play ads",
  "Native ads",
  "Sponsored content",
  "Checkout interstitial ads",
  "Mid-lesson video ads",
  "Banner refresh ads"
];

export const LIKERT_OPTIONS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree"
];

export const AGE_GROUPS = [
  "Under 18",
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55+"
];

export const OCCUPATIONS = [
  "Student",
  "Salaried",
  "Self-employed",
];

export const GENDERS = ["Male", "Female", "Other"];

export const SMARTPHONE_TYPES = ["Android", "iOS", "Other"];

export const SCREEN_TIMES = [
  "Less than 2 hours",
  "2–4 hours",
  "4–6 hours",
  "More than 6 hours"
];

export const FORMAT_TOLERANCES = [
  { name: "Skippable video ads", votes: 112, level: "High" },
  { name: "Rewarded ads", votes: 92, level: "High" },
  { name: "Banner ads", votes: 77, level: "Moderate" },
  { name: "Sponsored content", votes: 68, level: "Moderate" },
  { name: "Pop-over ads", votes: 45, level: "Low" },
  { name: "Unskippable ads", votes: 20, level: "Critical" }
];

export const FORMAT_TOLERANCE = [
  { format: "Rewarded video ads",    tolerance: 78, level: "green" },
  { format: "Skippable video ads",   tolerance: 61, level: "green" },
  { format: "Banner ads",            tolerance: 38, level: "amber" },
  { format: "Sponsored posts",       tolerance: 30, level: "amber" },
  { format: "Interstitial / pop-up", tolerance: 14, level: "red"   },
  { format: "Unskippable video ads", tolerance:  9, level: "red"   },
];

export const CHURN_RISK_MAP: Record<string, Record<string, number>> = {
  "High Fatigue": {
    "Gaming": 71, "Video / OTT": 71, "Social Media": 71,
    "News / Reading": 58, "Education": 58,
    "Shopping / E-commerce": 41, "Utility / Tools": 41,
  },
  "Moderate Fatigue": {
    "Gaming": 38, "Video / OTT": 36, "Social Media": 34,
    "News / Reading": 31, "Education": 30,
    "Shopping / E-commerce": 29, "Utility / Tools": 28,
  },
  "High Tolerance": {
    "Gaming": 22, "Video / OTT": 20, "Social Media": 18,
    "News / Reading": 16, "Education": 15,
    "Shopping / E-commerce": 14, "Utility / Tools": 12,
  },
};

export const WTP_ADFREE_MAP: Record<string, number> = {
  "Gaming": 42, "Video / OTT": 38, "Social Media": 33,
  "News / Reading": 29, "Education": 31,
  "Shopping / E-commerce": 24, "Utility / Tools": 19,
};
