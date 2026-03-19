from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import rating, afi
from utils.loader import load_all_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load all ML models from the /models/ directory at startup
    load_all_models()
    # Train/load the prediction models
    rating.train_rating_model()
    afi.train_afi_model()
    yield
    # Clean up on shutdown if necessary

app = FastAPI(lifespan=lifespan, title="AdIntel API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rating.router)
app.include_router(afi.router)

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "models_loaded": True}
