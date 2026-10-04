import React, { useEffect, useState } from "react";

const Alerts = () => {
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
                console.error("Alert API Error:", err);
                setError("Unable to load parking alerts.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="alerts-section">
                <h2>🚨 Parking Alerts</h2>
                <p>Checking parking conditions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alerts-section">
                <h2>🚨 Parking Alerts</h2>
                <p className="alert-error">{error}</p>
            </div>
        );
    }

    const occupancy =
        mlData.demand_prediction.predicted_occupancy;

    const demand =
        mlData.demand_prediction.demand;

    let alertType;
    let alertTitle;
    let alertMessage;

    if (demand === "HIGH" || occupancy >= 75) {
        alertType = "high";
        alertTitle = "⚠️ High Parking Demand";
        alertMessage =
            "Parking demand is high. Available parking spaces may become limited.";
    } else if (occupancy >= 50) {
        alertType = "medium";
        alertTitle = "🟡 Moderate Parking Demand";
        alertMessage =
            "Parking demand is moderate. Some parking spaces are still available.";
    } else {
        alertType = "low";
        alertTitle = "🟢 Parking Availability Good";
        alertMessage =
            "Parking demand is currently low. Sufficient parking spaces are available.";
    }

    return (
        <div className="alerts-section">

            <h2>🚨 Parking Alerts</h2>

            <div className={`alert-card ${alertType}`}>

                <h3>{alertTitle}</h3>

                <div className="alert-occupancy">
                    {occupancy}%
                </div>

                <p>
                    Predicted Occupancy
                </p>

                <p className="alert-demand">
                    Demand Level: <strong>{demand}</strong>
                </p>

                <p className="alert-message">
                    {alertMessage}
                </p>

            </div>

        </div>
    );
};

export default Alerts;