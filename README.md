# CVD Gradient: AI-Powered Cardiovascular Disease Prediction Platform

## 🌟 About the Project
CVD Gradient is an AI-driven platform designed to empower early detection and risk assessment of cardiovascular diseases. Inspired by the vision of **Ayushman Bharat**—making quality healthcare accessible and affordable for all—this project leverages cutting-edge machine learning to help both patients and clinicians make informed decisions.

**Developed end-to-end by Himanshu Rautela (IIIT Kota):**
- Machine learning model development and integration
- Backend API (FastAPI, Python)
- Frontend (React, MUI, Recharts)
- Database (MongoDB Atlas)
- Deployment and DevOps

## 🧠 Machine Learning Methodology
CVD Gradient uses a robust ML pipeline for accurate cardiovascular disease prediction:

- **Dataset:** UCI Heart Disease Dataset (see credits below)
- **Feature Selection:**
  - **LASSO (Least Absolute Shrinkage and Selection Operator):** Used to select the most relevant features by penalizing less important ones, improving model interpretability and reducing overfitting.
  - **Comparison with Genetic Algorithm (GA):** LASSO was benchmarked against GA-based feature selection, with results visualized and compared in the research section.
- **Classification Model:**
  - **Gradient Boosting Classifier:** An ensemble method that builds a strong predictive model by combining multiple weak learners (decision trees). Chosen for its high accuracy and robustness on tabular medical data.
- **Model Evaluation:**
  - Metrics such as accuracy, precision, recall, F1-score, and ROC-AUC were used to assess model performance.
  - Extensive analysis and visualization of results are available in the research section of the platform.
- **Deployment:**
  - The trained model is serialized using Joblib and served via FastAPI endpoints for real-time predictions.

## 🖥️ Technical Architecture

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI) for responsive, accessible design
- **Charts:** Recharts for interactive data visualization
- **API Integration:** Axios for secure, efficient communication with the backend
- **Features:**
  - Patient and doctor dashboards
  - Real-time risk prediction forms
  - Research and model transparency pages
  - Fully responsive and mobile-friendly design

### Backend
- **Framework:** FastAPI (Python)
- **ML Libraries:** Scikit-learn (LASSO, Gradient Boosting), Joblib
- **Database:** MongoDB Atlas for secure, scalable data storage
- **Endpoints:**
  - User authentication (role-based)
  - Prediction API (accepts health data, returns risk score and explanation)
  - Research/model insights API
- **Security:**
  - Environment variables for sensitive data (e.g., MongoDB URI)
  - CORS configuration for frontend-backend integration

### ML Pipeline
- **Data Preprocessing:**
  - Handling missing values, encoding categorical variables, feature scaling
- **Feature Selection:**
  - LASSO regression to identify and retain the most predictive features
- **Model Training:**
  - Gradient Boosting Classifier trained and validated on the processed dataset
- **Model Serving:**
  - Model exported with Joblib and loaded by FastAPI for inference

## 🌐 Live Demo
[Access the platform here](https://cvd-gradient.vercel.app/patient-dashboard)

## 🛠️ Tech Stack
- **Frontend:** React 18, Material-UI, Recharts, Axios
- **Backend:** FastAPI, Scikit-learn, Joblib
- **Database:** MongoDB Atlas
- **ML:** LASSO, Gradient Boosting, UCI Heart Disease Dataset

## 📦 How to Run Locally
1. **Clone the repo:**
```bash
   git clone https://github.com/himanshu07rautela/CVD-Gradient.git
   cd CVD-Gradient
```
2. **Backend:**
   - Install Python dependencies: `pip install -r requirements.txt`
   - Start server: `uvicorn api:app --reload --host 0.0.0.0 --port 8000`
3. **Frontend:**
   - Install Node dependencies: `npm install`
   - Start React app: `npm start`

## 📄 License
MIT License

## 🤝 Dataset Credits
UCI Heart Disease Dataset ([Kaggle link](https://www.kaggle.com/datasets/redwankarimsony/heart-disease-data/data))

**Creators:**
- Hungarian Institute of Cardiology, Budapest: Andras Janosi, M.D.
- University Hospital, Zurich, Switzerland: William Steinbrunn, M.D.
- University Hospital, Basel, Switzerland: Matthias Pfisterer, M.D.
- V.A. Medical Center, Long Beach and Cleveland Clinic Foundation: Robert Detrano, M.D., Ph.D.

---

For more details, see the full documentation in this repo. Contributions and feedback are welcome! 