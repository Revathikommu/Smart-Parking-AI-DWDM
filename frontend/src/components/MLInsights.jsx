import React, { useEffect, useState } from "react";

const MLInsights = () => {

    const [mlData, setMlData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMLData = () => {

        fetch("http://localhost:5000/api/ml/summary")
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to fetch ML data");
                }

                return response.json();
            })
            .then((data) => {

                setMlData(data);
                setLoading(false);
                setError("");

            })
            .catch((err) => {

                console.error("ML API Error:", err);

                setError(
                    "Unable to load AI parking insights."
                );

                setLoading(false);
            });
    };


    useEffect(() => {

        // Load immediately
        fetchMLData();

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchMLData();
        }, 5000);

        // Stop timer when component is removed
        return () => {
            clearInterval(interval);
        };

    }, []);


    if (loading) {

        return (
            <div className="ml-section">

                <h2>🤖 AI Parking Insights</h2>

                <p>
                    Loading AI parking insights...
                </p>

            </div>
        );
    }


    if (error) {

        return (
            <div className="ml-section">

                <h2>🤖 AI Parking Insights</h2>

                <p className="ml-error">
                    {error}
                </p>

            </div>
        );
    }


    if (!mlData) {
        return null;
    }


    const occupancy =
        mlData.demand_prediction.predicted_occupancy;

    const demand =
        mlData.demand_prediction.demand;

    const classification =
        mlData.classification.prediction;

    const accuracy =
        mlData.classification.accuracy;

    const r2 =
        mlData.demand_prediction.r2_score;

    const mae =
        mlData.demand_prediction.mae;

    const silhouette =
        mlData.clustering.silhouette_score;

    const cluster =
        mlData.clustering.high_demand_cluster;

    const averageOccupancy =
        mlData.clustering.average_occupancy;


    return (

        <div className="ml-section">

            <h2>
                🤖 AI Parking Insights
            </h2>


            <div className="ml-cards">


                {/* =========================
                    DEMAND PREDICTION
                ========================= */}

                <div className="ml-card">

                    <h3>
                        📊 Demand Prediction
                    </h3>

                    <p>
                        <strong>
                            Predicted Occupancy
                        </strong>
                    </p>

                    <div className="ml-value">
                        {occupancy}%
                    </div>

                    <p>
                        Demand:{" "}

                        <strong
                            className={
                                demand === "HIGH"
                                    ? "high-demand"
                                    : ""
                            }
                        >
                            {demand}
                        </strong>
                    </p>

                </div>


                {/* =========================
                    CLASSIFICATION
                ========================= */}

                <div className="ml-card">

                    <h3>
                        🎯 Classification
                    </h3>

                    <p>
                        <strong>
                            Prediction
                        </strong>
                    </p>

                    <div className="ml-value">
                        {classification}
                    </div>

                    <p>
                        Accuracy:{" "}

                        <strong>
                            {accuracy}%
                        </strong>
                    </p>

                </div>


                {/* =========================
                    MODEL PERFORMANCE
                ========================= */}

                <div className="ml-card">

                    <h3>
                        ⚙️ Model Performance
                    </h3>

                    <p>
                        <strong>
                            R² Score:
                        </strong>{" "}
                        {r2}
                    </p>

                    <p>
                        <strong>
                            MAE:
                        </strong>{" "}
                        {mae}
                    </p>

                    <p>
                        <strong>
                            Silhouette Score:
                        </strong>{" "}
                        {silhouette}
                    </p>

                </div>


                {/* =========================
                    CLUSTERING
                ========================= */}

                <div className="ml-card">

                    <h3>
                        🔵 Clustering
                    </h3>

                    <p>
                        <strong>
                            Current Demand Cluster:
                        </strong>{" "}
                        {cluster}
                    </p>

                    <p>
                        <strong>
                            Average Occupancy:
                        </strong>{" "}
                        {averageOccupancy}%
                    </p>

                </div>


            </div>

        </div>
    );
};

export default MLInsights;