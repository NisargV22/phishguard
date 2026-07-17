from flask import Blueprint, jsonify, request
from src.db.database import SessionLocal
from src.db.models import Scan
from sqlalchemy import desc

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 20))
    offset = (page - 1) * limit
    
    db = SessionLocal()
    scans = db.query(Scan).order_by(desc(Scan.scanned_at)).offset(offset).limit(limit).all()
    total = db.query(Scan).count()
    db.close()
    
    result = []
    for s in scans:
        result.append({
            "scan_id": s.scan_id,
            "url": s.url,
            "threat_score": s.threat_score,
            "label": s.label,
            "risk_level": s.risk_level,
            "scanned_at": s.scanned_at.isoformat()
        })
        
    return jsonify({
        "data": result,
        "total": total,
        "page": page,
        "limit": limit
    }), 200

@history_bp.route('/stats', methods=['GET'])
def get_stats():
    db = SessionLocal()
    total = db.query(Scan).count()
    phishing = db.query(Scan).filter(Scan.label == 'phishing').count()
    db.close()
    
    return jsonify({
        "total_scans": total,
        "phishing_count": phishing,
        "detection_rate": (phishing / total) if total > 0 else 0
    }), 200
