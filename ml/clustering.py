import pandas as pd

from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


DATASET_PATH = "dataset/parking_data.csv"


print("==============================================")
print("        SMART PARKING CLUSTERING")
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
    "hour",
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
# 3. CONVERT DATA TO NUMERIC
# ------------------------------------------------

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

df = df.dropna(
    subset=numeric_columns
)


print(f"Usable records: {len(df)}")


# ------------------------------------------------
# 4. SELECT FEATURES FOR CLUSTERING
# ------------------------------------------------

features = [
    "hour",
    "parking_duration",
    "amount",
    "occupied_slots",
    "occupancy"
]


X = df[features]


print("\nFeatures used for clustering:")

for feature in features:
    print(f"- {feature}")


# ------------------------------------------------
# 5. STANDARDIZE FEATURES
# ------------------------------------------------

print("\nStandardizing data...")

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

print("Data standardization completed.")


# ------------------------------------------------
# 6. CREATE K-MEANS MODEL
# ------------------------------------------------

print("\nCreating K-Means clustering model...")

number_of_clusters = 3

kmeans = KMeans(
    n_clusters=number_of_clusters,
    random_state=42,
    n_init=10
)


# ------------------------------------------------
# 7. TRAIN CLUSTERING MODEL
# ------------------------------------------------

print("Training clustering model...")

clusters = kmeans.fit_predict(
    X_scaled
)

print("Clustering completed.")


# ------------------------------------------------
# 8. ADD CLUSTER TO DATASET
# ------------------------------------------------

df["cluster"] = clusters


# ------------------------------------------------
# 9. CALCULATE SILHOUETTE SCORE
# ------------------------------------------------

silhouette = silhouette_score(
    X_scaled,
    clusters
)


print("\n==============================================")
print("CLUSTERING PERFORMANCE")
print("==============================================")


print(
    f"Silhouette Score: {silhouette:.2f}"
)


# ------------------------------------------------
# 10. DISPLAY CLUSTER INFORMATION
# ------------------------------------------------

print("\n==============================================")
print("PARKING CLUSTER ANALYSIS")
print("==============================================")


cluster_summary = df.groupby("cluster").agg(
    average_hour=("hour", "mean"),
    average_duration=("parking_duration", "mean"),
    average_amount=("amount", "mean"),
    average_occupied_slots=("occupied_slots", "mean"),
    average_occupancy=("occupancy", "mean"),
    record_count=("cluster", "count")
).round(2)


print("\nCluster Summary:")

print(cluster_summary)


# ------------------------------------------------
# 11. IDENTIFY CLUSTER TYPES
# ------------------------------------------------

print("\n==============================================")
print("CLUSTER INTERPRETATION")
print("==============================================")


for cluster_id in cluster_summary.index:

    occupancy = cluster_summary.loc[
        cluster_id,
        "average_occupancy"
    ]

    if occupancy < 40:

        cluster_type = "LOW PARKING DEMAND"

    elif occupancy < 70:

        cluster_type = "MEDIUM PARKING DEMAND"

    else:

        cluster_type = "HIGH PARKING DEMAND"


    print(
        f"Cluster {cluster_id}: {cluster_type}"
    )

    print(
        f"  Average Occupancy: {occupancy:.2f}%"
    )

    print(
        f"  Average Parking Duration: "
        f"{cluster_summary.loc[cluster_id, 'average_duration']:.2f} minutes"
    )

    print(
        f"  Average Amount: "
        f"₹{cluster_summary.loc[cluster_id, 'average_amount']:.2f}"
    )

    print(
        f"  Records: "
        f"{int(cluster_summary.loc[cluster_id, 'record_count'])}"
    )

    print()


# ------------------------------------------------
# 12. FIND CLUSTER FOR EXAMPLE PARKING CONDITION
# ------------------------------------------------

print("==============================================")
print("EXAMPLE PARKING CLUSTER")
print("==============================================")


example = pd.DataFrame(
    [
        {
            "hour": 18,
            "parking_duration": 50,
            "amount": 20,
            "occupied_slots": 7,
            "occupancy": 70
        }
    ]
)


example_scaled = scaler.transform(
    example[features]
)


predicted_cluster = kmeans.predict(
    example_scaled
)[0]


print("Example Parking Condition:")
print("Hour: 18:00")
print("Parking Duration: 50 minutes")
print("Amount: ₹20")
print("Occupied Slots: 7")
print("Occupancy: 70%")


print(
    f"\nAssigned Cluster: {predicted_cluster}"
)


example_occupancy = cluster_summary.loc[
    predicted_cluster,
    "average_occupancy"
]


if example_occupancy < 40:

    print("Cluster Type: LOW PARKING DEMAND")

elif example_occupancy < 70:

    print("Cluster Type: MEDIUM PARKING DEMAND")

else:

    print("Cluster Type: HIGH PARKING DEMAND")


# ------------------------------------------------
# 13. COMPLETION MESSAGE
# ------------------------------------------------

print("\n==============================================")
print("CLUSTERING COMPLETED SUCCESSFULLY")
print("==============================================")