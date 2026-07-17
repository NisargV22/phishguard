import re
from urllib.parse import urlparse
from math import log2
import tldextract

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
    
    # Mocking Network/DNS features for MVP
    features['domain_age_days'] = 100
    features['domain_expiry_days'] = 365
    features['uses_privacy'] = 0
    features['has_mx'] = 1
    features['num_redirects'] = 0
    features['has_login_form'] = 0
    
    return features
