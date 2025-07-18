# CVD Gradient: AI-Powered Cardiovascular Disease Risk Platform

## 🌟 Project Overview

**CVD Gradient** is a full-stack, AI-driven web platform for early detection and risk assessment of cardiovascular diseases (CVD). Inspired by the vision of **Ayushman Bharat**—making quality healthcare accessible and affordable for all—this project leverages advanced machine learning and modern web technologies to empower both patients and clinicians with actionable, personalized insights.

**Developed end-to-end by Himanshu Rautela (IIIT Kota):**
- Machine learning model development, training, and integration
- Backend API (FastAPI, Python, MongoDB)
- Frontend (React, MUI, Recharts)
- Secure authentication and doctor-patient linking
- Deployment and DevOps

---

## 🚀 Features

- **Real-Time CVD Risk Prediction:** Instantly assess your risk using clinical data and advanced ML models.
- **Role-Based Dashboards:** Secure, separate dashboards for patients and doctors.
- **Doctor-Patient Linking:** Patients can link to one or more doctors using unique Doctor IDs, granting access to their test history.
- **Comprehensive Test History:** All test parameters and results are stored and viewable in detail.
- **Multi-Patient Analytics:** Doctors can compare risk trends across all their patients with interactive, color-coded charts.
- **Research Transparency:** Full methodology, model performance, and details are available.
- **Mobile-First, Responsive UI:** Optimized for all devices, with a modern, accessible design.

---

## 🧠 Machine Learning Pipeline

### 1. **Data Preprocessing**
- **Dataset:** UCI Heart Disease Dataset ([Kaggle link](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data/data))
- **Cleaning:** Removal of irrelevant columns, handling missing values.
- **Encoding:** Categorical variables encoded using LabelEncoder.
- **Scaling:** Features scaled using StandardScaler for optimal model performance.

### 2. **Feature Selection**
- **LASSO (Least Absolute Shrinkage and Selection Operator):**
  - Automatically selects the most predictive features.
  - Reduces overfitting and improves interpretability.
- **Benchmarking:** Compared with Genetic Algorithm (GA) feature selection; LASSO chosen for best trade-off between accuracy and simplicity.

### 3. **Model Training**
- **Algorithm:** Gradient Boosting Classifier (ensemble of decision trees).
- **Hyperparameter Tuning:** Grid search and cross-validation for optimal settings.
- **Evaluation Metrics:** Accuracy, Precision, Recall, F1-score, ROC-AUC (see Research page for visualizations).

### 4. **Model Deployment**
- **Serialization:** Trained model, scaler, and selector saved using Joblib.
- **Serving:** FastAPI backend loads the model and exposes a `/predict` endpoint for real-time inference.
- **Explainability:** All input parameters and results are stored for each test, enabling full transparency.

---

## 🖥️ Frontend (React)

### **Tech Stack**
- **React 18** (functional components, hooks)
- **Material-UI (MUI):** Modern, accessible, and responsive UI components.
- **Recharts:** Interactive, multi-series charts for risk trends and analytics.
- **Axios:** Secure API communication.

### **Key Features**
- **Role-Based Routing:** Patients and doctors have separate login flows and dashboards, enforced at login and in the UI.
- **Authentication:** Secure signup and login with hashed passwords.
- **Doctor-Patient Linking:** Patients can link to any number of doctors using unique Doctor IDs; doctors see only their linked patients.
- **Test Submission & History:** Patients submit health data for prediction; all test parameters and results are stored and viewable in detail.
- **Multi-Patient Analytics:** Doctors can compare risk percent trends across all their patients.
- **UI/UX:** Mobile-first, fully responsive design with modern visuals and accessible forms.

---

## 🛠️ Backend (FastAPI, MongoDB)

### **API Endpoints**
- **POST `/signup`:** Register as patient or doctor (doctors receive a unique Doctor ID).
- **POST `/login`:** Role-based authentication; returns user info and Doctor ID if applicable.
- **POST `/predict`:** Accepts patient health data, returns risk score, and stores all input parameters in the patient’s test history.
- **POST `/link-doctor`:** Patients can link to any doctor by entering their Doctor ID; supports many-to-many relationships.
- **GET `/patients/summary?doctor_id=...`:** Doctors fetch all their linked patients and full test histories.

### **Security**
- **Password Hashing:** All passwords stored securely with bcrypt.
- **Role Enforcement:** Only patients can submit tests; only doctors can view multiple patients.
- **CORS:** Configured for secure frontend-backend integration.
- **Environment Variables:** All sensitive data (e.g., MongoDB URI) stored in `.env` (never committed).

### **Deployment**
- **Backend:** Deployed on Render.com (or similar).
- **Database:** MongoDB Atlas (cloud-hosted, secure).
- **Frontend:** Deployed on Vercel (or similar).

---

## 🗄️ Database Schema (MongoDB)

### **users**
- `_id` (ObjectId)
- `name`, `email`, `hashed_password`, `role` ("patient" or "doctor"), `createdAt`, `updatedAt`
- **For doctors:** `doctorId` (unique, shareable)

### **patients**
- `_id` (ObjectId)
- `userId` (ref: users._id)
- `doctorIds`: [doctorId] (**array**; supports many-to-many doctor-patient linking)
- `tests`: [
    - `date`, `result` (risk score), **all input parameters** (age, gender, cp, chol, etc.)
  ]

### **doctors**
- `_id` (ObjectId)
- `userId` (ref: users._id)
- `doctorId` (unique)
- `specialization`
- `patientIds`: [userId] (**array**; supports many-to-many doctor-patient linking)

### **predictions** (legacy, for research)
- Stores all predictions for research and analytics

---

## ⚙️ How to Run Locally

1. **Clone the repo:**
   ```bash
   git clone https://github.com/himanshu07rautela/CVD-Gradient.git
   cd CVD-Gradient
   ```

2. **Backend:**
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up your `.env` file with your MongoDB URI and any other secrets.
   - Start the server:
     ```bash
     uvicorn api:app --reload
     ```

3. **Frontend:**
   - Install Node dependencies:
     ```bash
     npm install
     ```
   - Start the React app:
     ```bash
     npm start
     ```
   - (Optional) Set `REACT_APP_API_URL` in your environment if you want to switch between local and deployed backend.

---

## 🌐 Live Demo

- **Frontend:** [https://cvd-gradient.vercel.app](https://cvd-gradient.vercel.app)
- **Backend:** [https://cvd-gradient.onrender.com](https://cvd-gradient.onrender.com)

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

## 💡 Contributing & Feedback

Contributions, bug reports, and feedback are welcome!  
Please open an issue or pull request on GitHub.

---

For more details, see the full documentation in this repo and the in-app Research pages. 