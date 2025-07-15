from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import motor.motor_asyncio
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessing objects
model_bundle = joblib.load('heart_disease_gb_model.joblib')
model = model_bundle['model']
scaler = model_bundle['scaler']
selector = model_bundle['selector']

# List of features used in the model (excluding 'id', 'dataset', 'num')
FEATURES = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalch',
    'exang', 'oldpeak', 'slope', 'ca', 'thal'
]

# Only these are categorical (ca is numeric)
CATEGORICAL = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'thal']

# Dummy label encoders for categorical features (should match training)
from sklearn.preprocessing import LabelEncoder

# For simplicity, fit encoders on all possible values from the training set
# In production, save and load the encoders from training
TRAIN_DF = pd.read_csv('heart_disease_uci.csv')
TRAIN_DF = TRAIN_DF.drop(['id', 'dataset', 'num'], axis=1)
encoders = {}
for col in CATEGORICAL:
    le = LabelEncoder()
    TRAIN_DF[col] = TRAIN_DF[col].astype(str)
    le.fit(TRAIN_DF[col])
    encoders[col] = le

# MongoDB setup using environment variables
MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('DB_NAME', 'cvd_gradient')
COLLECTION_NAME = os.getenv('COLLECTION_NAME', 'predictions')

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set. Please check your .env file.")

try:
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    predictions_collection = db[COLLECTION_NAME]
    print(f"Successfully connected to MongoDB: {DB_NAME}.{COLLECTION_NAME}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise

class PredictRequest(BaseModel):
    age: float
    sex: str
    cp: str
    trestbps: float
    chol: float
    fbs: str
    restecg: str
    thalch: float
    exang: str
    oldpeak: float
    slope: str
    ca: float
    thal: str

@app.post('/predict')
async def predict(request: PredictRequest, req: Request):
    # Convert request to DataFrame
    input_dict = request.dict()
    
    # Convert string boolean values to proper format
    if input_dict['fbs'] == 'TRUE':
        input_dict['fbs'] = True
    elif input_dict['fbs'] == 'FALSE':
        input_dict['fbs'] = False
    
    if input_dict['exang'] == 'TRUE':
        input_dict['exang'] = True
    elif input_dict['exang'] == 'FALSE':
        input_dict['exang'] = False
    
    # ca is already float
    input_df = pd.DataFrame([input_dict])
    
    # Encode categoricals
    for col in CATEGORICAL:
        if col in input_df:
            try:
                input_df[col] = encoders[col].transform(input_df[col].astype(str))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid value for {col}: {input_df[col].values[0]}")
    
    # Ensure correct order
    input_df = input_df[FEATURES]
    
    # Scale
    X_scaled = scaler.transform(input_df)
    
    # Feature selection
    X_selected = selector.transform(X_scaled)
    
    # Predict risk (probability of class 1)
    risk_score = float(model.predict_proba(X_selected)[0][1])
    
    # Save prediction to MongoDB
    user_info = req.headers.get('x-user-info')  # Expecting JSON string from frontend
    try:
        user = None
        if user_info:
            import json
            user = json.loads(user_info)
    except Exception:
        user = None
    
    prediction_doc = {
        "user": user,
        "input": input_dict,
        "risk_score": risk_score,
        "timestamp": datetime.utcnow()
    }
    await predictions_collection.insert_one(prediction_doc)
    
    return {"risk_score": risk_score}

from typing import Optional

@app.get('/predictions')
async def get_predictions(user_id: Optional[str] = Query(None)):
    query = {}
    if user_id:
        query["user.id"] = user_id
    cursor = predictions_collection.find(query).sort("timestamp", -1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.get('/patients/summary')
async def get_patients_summary():
    # Aggregate stats for doctor dashboard
    pipeline = [
        {"$group": {
            "_id": "$user.id",
            "name": {"$first": "$user.name"},
            "age": {"$first": "$input.age"},
            "lastTest": {"$max": "$timestamp"},
            "riskScore": {"$avg": "$risk_score"},
            "count": {"$sum": 1},
        }}
    ]
    patients = []
    async for doc in predictions_collection.aggregate(pipeline):
        if doc["riskScore"] > 0.7:
            status = "High Risk"
        elif doc["riskScore"] > 0.4:
            status = "Medium Risk"
        else:
            status = "Low Risk"
        patients.append({
            "id": doc["_id"],
            "name": doc.get("name", "Unknown"),
            "age": doc.get("age", None),
            "lastTest": doc.get("lastTest", None),
            "riskScore": round(doc["riskScore"] * 100, 1),
            "status": status,
            "count": doc["count"]
        })
    
    # Summary stats
    totalPatients = len(patients)
    highRisk = sum(1 for p in patients if p["status"] == "High Risk")
    mediumRisk = sum(1 for p in patients if p["status"] == "Medium Risk")
    lowRisk = sum(1 for p in patients if p["status"] == "Low Risk")
    avgRisk = round(np.mean([p["riskScore"] for p in patients]) if patients else 0, 1)
    
    return {
        "patients": patients,
        "stats": {
            "totalPatients": totalPatients,
            "highRisk": highRisk,
            "mediumRisk": mediumRisk,
            "lowRisk": lowRisk,
            "avgRisk": avgRisk
        }
    } 