from flask import Blueprint, request, jsonify
import uuid
import json
from datetime import datetime
from src.model.features import extract_features
from src.model.predict import predict
from src.model.explain import explain_prediction
from src.db.database import SessionLocal
from src.db.models import Scan

scan_bp = Blueprint('scan', __name__)

@scan_bp.route('/url', methods=['POST'])
def scan_url():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    url = url.strip()
    
    # Extract features
    features = extract_features(url)
    
    # Predict
    prediction = predict(features)
    
    # Explain
    explanation = explain_prediction(features, prediction['threat_score'])
    
    # Check VirusTotal
    from src.analysis.vt_client import get_vt_report
    vt_stats = get_vt_report(url)
    
    # OSINT Forensics
    from src.analysis.osint_engine import get_osint_data
    osint_data = get_osint_data(url)
    
    scan_id = str(uuid.uuid4())
    
    # Save to DB
    db = SessionLocal()
    new_scan = Scan(
        scan_id=scan_id,
        url=url,
        threat_score=prediction['threat_score'],
        label=prediction['label'],
        risk_level=prediction['risk_level'],
        features_json=json.dumps(features),
        explanation_json=json.dumps(explanation),
        scan_type='url'
    )
    db.add(new_scan)
    db.commit()
    db.close()
    
    return jsonify({
        "url": url,
        "threat_score": prediction['threat_score'],
        "label": prediction['label'],
        "confidence": prediction['confidence'],
        "risk_level": prediction['risk_level'],
        "explanation": explanation,
        "features": features,
        "mitre_technique": "T1566.002",
        "recommendation": "Block this URL at the firewall." if prediction['label'] == 'phishing' else "URL appears safe.",
        "scan_id": scan_id,
        "scanned_at": datetime.utcnow().isoformat(),
        "vt_stats": vt_stats,
        "osint": osint_data
    }), 200

from src.analysis.email_analyzer import analyze_email

@scan_bp.route('/email', methods=['POST'])
def scan_email():
    data = request.json
    raw_email = data.get('raw_email')
    
    if not raw_email:
        return jsonify({"error": "Raw email content is required"}), 400
        
    analysis_result = analyze_email(raw_email)
    
    if "error" in analysis_result:
        return jsonify(analysis_result), 400
        
    scan_id = str(uuid.uuid4())
    analysis_result["scan_id"] = scan_id
    
    return jsonify(analysis_result), 200
