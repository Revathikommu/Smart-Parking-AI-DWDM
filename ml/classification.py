import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


DATASET_PATH = "dataset/parking_data.csv"


print("==============================================")
print("       SMART PARKING DEMAND CLASSIFICATION")
print("==============================================")


# ------------------------------------------------
# 1. LOAD DATASET
# ------------------------------------------------

print("\nLoading dataset...")

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully.")
print(f"Number of records: {len(df)}")


# ------------------------------------------------
# 2. CHECK REQUIRED COLUMNS
# ------------------------------------------------

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


# ------------------------------------------------
# 3. DATA PREPROCESSING
# ------------------------------------------------

df["date"] = pd.to_datetime(df["date"])

# Convert day into numerical value
df["day_number"] = df["date"].dt.dayofweek

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

df = df.dropna()

print(f"Usable records: {len(df)}")


# ------------------------------------------------
# 4. CREATE DEMAND CLASS
# ------------------------------------------------

def get_demand_class(occupancy):

    if occupancy < 40:
        return "LOW"

    elif occupancy < 70:
        return "MEDIUM"

    else:
        return "HIGH"


df["demand_class"] = df["occupancy"].apply(
    get_demand_class
)


print("\nDemand classes created.")

print("\nClass distribution:")
print(df["demand_class"].value_counts())


# ------------------------------------------------
# 5. FEATURES AND TARGET
# ------------------------------------------------

features = [
    "hour",
    "day_number",
    "parking_area",
    "vehicle_type",
    "parking_duration",
    "amount"
]

target = "demand_class"


X = df[features]

y = df[target]


# ------------------------------------------------
# 6. DEFINE CATEGORICAL AND NUMERIC FEATURES
# ------------------------------------------------

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


# ------------------------------------------------
# 7. PREPROCESSING PIPELINE
# ------------------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        ),

        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ------------------------------------------------
# 8. RANDOM FOREST CLASSIFIER
# ------------------------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    max_depth=10
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ------------------------------------------------
# 9. SPLIT DATA
# ------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ------------------------------------------------
# 10. TRAIN MODEL
# ------------------------------------------------

print("\nTraining classification model...")

pipeline.fit(
    X_train,
    y_train
)

print("Model training completed.")


# ------------------------------------------------
# 11. PREDICTION
# ------------------------------------------------

predictions = pipeline.predict(X_test)


# ------------------------------------------------
# 12. MODEL PERFORMANCE
# ------------------------------------------------

accuracy = accuracy_score(
    y_test,
    predictions
)


print("\n==============================================")
print("MODEL PERFORMANCE")
print("==============================================")


print(f"Accuracy: {accuracy * 100:.2f}%")


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ------------------------------------------------
# 13. TEST NEW PARKING CONDITION
# ------------------------------------------------

print("\n==============================================")
print("PARKING DEMAND CLASSIFICATION")
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


predicted_class = pipeline.predict(
    example
)[0]


print("Prediction Hour: 18:00")

print(
    f"Predicted Demand Class: {predicted_class}"
)


# ------------------------------------------------
# 14. FINAL MESSAGE
# ------------------------------------------------

print("\n==============================================")
print("CLASSIFICATION COMPLETED")
print("==============================================")