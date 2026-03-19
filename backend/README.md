# AdIntel Backend API

FastAPI backend mapping AdIntel ML Models for prediction, sentiment analysis, and app rating risk assessment.

## Running Locally

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Start the Server**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

*The server automatically trains its ML models on startup using the latest data in `/data/final/`.*

---

## Architecture Breakdown

### 1. Live Training Engine
AdIntel uses a **Lifespan Startup** pattern in `main.py`. Every time the server starts, it trains its models on the freshest data available, ensuring the API is always synchronized with the latest research findings.

### 2. Specialized Routers (`routers/`)
*   **`rating.py`**: Predicts app star ratings (Rating Risk) based on Category and Region using a Random Forest model trained on 225k+ reviews.
*   **`afi.py`**: Predicts 4+1 sentiment/fatigue scores (Multi-Score AFI) using a Multi-Output regressor.

### 3. Data Integrity
*   **Pydantic Schemas**: Strict validation of all incoming inference requests to ensure data quality before it reaches the ML pipelines.
*   **`utils/loader.py`**: Lightweight utility for shared data loading across modules.
