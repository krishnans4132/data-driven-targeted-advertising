from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import LabelEncoder
import os

router = APIRouter(prefix="/api/afi", tags=["afi"])

# Model state
afi_model = None
encoders = {}
feature_cols = ["screen_time", "ad_frequency", "frequent_ad_format", "most_annoying_ad_time"]
target_cols = [
    "ads_interrupt_usage_score", 
    "ads_cause_frustration_score", 
    "ads_reduce_enjoyment_score", 
    "ads_close_app_score"
]
valid_options = {}

class AFIPredictionInput(BaseModel):
    screen_time: str
    ad_frequency: str
    frequent_ad_format: str
    most_annoying_ad_time: str

def train_afi_model():
    global afi_model, valid_options
    
    # Path to primary dataset (now located inside backend/data for portability)
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../data/primary_dataset.csv'))
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return
    
    df = pd.read_csv(dataset_path)
    
    # Preprocessing
    # Drop rows with NaN in any target column
    df = df.dropna(subset=target_cols)
    
    for col in feature_cols:
        le = LabelEncoder()
        # Handle cases where column might not exist or be empty
        raw_vals = df[col].fillna('Unknown').astype(str)
        df[col] = le.fit_transform(raw_vals)
        encoders[col] = le
        valid_options[col] = [str(x) for x in le.classes_]
    
    X = df[feature_cols]
    y = df[target_cols]
    
    # Train Multi-Output Model
    # Using MultiOutputRegressor to predict all 4 scores simultaneously
    base_model = RandomForestRegressor(n_estimators=100, random_state=42)
    model = MultiOutputRegressor(base_model)
    model.fit(X, y)
    
    afi_model = model
    print("✅ Multi-Output AFI Predictor model trained successfully.")

@router.post("/predict")
async def predict_afi(input_data: AFIPredictionInput):
    if afi_model is None:
        raise HTTPException(status_code=503, detail="Model not initialized")
    
    try:
        input_dict = input_data.model_dump()
        encoded_vals = []
        
        for col in feature_cols:
            le = encoders.get(col)
            val = input_dict[col]
            if val not in le.classes_:
                # Use "Unknown" if it was in training, otherwise use first class
                if 'Unknown' in le.classes_:
                    val = 'Unknown'
                else:
                    val = le.classes_[0]
            encoded_vals.append(le.transform([val])[0])
            
        input_vector = np.array([encoded_vals])
        
        # Prediction returns a 2D array [[score1, score2, score3, score4]]
        predictions = afi_model.predict(input_vector)[0]
        
        # Map back to dict
        result = {}
        for i, col in enumerate(target_cols):
            result[col] = round(float(predictions[i]), 2)
            
        # Calculate total AFI score (average of the 4 predicted components)
        result["afi_score"] = round(float(np.mean(predictions)), 2)
        
        return {
            "predictions": result,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/options")
async def get_afi_options():
    return {
        "categorical_options": valid_options
    }
