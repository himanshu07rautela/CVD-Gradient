from fastapi import FastAPI, HTTPException, Request, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import joblib
import numpy as np
import pandas as pd
import motor.motor_asyncio
from datetime import datetime
from dotenv import load_dotenv
import os
from typing import Optional
from passlib.context import CryptContext
import random
import string

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

# User signup/login models
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str  # 'patient' or 'doctor'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Helper to generate unique doctorId
async def generate_unique_doctor_id():
    while True:
        doctor_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        exists = await db['users'].find_one({"doctorId": doctor_id})
        if not exists:
            return doctor_id

@app.post('/signup')
async def signup(user: UserSignup):
    existing = await db['users'].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    hashed_pw = hash_password(user.password)
    user_doc = {
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_pw,
        "role": user.role,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    if user.role == 'doctor':
        doctor_id = await generate_unique_doctor_id()
        user_doc["doctorId"] = doctor_id
    result = await db['users'].insert_one(user_doc)
    user_id = result.inserted_id
    if user.role == 'patient':
        # Optionally link doctor at signup if doctorId provided
        linked_doctors = []
        if hasattr(user, 'doctorId') and user.doctorId:
            doctor = await db['users'].find_one({"doctorId": user.doctorId, "role": "doctor"})
            if doctor:
                linked_doctors.append(user.doctorId)
                # Add patient to doctor's patients array
                await db['doctors'].update_one({"doctorId": user.doctorId}, {"$addToSet": {"patients": user_id}})
        patient_doc = {
            "userId": user_id,
            "age": None,
            "gender": None,
            "linkedDoctors": linked_doctors,
            "tests": []
        }
        await db['patients'].insert_one(patient_doc)
    elif user.role == 'doctor':
        doctor_doc = {
            "userId": user_id,
            "doctorId": user_doc["doctorId"],
            "specialization": None,
            "patients": []
        }
        await db['doctors'].insert_one(doctor_doc)
    return {"message": "Signup successful", "userId": str(user_id), "role": user.role, "doctorId": user_doc.get("doctorId")}

@app.post('/login')
async def login(user: UserLogin):
    user_doc = await db['users'].find_one({"email": user.email})
    if not user_doc or 'hashed_password' not in user_doc or not verify_password(user.password, user_doc['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {
        "userId": str(user_doc['_id']),
        "name": user_doc.get('name', ''),
        "email": user_doc['email'],
        "role": user_doc['role']
    }

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
            # Use email as unique user id if available
            if user and 'email' in user:
                user['id'] = user['email']
    except Exception:
        user = None
    
    # Save prediction to predictions collection (for legacy)
    prediction_doc = {
        "user": user,
        "input": input_dict,
        "risk_score": risk_score,
        "timestamp": datetime.utcnow()
    }
    await predictions_collection.insert_one(prediction_doc)
    
    # Also save to patient's tests array
    if user and user.get('email'):
        patient_user = await db['users'].find_one({"email": user['email'], "role": "patient"})
        if patient_user:
            test_entry = {
                "testName": "CVD Risk Assessment",
                "result": risk_score,
                "date": datetime.utcnow(),
                "prescribedBy": input_dict.get('prescribedBy')
            }
            test_entry.update(input_dict)  # Add all input parameters to the test entry
            await db['patients'].update_one({"userId": patient_user['_id']}, {"$push": {"tests": test_entry}})
    
    return {"risk_score": risk_score}

from typing import Optional

@app.get('/predictions')
async def get_predictions(user_id: Optional[str] = Query(None)):
    query = {}
    if user_id:
        query["user.id"] = user_id  # user_id should be email
    cursor = predictions_collection.find(query).sort("timestamp", -1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)
    return results

@app.post('/link-doctor')
async def link_doctor(patient_email: str = Body(...), doctor_id: str = Body(...)):
    # Find patient and doctor
    user_doc = await db['users'].find_one({"email": patient_email, "role": "patient"})
    doctor_doc = await db['users'].find_one({"doctorId": doctor_id, "role": "doctor"})
    if not user_doc or not doctor_doc:
        raise HTTPException(status_code=404, detail="Patient or doctor not found.")
    # Update patient's linkedDoctors
    patient = await db['patients'].find_one({"userId": user_doc['_id']})
    await db['patients'].update_one({"userId": user_doc['_id']}, {"$addToSet": {"linkedDoctors": doctor_id}})
    # Update doctor's patients array
    await db['doctors'].update_one({"doctorId": doctor_id}, {"$addToSet": {"patients": user_doc['_id']}})
    return {"message": "Doctor linked successfully."}

@app.get('/patients/summary')
async def get_patients_summary(doctor_id: Optional[str] = Query(None)):
    # Only show patients linked to this doctor if doctor_id is provided
    if doctor_id:
        doctor = await db['doctors'].find_one({"doctorId": doctor_id})
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        patient_ids = doctor.get('patients', [])
        # Only fetch patients who are in the doctor's patients array AND have the doctorId in their linkedDoctors
        patients_cursor = db['patients'].find({
            "userId": {"$in": patient_ids},
            "linkedDoctors": doctor_id
        })
    else:
        patients_cursor = db['patients'].find({})
    patients = []
    async for patient in patients_cursor:
        user_doc = await db['users'].find_one({"_id": patient['userId']})
        if not user_doc:
            continue
        tests = patient.get('tests', [])
        last_test = max((t['date'] for t in tests), default=None)
        avg_risk = round(np.mean([t['result'] for t in tests]) * 100, 1) if tests else 0
        status = "High Risk" if avg_risk > 70 else "Medium Risk" if avg_risk > 40 else "Low Risk"
        patients.append({
            "id": str(user_doc['_id']),
            "name": user_doc.get('name', 'Unknown'),
            "age": patient.get('age'),
            "gender": patient.get('gender'),
            "lastTest": last_test,
            "riskScore": avg_risk,
            "status": status,
            "count": len(tests),
            "tests": tests  # Include full test details
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