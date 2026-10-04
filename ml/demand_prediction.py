import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# ==========================================================
# 1. LOAD DATASET
# ==========================================================

DATASET_PATH = "dataset/parking_data.csv"

print("==============================================")
print("     SMART PARKING DEMAND PREDICTION")
print("==============================================")

print("\nLoading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset loaded successfully.")
print(f"Number of records: {len(df)}")

# ==========================================================
# 2. CHECK DATASET
# ==========================================================

required_columns = [
    "date",
    "hour",
    "day",
    "parking_area",
    "vehicle_type",
    "parking_duration",
    "amount",
    "occupied_slots",
    "total_slots",
    "occupancy"
]

missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]

if missing_columns:
    print("\nERROR: Missing columns:")
    print(missing_columns)
    raise SystemExit(1)

print("\nDataset columns verified.")

# ==========================================================
# 3. PREPARE DATA
# ==========================================================

# Convert date to datetime
df["date"] = pd.to_datetime(df["date"])

# Extract useful date information
df["day_number"] = df["date"].dt.dayofweek

# Make sure numeric columns are numeric
numeric_columns = [
    "hour",
    "parking_duration",
    "amount",
    "occupied_slots",
    "total_slots",
    "occupancy"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )

# Remove invalid rows
df = df.dropna()

print(f"Usable records: {len(df)}")

# ==========================================================
# 4. FEATURES AND TARGET
# ==========================================================

features = [
    "hour",
    "day_number",
    "parking_area",
    "vehicle_type",
    "parking_duration",
    "amount"
]

target = "occupancy"

X = df[features]
y = df[target]

# ==========================================================
# 5. CATEGORICAL AND NUMERICAL FEATURES
# ==========================================================

categorical_features = [
    "parking_area",
    "vehicle_type"
]

numeric_features = [
    "hour",
    "day_number",
    "parking_duration",
    "amount"
]

# ==========================================================
# 6. PREPROCESSING
# ==========================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)

# ==========================================================
# 7. RANDOM FOREST MODEL
# ==========================================================

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42,
    max_depth=10
)

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)

# ==========================================================
# 8. TRAIN / TEST SPLIT
# ==========================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining model...")

pipeline.fit(
    X_train,
    y_train
)

print("Model training completed.")

# ==========================================================
# 9. MODEL EVALUATION
# ==========================================================

predictions = pipeline.predict(X_test)

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)

print("\n==============================================")
print("MODEL PERFORMANCE")
print("==============================================")

print(
    f"Mean Absolute Error: {mae:.2f}%"
)

print(
    f"R² Score: {r2:.2f}"
)

# ==========================================================
# 10. DEMAND CLASSIFICATION
# ==========================================================

def get_demand_level(occupancy):
    if occupancy < 40:
        return "LOW"
    elif occupancy < 70:
        return "MEDIUM"
    else:
        return "HIGH"


# ==========================================================
# 11. EXAMPLE PREDICTION
# ==========================================================

print("\n==============================================")
print("PARKING DEMAND PREDICTION")
print("==============================================")

example = pd.DataFrame(
    [
        {
            "hour": 18,
            "day_number": 4,
            "parking_area": "A",
            "vehicle_type": "Car",
            "parking_duration": 50,
            "amount": 20
        }
    ]
)

predicted_occupancy = pipeline.predict(
    example
)[0]

predicted_occupancy = np.clip(
    predicted_occupancy,
    0,
    100
)

demand = get_demand_level(
    predicted_occupancy
)

print(f"Prediction Hour: 18:00")
print(
    f"Predicted Occupancy: "
    f"{predicted_occupancy:.2f}%"
)
print(f"Predicted Demand: {demand}")

print("\n==============================================")
print("DEMAND PREDICTION COMPLETED")
print("==============================================")