import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.environ.get("VT_API_KEY")

def get_vt_report(url: str) -> dict:
    if not VT_API_KEY:
        return {"error": "VirusTotal API key not configured"}
        
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    api_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"
    
    headers = {
        "accept": "application/json",
        "x-apikey": VT_API_KEY
    }
    
    try:
        response = requests.get(api_url, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            return stats
        elif response.status_code == 404:
            return {"error": "URL not found in VT database"}
        else:
            return {"error": f"VT API Error {response.status_code}"}
    except Exception as e:
        return {"error": str(e)}
