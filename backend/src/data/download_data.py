import os
import pandas as pd
import random

def generate_synthetic_data(num_samples=1000):
    data = []
    # Generate benign
    for _ in range(num_samples):
        data.append({'url': f'https://example{random.randint(1,10000)}.com/path{random.randint(1,100)}', 'label': 'benign'})
        
    # Generate phishing
    for _ in range(num_samples):
        # Phishing URLs often use IP addresses, long subdomains, suspicious TLDs, and lots of hyphens
        is_ip = random.choice([True, False])
        if is_ip:
            url = f'http://{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}/login.php'
        else:
            tld = random.choice(['tk', 'ml', 'xyz', 'click', 'com'])
            url = f'http://secure-update-account-paypal-{'x'*random.randint(1,20)}.{tld}/login'
        data.append({'url': url, 'label': 'phishing'})
        
    df = pd.DataFrame(data)
    # Shuffle
    df = df.sample(frac=1).reset_index(drop=True)
    
    os.makedirs('backend/src/data', exist_ok=True)
    df.to_csv('backend/src/data/raw_urls.csv', index=False)
    print(f"Generated {len(df)} synthetic URLs in backend/src/data/raw_urls.csv")

if __name__ == '__main__':
    generate_synthetic_data(500) # 1000 total
