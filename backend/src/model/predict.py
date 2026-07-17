import random
from typing import Dict, List

def predict(features: dict) -> dict:
    """Mock prediction for MVP."""
    # Basic logic: if suspicious TLD or entropy > 4, increase score
    score = 0.2
    if features.get('has_suspicious_tld', 0) == 1:
        score += 0.4
    if features.get('url_entropy', 0) > 4:
        score += 0.3
    if features.get('has_https', 1) == 0:
        score += 0.2
        
    score = min(max(score + random.uniform(-0.1, 0.1), 0.0), 0.99)
    label = 'phishing' if score > 0.7 else 'legitimate'
    
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
