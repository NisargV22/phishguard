import re
from urllib.parse import urlparse
from math import log2
import tldextract
import whois
import dns.resolver
import requests
from datetime import datetime

def extract_features(url: str, fetch_content: bool = False) -> dict:
    parsed = urlparse(url)
    extracted = tldextract.extract(url)
    
    features = {}
    
    # Lexical features
    features['url_length'] = len(url)
    features['num_dots'] = url.count('.')
    features['num_hyphens'] = url.count('-')
    features['num_at'] = url.count('@')
    features['has_https'] = 1 if parsed.scheme == 'https' else 0
    features['has_ip'] = 1 if re.match(r'\d+\.\d+\.\d+\.\d+', parsed.netloc) else 0
    features['domain_length'] = len(extracted.domain)
    features['subdomain_count'] = len(extracted.subdomain.split('.')) if extracted.subdomain else 0
    features['has_port'] = 1 if parsed.port else 0
    features['num_digits_in_domain'] = sum(c.isdigit() for c in extracted.domain)
    
    SUSPICIOUS_TLDS = {'tk', 'ml', 'ga', 'cf', 'xyz', 'gq', 'top', 'click', 'link'}
    features['has_suspicious_tld'] = 1 if extracted.suffix in SUSPICIOUS_TLDS else 0
    
    KNOWN_BRANDS = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix', 'instagram', 'whatsapp', 'bank']
    features['brand_in_subdomain'] = 1 if any(b in extracted.subdomain.lower() for b in KNOWN_BRANDS) and extracted.domain not in KNOWN_BRANDS else 0
    
    url_lower = url.lower()
    char_freq = {c: url_lower.count(c)/len(url_lower) for c in set(url_lower)}
    features['url_entropy'] = -sum(p * log2(p) for p in char_freq.values()) if len(url_lower) > 0 else 0
    
    # Network/DNS features
    domain = extracted.domain + '.' + extracted.suffix
    
    # Defaults
    features['domain_age_days'] = -1
    features['domain_expiry_days'] = -1
    features['has_mx'] = 0
    features['num_redirects'] = 0
    features['has_login_form'] = 0
    features['uses_privacy'] = 0
    
    # Only perform network lookups if fetch_content is True to speed up basic scans
    if fetch_content and domain:
        try:
            w = whois.whois(domain)
            now = datetime.now()
            
            creation_date = w.creation_date
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
            if creation_date:
                features['domain_age_days'] = (now - creation_date).days
                
            expiration_date = w.expiration_date
            if isinstance(expiration_date, list):
                expiration_date = expiration_date[0]
            if expiration_date:
                features['domain_expiry_days'] = (expiration_date - now).days
        except Exception:
            pass
            
        try:
            answers = dns.resolver.resolve(domain, 'MX')
            features['has_mx'] = 1 if len(answers) > 0 else 0
        except Exception:
            pass
            
        try:
            # Add timeout to avoid hanging
            resp = requests.get(url, timeout=3, allow_redirects=True)
            features['num_redirects'] = len(resp.history)
            
            # Simple check for password fields indicating a login form
            content = resp.text.lower()
            features['has_login_form'] = 1 if '<input' in content and 'type="password"' in content else 0
        except Exception:
            pass
    
    return features
