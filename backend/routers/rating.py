from fastapi import APIRouter, Query, HTTPException
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import os

router = APIRouter()

# ── Model state (trained once on startup) ────────────────────────────────────
_model: RandomForestRegressor | None = None
_le_cat: LabelEncoder | None = None
_le_cont: LabelEncoder | None = None
_categories: list[str] = []
_continents: list[str] = []


def train_rating_model():
    """Train RF model on secondary dataset and cache encoders."""
    global _model, _le_cat, _le_cont, _categories, _continents

    data_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'final', 'secondary_ads_dataset.csv')
    )

    if not os.path.exists(data_path):
        print(f"[rating_router] ERROR: Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path, usecols=['category', 'continent', 'ad_mentioned', 'rating'])
    df = df[df['rating'].notna() & df['rating'].between(1, 5)].copy()

    _le_cat  = LabelEncoder()
    _le_cont = LabelEncoder()

    df['category_enc']  = _le_cat.fit_transform(df['category'].fillna('Unknown'))
    df['continent_enc'] = _le_cont.fit_transform(df['continent'].fillna('Unknown'))
    df['ad_flag']       = df['ad_mentioned'].astype(int)

    X = df[['category_enc', 'continent_enc', 'ad_flag']]
    y = df['rating']

    _model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    _model.fit(X, y)

    _categories = sorted(df['category'].dropna().unique().tolist())
    _continents = sorted(df['continent'].dropna().unique().tolist())

    print(f"[rating_router] Model trained on {len(df):,} rows — "
          f"{len(_categories)} categories × {len(_continents)} continents")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/api/rating/predict")
def predict_rating(
    category:     str  = Query(..., description="App category"),
    continent:    str  = Query(..., description="Reviewer continent"),
    ad_mentioned: bool = Query(..., description="Whether ads were mentioned in the review"),
):
    if _model is None:
        raise HTTPException(status_code=503, detail="Rating model not yet loaded")
    if category not in _categories:
        raise HTTPException(status_code=400, detail=f"Unknown category '{category}'. Valid: {_categories}")
    if continent not in _continents:
        raise HTTPException(status_code=400, detail=f"Unknown continent '{continent}'. Valid: {_continents}")

    c_enc  = int(_le_cat.transform([category])[0])
    cn_enc = int(_le_cont.transform([continent])[0])
    pred   = float(_model.predict([[c_enc, cn_enc, int(ad_mentioned)]])[0])

    rating = round(pred, 2)
    if rating < 2.5:
        risk = "High Risk"
    elif rating > 3.5:
        risk = "Low Risk"
    else:
        risk = "Moderate Risk"

    return {
        "category":     category,
        "continent":    continent,
        "adMentioned":  ad_mentioned,
        "predictedRating": rating,
        "riskLevel":    risk,
    }


@router.get("/api/rating/all-predictions")
def all_predictions():
    """Return predicted ratings for ALL category × continent × ad combinations."""
    if _model is None:
        raise HTTPException(status_code=503, detail="Rating model not yet loaded")

    results = []
    for cat in _categories:
        for cont in _continents:
            for ad in [True, False]:
                c_enc  = int(_le_cat.transform([cat])[0])
                cn_enc = int(_le_cont.transform([cont])[0])
                pred   = round(float(_model.predict([[c_enc, cn_enc, int(ad)]])[0]), 2)
                results.append({
                    "category":       cat,
                    "continent":      cont,
                    "adMentioned":    ad,
                    "predictedRating": pred,
                })
    return results


@router.get("/api/rating/options")
def get_options():
    """Return the valid categories and continents the model was trained on."""
    return {"categories": _categories, "continents": _continents}
