def explain_prediction(features: dict, score: float) -> dict:
    """Mock SHAP explanation for MVP."""
    explanations = []
    
    # Mocking some feature contributions based on the values
    if features.get('has_suspicious_tld', 0) == 1:
        explanations.append({
            "feature": "has_suspicious_tld",
            "value": 1,
            "contribution": 0.35,
            "direction": "phishing"
        })
    
    if features.get('has_https', 1) == 0:
        explanations.append({
            "feature": "has_https",
            "value": 0,
            "contribution": 0.20,
            "direction": "phishing"
        })
        
    explanations.append({
        "feature": "url_length",
        "value": features.get('url_length', 0),
        "contribution": 0.05 if features.get('url_length', 0) > 50 else -0.02,
        "direction": "phishing" if features.get('url_length', 0) > 50 else "legitimate"
    })
    
    return {
        "top_factors": explanations[:8],
        "all_factors": explanations
    }
