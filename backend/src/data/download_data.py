import os
import pandas as pd
import requests
import zipfile
import io

def download_dataset():
    data = []
    
    print("Downloading live phishing URLs from OpenPhish...")
    try:
        resp = requests.get('https://openphish.com/feed.txt', timeout=10)
        if resp.status_code == 200:
            phish_urls = resp.text.strip().split('\n')
            # Take up to 1500
            for url in phish_urls[:1500]:
                if url.strip():
                    data.append({'url': url.strip(), 'label': 'phishing'})
            print(f"Got {len(phish_urls[:1500])} phishing URLs.")
        else:
            print("Failed to fetch OpenPhish.")
    except Exception as e:
        print("Error fetching OpenPhish:", e)

    print("Downloading top 1M benign domains from Alexa/Tranco backup...")
    try:
        # A mirror for Alexa top 1m or we can use a hardcoded list for reliability if the zip fails
        # To ensure this runs reliably without 404s, we will use a known reliable static list from a github repo
        # Alternatively, we can use the Cisco Umbrella top 1m
        url = 'https://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip'
        resp = requests.get(url, timeout=15)
        if resp.status_code == 200:
            with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
                with z.open(z.namelist()[0]) as f:
                    count = 0
                    for line in f:
                        if count >= 1500:
                            break
                        domain = line.decode('utf-8').strip().split(',')[1]
                        data.append({'url': f'https://www.{domain}', 'label': 'benign'})
                        count += 1
            print(f"Got {count} benign URLs.")
        else:
            print("Failed to fetch Umbrella top 1m.")
    except Exception as e:
        print("Error fetching Umbrella:", e)

    if not data:
        print("Failed to download any data. Exiting.")
        return

    df = pd.DataFrame(data)
    # Shuffle
    df = df.sample(frac=1).reset_index(drop=True)
    
    os.makedirs('backend/src/data', exist_ok=True)
    df.to_csv('backend/src/data/raw_urls.csv', index=False)
    print(f"Saved {len(df)} real URLs to backend/src/data/raw_urls.csv")

if __name__ == '__main__':
    download_dataset()
