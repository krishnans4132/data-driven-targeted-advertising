# A Business Analytics Study of Advertisement Fatigue in Mobile Applications

##  Project Overview
This project investigates **advertisement fatigue in mobile applications** using a combination of **primary survey data** and **secondary user review analysis**.

The study aims to understand how frequent advertisements affect user experience, including **frustration levels, uninstall behavior, and willingness to pay for ad‑free versions**.

By combining **survey insights with text‑mined app review data**, the project provides **data‑driven recommendations for optimizing advertising strategies in mobile applications**.

---

## Objectives

- Measure **advertisement fatigue** using structured survey data  
- Identify **app categories that generate the highest ad frustration**  
- Analyze **user uninstall behavior due to advertisements**  
- Evaluate **user tolerance toward different advertisement formats**  
- Perform **sentiment analysis on real app store reviews**  
- Provide **business recommendations for improving ad strategy and user retention**

---

## Data Sources

### Dataset 1 — Survey Dataset (Primary Data)

- Collected using **Google Forms**
- Anonymous and structured responses
- Mostly closed‑ended questions for quantitative analysis
- Target responses: **1000**
- Current responses: **422**

Form link:  
https://forms.gle/xwqqxnVzqaRNMo6Q9

Survey variables include:

- Age group  
- Daily screen time  
- Most used app category  
- Ad irritation level  
- App uninstall due to ads  
- Preferred ad formats  
- Willingness to pay for ad‑free apps  

---

### Dataset 2 — App Review Sentiment Dataset (Secondary Data)

Collected through **Google Play Store web scraping** and processed using a **Natural Language Processing (NLP) pipeline**.

Pipeline:

```
Web Scraping
↓
Text Cleaning
↓
Keyword Detection
↓
Sentiment Analysis
```

Key fields:

- app_name  
- category  
- country  
- rating  
- review_text  
- clean_text  
- ad_mentioned  
- ad_keyword  
- sentiment  

This dataset captures **real user complaints and opinions regarding in‑app advertisements**.

---

## Tools and Technologies

**Python**
- Pandas  
- NumPy  
- NLTK  
- TextBlob  

**Data Visualization**
- Matplotlib  
- Seaborn  

**Development**
- Jupyter Notebook  
- Git / GitHub  

**Data Handling**
- Excel (initial survey cleaning)

---

## Analysis Performed

### Survey Dataset
- Descriptive statistics  
- Cross‑tabulation analysis  
- Advertisement fatigue index computation  
- Segment analysis (age groups, screen time, app usage category)  
- Uninstall behavior analysis  

### Text‑Mined Review Dataset
- Advertisement keyword detection  
- Sentiment classification (positive / neutral / negative)  
- Category‑wise ad complaint analysis  
- Rating vs advertisement complaint correlation  
- Global review sentiment trends

---

## Visualization and Insights

The analysis includes multiple visualizations such as:

- Sentiment distribution across app categories  
- Ad complaint frequency by category  
- Rating vs ad mention analysis  
- Survey‑based advertisement fatigue metrics  
- User uninstall behavior patterns  

These visualizations help identify **patterns in user tolerance toward mobile advertisements**.

---

## Key Insights *(To be updated after analysis)*

- Highest advertisement fatigue observed in **[category]**
- **X% of users** reported uninstalling apps due to excessive ads
- **Rewarded advertisements** are the most tolerated ad format
- Advertisement complaints are highest in **[app category]**
- Users with higher screen time show **greater willingness to pay for ad‑free versions**

---

## Ethical Considerations

- No personal identifying information was collected  
- All responses are **anonymous and voluntary**  
- Data is analyzed **only in aggregated form**  
- Used strictly for **academic and research purposes**

---

## 📁 Project Structure

```
project_root/

data/
   survey/
      survey_dataset.csv

   raw/
      playstore_reviews_raw.csv

   processed/
      reviews_cleaned.csv

   final/
      secondary_ads_dataset.csv

notebooks/
   01_web_scraping.ipynb
   02_text_cleaning.ipynb
   03_text_mining_sentiment.ipynb
   04_analysis_and_visualization.ipynb

dashboard/
   dashboard_dataset.csv
```

---

## 📎 Author

**Krishnan S.**  
Business Analytics Project
