# ⚙️ Backend API – AdIntel

## 📌 Overview

This backend is built using **FastAPI** and supports:

* Ad fatigue prediction
* Sentiment analysis
* App rating estimation

It connects machine learning models with API endpoints for easy access.

---

## 🚀 Running Locally

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start Server

```bash
uvicorn main:app --reload --port 8000
```

---

## ⚙️ Functionality

* Loads data from `/data/final/`
* Runs ML models for prediction
* Returns results through REST APIs

---

## 📡 API Modules

* `afi.py` → Ad fatigue prediction
* `rating.py` → App rating estimation

---

## 🧠 Notes

* Models are trained when the server starts
* Designed for simple experimentation and analysis

---

## ☁️ Deployment

* Can be deployed using **Railway**
* Uses Python 3.11 environment

---

## 📁 Structure

```
backend/
 ├── main.py
 ├── routers/
 ├── data/
 ├── utils/
```
