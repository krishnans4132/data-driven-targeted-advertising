import pandas as pd

with open('insights.txt', 'w') as f:
    f.write("--- Raw Survey (primary_dataset.csv) ---\n")
    pri = pd.read_csv("data/final/primary_dataset.csv")
    f.write(f"Shape: {pri.shape}\n")
    
    f.write("\n--- Raw Secondary (secondary_ads_dataset.csv) ---\n")
    sec = pd.read_csv("data/final/secondary_ads_dataset.csv", usecols=["rating", "ad_mentioned"])
    f.write(f"Shape: {sec.shape}\n")
    mentions = sec["ad_mentioned"].sum()
    f.write(f"Ad Mentions: {mentions} ({mentions/len(sec)*100:.1f}%)\n")
    
    f.write("\n--- Dashboard Processed Secondary (dashboard_dataset.csv) ---\n")
    dash_sec = pd.read_csv("dashboard/dashboard_dataset.csv")
    f.write(f"Shape: {dash_sec.shape}\n")
    f.write(f"Mean Rating without Ads: {dash_sec[dash_sec['ad_mentioned']==False]['rating'].mean():.2f}\n")
    f.write(f"Mean Rating with Ads: {dash_sec[dash_sec['ad_mentioned']==True]['rating'].mean():.2f}\n")
    
    f.write("\n--- Dashboard Processed Survey (dashboard_dataset_survey.csv) ---\n")
    dash_surv = pd.read_csv("dashboard/dashboard_dataset_survey.csv")
    f.write(f"Shape: {dash_surv.shape}\n")
    if "afi_score" in dash_surv.columns:
        f.write(f"Mean AFI Score: {dash_surv['afi_score'].mean():.2f}\n")
        f.write(f"Min AFI Score: {dash_surv['afi_score'].min():.2f}, Max: {dash_surv['afi_score'].max():.2f}\n")
