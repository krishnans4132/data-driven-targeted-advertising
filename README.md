# A Business Analytics Study of Advertisement Fatigue in Mobile Applications

## Project Overview

This project investigates **advertisement fatigue in mobile applications** using a combination of **primary survey data** and **secondary user review analysis**.

The study aims to understand how frequent advertisements affect user experience, including **frustration levels, uninstall behavior, and willingness to pay for ad‑free versions**.

By combining **survey insights with text‑mined app review data**, the project provides **data‑driven recommendations for optimizing advertising strategies in mobile applications**.

---

## Objectives

- Measure **advertisement fatigue** using structured survey data and a computed Ad Fatigue Index
- Identify **app categories that generate the highest ad frustration**
- Analyze **user uninstall behavior due to advertisements**
- Evaluate **user tolerance toward different advertisement formats**
- Perform **sentiment analysis on real Google Play Store reviews**
- Predict Ad Fatigue Index using **machine learning regression models**
- Segment users into behavioral groups using **K-Means clustering with PCA visualization**
- Forecast **future advertisement complaint trends** using time-series analysis
- Provide **business recommendations for improving ad strategy and user retention**

---

## Data Sources

### Dataset 1 — Survey Dataset (Primary Data)

- Collected using **Google Forms**
- Anonymous and structured responses
- Mostly closed‑ended questions for quantitative analysis
- Target responses: **1000**
- Final cleaned responses: **411**

Form link:
https://forms.gle/xwqqxnVzqaRNMo6Q9

Survey variables include:

- Age group, gender, occupation, smartphone type
- Daily screen time and most used app category
- Ad frequency and format exposure
- Ad irritation, frustration, and enjoyment reduction levels
- App closure and uninstall behavior due to ads
- Preferred/tolerated ad formats and most annoying ad timing
- Willingness to pay for ad‑free apps

---

### Dataset 2 — App Review Sentiment Dataset (Secondary Data)

Collected through **Google Play Store web scraping** using `google-play-scraper` and processed using a **Natural Language Processing (NLP) pipeline**.

Pipeline:

```
Web Scraping (google-play-scraper)
↓
Text Cleaning (lowercasing, stopword removal, punctuation stripping)
↓
Keyword Detection (curated ad-related vocabulary)
↓
Sentiment Analysis (TextBlob polarity scoring)
```

Key fields:

- `app_name`, `category`, `country`, `continent`
- `rating`, `review_text`, `clean_text`
- `ad_mentioned` (binary flag), `ad_keyword`, `sentiment`

This dataset captures **real user complaints and opinions regarding in‑app advertisements**.

---

## Tools and Technologies

**Python Libraries**
- Pandas, NumPy
- NLTK, TextBlob
- Scikit-learn (regression, K-Means, PCA, StandardScaler)
- Prophet (time-series forecasting)
- Matplotlib, Seaborn, WordCloud
- google-play-scraper, tqdm

**Development**
- Jupyter Notebook
- Git / GitHub

---

## Analysis Performed

### Survey Dataset
- Data preprocessing and column standardization
- Advertisement Fatigue Index (AFI) computation from Likert-scale responses
- Descriptive statistics and cross‑tabulation analysis
- Segment analysis (age groups, screen time, app usage category)
- Uninstall behavior analysis
- 30+ EDA visualizations covering demographics, ad exposure, and fatigue patterns

### Text‑Mined Review Dataset
- Advertisement keyword detection
- Sentiment classification (positive / neutral / negative)
- Category‑wise ad complaint analysis
- Rating vs advertisement complaint correlation
- Global review sentiment trends by continent

### Machine Learning — Ad Fatigue Prediction (`08_Ad Fatigue Prediction.ipynb`)
- Label encoding and feature correlation analysis
- Linear Regression, Decision Tree Regressor, Random Forest Regressor
- Model evaluation: MAE, RMSE, R²
- Random Forest feature importance for interpretability

### User Segmentation — K-Means Clustering (`09_k-clustering.ipynb`)
- 5-feature clustering: 4 fatigue scores + Ad Fatigue Index
- Elbow Method (k=1..10) for optimal cluster selection → k=3
- PCA dimensionality reduction for 2D cluster visualization
- Second analysis with reduced 3-feature set for robustness validation

### Time-Series Forecasting (`07_Time-Series Forecasting.ipynb`)
- Daily aggregation of ad mention counts from review dataset
- Prophet model with daily and weekly seasonality
- 30-day hold-out evaluation (MAE, RMSE)
- Extended model with average sentiment as external regressor

---

## Visualization and Insights

The analysis includes visualizations such as:

- Sentiment distribution across app categories
- Ad complaint frequency by category and by continent
- Rating vs ad mention analysis
- Word clouds of review text
- Ad Fatigue Index distribution histograms and box plots
- K-Means cluster scatter plots (PCA-reduced)
- Prophet forecast plots with trend and seasonality decomposition
- Random Forest feature importance bar chart

---

## 🚀 AdIntel Machine Learning Dashboard

In addition to the static analysis, this repository includes a **production-ready ML suite** for real-time predictions:

### 1. Multi-Score AFI Predictor (Primary Data)
*   **Input**: User behavioral context (Screen time, Ad frequency, Format, Timing).
*   **Output**: Predicts 4 specific sentiment scores (Interruption, Frustration, Enjoyment, Abandonment) and the aggregate Ad Fatigue Index.
*   **Architecture**: High-precision `MultiOutputRegressor` trained on 411 survey responses.

### 2. Rating Risk Predictor (Secondary Data)
*   **Input**: App Category and Global Region.
*   **Output**: Predicted app star rating (1.0 - 5.0).
*   **Architecture**: `RandomForestRegressor` trained on 225k+ app reviews.

---

## Key Insights

- **Game and Entertainment** categories show the highest ad complaint frequency
- A significant proportion of users have **uninstalled apps due to excessive advertisements**
- **Rewarded video ads** are the most tolerated format; interstitial ads are the most disruptive
- Users with higher screen time display **greater Ad Fatigue Index scores**
- **Younger users (18–24)** report higher advertisement fatigue than older demographics
- Three distinct user segments were identified: **High Tolerance**, **Moderate Fatigue**, and **High Fatigue** users
- The Random Forest model identifies **ad interruption frequency** and **ad format type** as the top predictors of fatigue

---

## Ethical Considerations

- No personal identifying information was collected
- All responses are **anonymous and voluntary**
- Data is analyzed **only in aggregated form**
- Used strictly for **academic and research purposes**
- Google Play Store reviews are publicly accessible content

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
      survey_cleaned.csv
   final/
      secondary_ads_dataset.csv

notebook/
   01_web_scraping.ipynb
   02_text_cleaning.ipynb
   03_text_mining_sentiment.ipynb
   04_analysis_and_visualization.ipynb
   05_data_preprocessing_survey_dataset.ipynb
   06_survey_eda.ipynb
   07_Time-Series Forecasting.ipynb
   08_Ad Fatigue Prediction.ipynb
   09_k-clustering.ipynb

dashboard/
   dashboard_dataset.csv
   dashboard_dataset_survey.csv

Dashboard_Platform/          ← React + Vite + TypeScript interactive dashboard

reports/                     ← Saved chart exports (PNG)
   Sentiment Distribution of App Reviews.png
   Sentiment Distribution by App Category.png
   Ad Mentions in Reviews.png
   Ad Complaints by App Category.png
   Ad Complaints by Continent.png

report.tex                   ← Full LaTeX project report
requirements.txt
```

---

## 📎 Authors

**Krishnan S.**
**Rachit Anand**
**Abishek R**

Business Analytics Project — Amrita Vishwa Vidyapeetham, Coimbatore

## Running Locally

AdIntel uses a **Live Training Architecture**. The backend automatically trains its models on every startup using the latest data in `/data/final/`.

### 1. Start Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*API docs available at `http://localhost:8000/docs`.*

### 2. Start Frontend (React + Vite)
```bash
cd Dashboard_Platform
npm install
npm run dev
```
*Dashboard accessible at `http://localhost:8080` (or `http://localhost:5173`).*
