import email
from email import policy
import re

def analyze_email(raw_email: str) -> dict:
    """Parses a raw email string and extracts security indicators."""
    try:
        msg = email.message_from_string(raw_email, policy=policy.default)
    except Exception as e:
        return {"error": f"Failed to parse email: {str(e)}"}
        
    # Extract Basic Headers
    sender = msg.get("From", "Unknown")
    reply_to = msg.get("Reply-To", "")
    subject = msg.get("Subject", "No Subject")
    
    # Extract Authentication Results
    auth_results = msg.get_all("Authentication-Results", [])
    auth_str = " ".join(auth_results).lower()
    
    spf_result = "pass" if "spf=pass" in auth_str else "fail" if "spf=fail" in auth_str else "none"
    dkim_result = "pass" if "dkim=pass" in auth_str else "fail" if "dkim=fail" in auth_str else "none"
    dmarc_result = "pass" if "dmarc=pass" in auth_str else "fail" if "dmarc=fail" in auth_str else "none"
    
    # Analyze Body for urgency/threats
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            content_disposition = str(part.get("Content-Disposition"))
            if content_type == "text/plain" and "attachment" not in content_disposition:
                try:
                    body += part.get_payload(decode=True).decode()
                except:
                    pass
    else:
        try:
            body = msg.get_payload(decode=True).decode()
        except:
            body = msg.get_payload()
            
    body_lower = body.lower()
    
    # Simple urgency keyword matching
    urgency_keywords = ["urgent", "immediate action required", "suspend", "verify your account", "click here", "password", "security alert"]
    urgency_score = sum(1 for kw in urgency_keywords if kw in body_lower)
    
    # Extract URLs from body
    urls_found = re.findall(r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', body)
    
    # Check for spoofing (Mismatch between From and Reply-To)
    suspicious_indicators = []
    
    if reply_to and reply_to != sender:
        suspicious_indicators.append(f"Reply-To ({reply_to}) does not match Sender ({sender})")
        
    if spf_result != "pass":
        suspicious_indicators.append(f"SPF record check: {spf_result}")
    if dkim_result != "pass":
        suspicious_indicators.append(f"DKIM signature check: {dkim_result}")
    if dmarc_result != "pass":
        suspicious_indicators.append(f"DMARC policy check: {dmarc_result}")
        
    if urgency_score > 1:
        suspicious_indicators.append(f"High urgency language detected (Score: {urgency_score})")
        
    # Calculate overall risk
    risk_score = 0
    if spf_result == "fail": risk_score += 3
    if dkim_result == "fail": risk_score += 3
    if dmarc_result == "fail": risk_score += 2
    if len(suspicious_indicators) > 2: risk_score += 2
    if urgency_score > 1: risk_score += 1
    
    overall_risk = "low"
    if risk_score >= 5:
        overall_risk = "critical"
    elif risk_score >= 3:
        overall_risk = "high"
    elif risk_score > 0:
        overall_risk = "medium"

    return {
        "from_address": sender,
        "subject": subject,
        "spf_result": spf_result,
        "dkim_result": dkim_result,
        "dmarc_result": dmarc_result,
        "urgency_score": urgency_score,
        "urls_found": list(set(urls_found)),
        "overall_risk": overall_risk,
        "suspicious_indicators": suspicious_indicators
    }
