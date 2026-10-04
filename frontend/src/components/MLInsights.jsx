import React, { useEffect, useState } from "react";

const MLInsights = () => {
    const [mlData, setMlData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
            })
            .catch((err) => {
                console.error("ML API Error:", err);
                setError("Unable to load AI insights");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="ml-section">
                <h2>🤖 AI Parking Insights</h2>
                <p>Loading AI insights...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ml-section">
                <h2>🤖 AI Parking Insights</h2>
                <p className="ml-error">{error}</p>
            </div>
        );
    }

    return (
        <div className="ml-section">

            <h2>🤖 AI Parking Insights</h2>

            <div className="ml-cards">

                {/* Demand Prediction */}
                <div className="ml-card">
                    <h3>📊 Demand Prediction</h3>

                    <p>
                        <strong>Predicted Occupancy</strong>
                    </p>

                    <div className="ml-value">
                        {mlData.demand_prediction.predicted_occupancy}%
                    </div>

                    <p>
                        Demand:
                        <span className="high-demand">
                            {" "}
                            {mlData.demand_prediction.demand}
                        </span>
                    </p>
                </div>


                {/* Classification */}
                <div className="ml-card">
                    <h3>🎯 Classification</h3>

                    <p>
                        <strong>Prediction</strong>
                    </p>

                    <div className="ml-value">
                        {mlData.classification.prediction}
                    </div>

                    <p>
                        Accuracy:
                        <strong>
                            {" "}
                            {mlData.classification.accuracy}%
                        </strong>
                    </p>
                </div>


                {/* Model Performance */}
                <div className="ml-card">
                    <h3>⚙️ Model Performance</h3>

                    <p>
                        <strong>R² Score:</strong>{" "}
                        {mlData.demand_prediction.r2_score}
                    </p>

                    <p>
                        <strong>MAE:</strong>{" "}
                        {mlData.demand_prediction.mae}
                    </p>

                    <p>
                        <strong>Silhouette Score:</strong>{" "}
                        {mlData.clustering.silhouette_score}
                    </p>
                </div>


                {/* Clustering */}
                <div className="ml-card">
                    <h3>🔵 Clustering</h3>

                    <p>
                        <strong>High Demand Cluster:</strong>{" "}
                        {mlData.clustering.high_demand_cluster}
                    </p>

                    <p>
                        <strong>Average Occupancy:</strong>{" "}
                        {mlData.clustering.average_occupancy}%
                    </p>
                </div>

            </div>
        </div>
    );
};

export default MLInsights;