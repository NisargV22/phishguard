import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
import joblib
import os

def train_model():
    input_path = 'backend/src/data/features.csv'
    model_dir = 'backend/src/saved_model'
    model_path = os.path.join(model_dir, 'model.pkl')
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Run prepare_dataset.py first.")
        return
        
    df = pd.read_csv(input_path)
    
    # Separate features and target
    X = df.drop(columns=['label'])
    y = df['label']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_prob)
    
    print(f"Accuracy: {acc:.4f}")
    print(f"ROC-AUC:  {roc_auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train_model()
