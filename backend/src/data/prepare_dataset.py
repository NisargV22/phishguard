import pandas as pd
import os
import sys

# Ensure we can import from src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.model.features import extract_features

def prepare_data():
    input_path = 'backend/src/data/raw_urls.csv'
    output_path = 'backend/src/data/features.csv'
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run download_data.py first.")
        return
        
    df = pd.read_csv(input_path)
    
    print(f"Extracting features for {len(df)} URLs. This may take a moment...")
    
    feature_list = []
    # For speed in this demo pipeline, we won't do live network lookups for every URL (fetch_content=False)
    # The model will train on lexical features mostly.
    for idx, row in df.iterrows():
        url = row['url']
        label = row['label']
        feats = extract_features(url, fetch_content=False)
        feats['label'] = 1 if label == 'phishing' else 0
        feature_list.append(feats)
        
        if (idx + 1) % 100 == 0:
            print(f"Processed {idx + 1}/{len(df)}...")
            
    features_df = pd.DataFrame(feature_list)
    features_df.to_csv(output_path, index=False)
    print(f"Features saved to {output_path}")

if __name__ == '__main__':
    prepare_data()
