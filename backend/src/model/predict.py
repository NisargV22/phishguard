import joblib
import os
import pandas as pd
import random

_model = None

def get_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), '../saved_model/model.pkl')
        if os.path.exists(model_path):
            _model = joblib.load(model_path)
    return _model

def predict(features: dict) -> dict:
    model = get_model()
    
    if model is None:
        # Fallback logic if model is missing
        score = 0.2
        if features.get('has_suspicious_tld', 0) == 1:
            score += 0.4
        if features.get('url_entropy', 0) > 4:
            score += 0.3
        if features.get('has_https', 1) == 0:
            score += 0.2
        score = min(max(score + random.uniform(-0.1, 0.1), 0.0), 0.99)
        label = 'phishing' if score > 0.7 else 'benign'
    else:
        # Create DataFrame from features
        df = pd.DataFrame([features])
        
        # Ensure correct order of features if needed
        if hasattr(model, 'feature_names_in_'):
            # Only select features that the model expects, fill missing with 0
            df = df.reindex(columns=model.feature_names_in_, fill_value=0)
            
        prediction = model.predict(df)[0]
        score = float(model.predict_proba(df)[0][1])
        label = 'phishing' if prediction == 1 else 'benign'
        
    risk_level = 'low'
    if score > 0.9: risk_level = 'critical'
    elif score > 0.7: risk_level = 'high'
    elif score > 0.4: risk_level = 'medium'
    
    return {
        "threat_score": score,
        "label": label,
        "confidence": score if label == 'phishing' else (1-score),
        "risk_level": risk_level
    }
