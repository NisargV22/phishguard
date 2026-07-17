from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime
from .database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String, unique=True, index=True)
    url = Column(String, index=True, nullable=True)
    email_subject = Column(String, nullable=True)
    threat_score = Column(Float)
    label = Column(String) # 'phishing' / 'legitimate'
    risk_level = Column(String) # 'critical' / 'high' / 'medium' / 'low'
    features_json = Column(String) # JSON blob
    explanation_json = Column(String) # SHAP values JSON blob
    scanned_at = Column(DateTime, default=datetime.utcnow)
    scan_type = Column(String) # 'url' / 'email'


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String, index=True) # foreign key concept
    is_false_positive = Column(Boolean)
    user_comment = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
