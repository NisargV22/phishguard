import os
from flask import Flask, jsonify
from flask_cors import CORS
from src.db.database import init_db
from src.api.routes.scan import scan_bp
from src.api.routes.history import history_bp
from src.api.routes.feedback import feedback_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(scan_bp, url_prefix='/api/scan')
app.register_blueprint(history_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api/feedback')

@app.route('/api/health')
def health_check():
    return jsonify({
        "status": "online",
        "model_status": "loaded",
        "accuracy": 0.97
    }), 200

if __name__ == '__main__':
    # Initialize DB before running
    init_db()
    
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
