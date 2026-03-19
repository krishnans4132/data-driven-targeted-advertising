import os
import pandas as pd

models_cache = {}

def get_models_dir():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'models'))

def get_data_dir():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data'))

def load_all_models():
    """No models to load from /models/ anymore. Rating model is trained in its own router."""
    return True

def get_model(name: str):
    return models_cache.get(name)
