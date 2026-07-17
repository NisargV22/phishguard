import whois
import dns.resolver
from urllib.parse import urlparse
import tldextract

def get_osint_data(url: str) -> dict:
    try:
        # Extract domain
        extracted = tldextract.extract(url)
        domain = f"{extracted.domain}.{extracted.suffix}"
        
        if not domain or not extracted.suffix:
            return {"error": "Invalid domain"}
            
        osint_data = {
            "domain": domain,
            "dns": {},
            "whois": {}
        }
        
        # DNS Lookups
        try:
            a_records = dns.resolver.resolve(domain, 'A')
            osint_data["dns"]["A"] = [str(ip) for ip in a_records][:3]
        except Exception:
            osint_data["dns"]["A"] = []
            
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            osint_data["dns"]["MX"] = [str(mx.exchange) for mx in mx_records][:3]
        except Exception:
            osint_data["dns"]["MX"] = []
            
        # WHOIS Lookup
        try:
            w = whois.whois(domain)
            osint_data["whois"]["registrar"] = w.registrar if w.registrar else "Unknown"
            osint_data["whois"]["creation_date"] = str(w.creation_date[0]) if isinstance(w.creation_date, list) else str(w.creation_date)
            osint_data["whois"]["country"] = w.country if w.country else "Unknown"
        except Exception:
            osint_data["whois"]["error"] = "WHOIS lookup failed"
            
        return osint_data
        
    except Exception as e:
        return {"error": str(e)}
