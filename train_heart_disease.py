import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectFromModel
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset
df = pd.read_csv('heart_disease_uci.csv')

# Drop columns that are not features (e.g., id, dataset)
df = df.drop(['id', 'dataset'], axis=1)

# Identify categorical and numerical columns
categorical_cols = df.select_dtypes(include=['object', 'bool']).columns.tolist()
numerical_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()

# Remove target and 'ca' from feature lists
target_col = 'num'
if target_col in categorical_cols:
    categorical_cols.remove(target_col)
if target_col in numerical_cols:
    numerical_cols.remove(target_col)
if 'ca' in categorical_cols:
    categorical_cols.remove('ca')
if 'ca' not in numerical_cols:
    numerical_cols.append('ca')

# Encode target as binary (0: no disease, 1: disease)
df[target_col] = (df[target_col] > 0).astype(int)

# Preprocessing for categorical data
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', LabelEncoder())
])

# Since LabelEncoder does not work directly in ColumnTransformer, use a function
def encode_categoricals(df, categorical_cols):
    for col in categorical_cols:
        df[col] = LabelEncoder().fit_transform(df[col].astype(str))
    return df

df = encode_categoricals(df, categorical_cols)

# Impute missing values for numerical columns
df[numerical_cols] = df[numerical_cols].apply(pd.to_numeric, errors='coerce')
df[numerical_cols] = df[numerical_cols].fillna(df[numerical_cols].median())

# Split features and target
X = df.drop(target_col, axis=1)
y = df[target_col]

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# LASSO for feature selection
lasso = LogisticRegression(penalty='l1', solver='liblinear', random_state=42, max_iter=1000)
selector = SelectFromModel(lasso)
selector.fit(X_scaled, y)
X_selected = selector.transform(X_scaled)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42, stratify=y)

# Train Gradient Boosting Classifier
gb = GradientBoostingClassifier(random_state=42)
gb.fit(X_train, y_train)

# Evaluate
y_pred = gb.predict(X_test)
print('Accuracy:', accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# Save the model and scaler/selector pipeline
joblib.dump({'model': gb, 'scaler': scaler, 'selector': selector}, 'heart_disease_gb_model.joblib') 