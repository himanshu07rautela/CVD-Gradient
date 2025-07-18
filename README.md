# CVD Gradient: AI-Powered Cardiovascular Disease Prediction Platform

## 🌟 About the Project
CVD Gradient is a full-stack, AI-driven platform for early detection and risk assessment of cardiovascular diseases. Inspired by the vision of **Ayushman Bharat**—making quality healthcare accessible and affordable for all—this project leverages advanced machine learning and modern web technologies to empower both patients and clinicians with actionable insights.

**Developed end-to-end by Himanshu Rautela (IIIT Kota):**
- Machine learning model development, training, and integration
- Backend API (FastAPI, Python, MongoDB)
- Frontend (React, MUI, Recharts)
- Secure authentication and doctor-patient linking
- Deployment and DevOps

---

## 🚀 Features
- **Real-Time CVD Risk Prediction:** Input health data and receive instant, explainable risk assessment
- **Role-Based Dashboards:** Separate, secure dashboards for patients and doctors
- **Doctor-Patient Linking:** Patients can link their doctor using a unique Doctor ID, granting access to all past and future tests
- **Comprehensive Test History:** All test parameters and results are stored and viewable in detail
- **Multi-Patient Analytics:** Doctors can compare risk trends across all their patients with interactive charts
- **Research Transparency:** Full methodology, model performance, and team details
- **Mobile-First, Responsive UI:** Optimized for all devices

---

## 🧠 Machine Learning Pipeline (Backend)

### **1. Data Preprocessing**
- **Dataset:** UCI Heart Disease Dataset ([Kaggle link](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data/data))
- **Cleaning:** Removal of irrelevant columns, handling missing values
- **Encoding:** Categorical variables encoded using LabelEncoder
- **Scaling:** Features scaled using StandardScaler for optimal model performance

### **2. Feature Selection**
- **LASSO (Least Absolute Shrinkage and Selection Operator):**
  - Penalizes less important features, automatically selecting the most predictive subset
  - Reduces overfitting and improves interpretability
- **Benchmarking:** Compared with Genetic Algorithm (GA) feature selection; LASSO chosen for best trade-off between accuracy and simplicity

### **3. Model Training**
- **Algorithm:** Gradient Boosting Classifier (ensemble of decision trees)
- **Hyperparameter Tuning:** Grid search and cross-validation for optimal settings
- **Evaluation Metrics:**
  - Accuracy, Precision, Recall, F1-score, ROC-AUC
  - Results visualized and compared in the research section

### **4. Model Deployment**
- **Serialization:** Trained model, scaler, and selector saved using Joblib
- **Serving:** FastAPI backend loads the model and exposes a `/predict` endpoint for real-time inference
- **Explainability:** All input parameters and results are stored for each test, enabling full transparency

---

## 🖥️ Frontend (React)

### **Framework & Libraries**
- **React 18** with functional components and hooks
- **Material-UI (MUI):** Modern, accessible, and responsive UI components
- **Recharts:** Interactive, multi-series charts for risk trends and analytics
- **Axios:** Secure API communication

### **Key Features**
- **Role-Based Routing:**
  - Patients and doctors have separate login flows and dashboards
  - Role-based access enforced at login
- **Authentication:**
  - Secure signup and login with hashed passwords
  - JWT/session management (if enabled)
- **Doctor-Patient Linking:**
  - Patients can link to a doctor using a unique Doctor ID
  - Doctors see only their linked patients and all their test histories
- **Test Submission & History:**
  - Patients submit health data for prediction
  - All test parameters and results are stored and viewable in detail
- **Multi-Patient Analytics:**
  - Doctors can compare risk percent trends across all their patients
  - Interactive, color-coded line charts
- **UI/UX:**
  - Mobile-first, fully responsive design
  - Modern glow effects, beautiful backgrounds, and clear call-to-actions
  - Accessible and user-friendly forms

---

## 🛠️ Backend (FastAPI, MongoDB)

### **API Structure**
- **/signup:** Register as patient or doctor (doctors receive a unique Doctor ID)
- **/login:** Role-based authentication
- **/predict:** Accepts patient health data, returns risk score, and stores all input parameters in the patient’s test history
- **/link-doctor:** Patients can link a doctor by entering their Doctor ID
- **/patients/summary:** Doctors fetch all their linked patients and full test histories

### **Security**
- **Password Hashing:** All passwords stored securely with bcrypt
- **Role Enforcement:** Only patients can submit tests; only doctors can view multiple patients
- **CORS:** Configured for secure frontend-backend integration
- **Environment Variables:** All sensitive data (e.g., MongoDB URI) stored in .env

### **Deployment**
- **Model and API:** Deployed on Render.com or similar
- **Database:** MongoDB Atlas (cloud-hosted, secure)
- **Frontend:** Deployed on Vercel or similar

---

## 🗄️ Database Schema (MongoDB)

### **users**
- `_id` (ObjectId)
- `name`, `email`, `hashed_password`, `role` ("patient" or "doctor"), `createdAt`, `updatedAt`
- **For doctors:** `doctorId` (unique, shareable)

### **patients**
- `_id` (ObjectId)
- `userId` (ref: users._id)
- `linkedDoctors`: [doctorId] (doctors authorized to view this patient)
- `tests`: [
    - `date`, `result` (risk score), **all input parameters** (age, gender, cp, chol, etc.)
  ]

### **doctors**
- `_id` (ObjectId)
- `userId` (ref: users._id)
- `doctorId` (unique)
- `specialization`
- `patients`: [patientId] (patients who have linked this doctor)

### **predictions** (legacy, for research)
- Stores all predictions for research and analytics

---

## 📦 How to Run Locally

1. **Clone the repo:**
```bash
   git clone https://github.com/himanshu07rautela/CVD-Gradient.git
   cd CVD-Gradient
```
2. **Backend:**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Set up your `.env` file with your MongoDB URI and any other secrets
   - Start server: `uvicorn api:app --reload --host 0.0.0.0 --port 8000`
3. **Frontend:**
   - Install Node dependencies: `npm install`
   - Start React app: `npm start`
   - Set `REACT_APP_API_URL` in your environment if needed

---

## 🌐 Live Demo
[Access the platform here](https://cvd-gradient.vercel.app/patient-dashboard)

---

## 📄 License
MIT License

---

## 🤝 Dataset Credits
UCI Heart Disease Dataset ([Kaggle link](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data/data))

**Creators:**
- Hungarian Institute of Cardiology, Budapest: Andras Janosi, M.D.
- University Hospital, Zurich, Switzerland: William Steinbrunn, M.D.
- University Hospital, Basel, Switzerland: Matthias Pfisterer, M.D.
- V.A. Medical Center, Long Beach and Cleveland Clinic Foundation: Robert Detrano, M.D., Ph.D.

---

For more details, see the full documentation in this repo. Contributions and feedback are welcome! 