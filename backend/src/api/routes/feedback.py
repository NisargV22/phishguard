from flask import Blueprint, request, jsonify
from src.db.database import SessionLocal
from src.db.models import Feedback

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/', methods=['POST'])
def submit_feedback():
    data = request.json
    scan_id = data.get('scan_id')
    is_false_positive = data.get('is_false_positive', False)
    user_comment = data.get('user_comment', '')
    
    if not scan_id:
        return jsonify({"error": "scan_id is required"}), 400
        
    db = SessionLocal()
    new_feedback = Feedback(
        scan_id=scan_id,
        is_false_positive=is_false_positive,
        user_comment=user_comment
    )
    db.add(new_feedback)
    db.commit()
    db.close()
    
    return jsonify({"status": "success", "message": "Feedback recorded."}), 201
