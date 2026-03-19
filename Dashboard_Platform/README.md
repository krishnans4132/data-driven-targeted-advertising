# AdIntel Platform – Advertising Analytics Dashboard

## Project Overview

AdIntel is a high-performance analytics dashboard designed to visualize advertisement fatigue metrics and predict user behavior using advanced ML models.

## Features

* **Multi-Score AFI Predictor**: Predicts 4 core sentiment scores and the aggregate Ad Fatigue Index.
* **Rating Risk Predictor**: Analyzes category and regional data to predict expected app ratings.
* **Interactive Data Visualization**: Glassmorphism UI with real-time charting for sentiment and behavior.
* **ML Insights**: Practical business recommendations based on predicted fatigue levels.

## 🌐 Production Deployment
The dashboard is optimized for **Vercel** with the following configuration:
- **Root Directory**: `Dashboard_Platform`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_BASE_URL` pointing to your live Railway backend.

## Tech Stack

* **React + Vite**
* **TypeScript**
* **Tailwind CSS + Shadcn UI**
* **Lucide Icons**
* **Framer Motion** (Animations)

## Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```

The application will start on: `http://localhost:8080` (or `http://localhost:5173`)

## Project Structure

```
Dashboard_Platform
│
├── src
│   ├── components   # Reusable UI elements (Sidebar, AnimatedSections)
│   ├── pages        # AFIPredictorPage, SecondaryPredictorPage, Dashboard
│   ├── lib          # Utility functions
│   └── index.css    # Global styles & Tailwind config
│
├── public
├── package.json
└── README.md
```

## Contributors

* **Krishnan S.**
* **Rachit Anand**
