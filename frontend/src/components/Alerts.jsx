import React, { useEffect, useState } from "react";

const Alerts = () => {

    const [mlData, setMlData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAlerts = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/ml/summary"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch ML summary");
            }

            const data = await response.json();

            console.log("Alert ML Data:", data);

            setMlData(data);
            setError("");

        } catch (err) {

            console.error("Alert API Error:", err);

            setError(
                "Unable to load parking alerts."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        // Load immediately
        fetchAlerts();

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchAlerts();
        }, 5000);

        // Clear interval when component is removed
        return () => {
            clearInterval(interval);
        };

    }, []);


    if (loading) {

        return (
            <div className="alerts-section">

                <h2>🚨 Parking Alerts</h2>

                <p>
                    Checking parking conditions...
                </p>

            </div>
        );
    }


    if (error) {

        return (
            <div className="alerts-section">

                <h2>🚨 Parking Alerts</h2>

                <p className="alert-error">
                    {error}
                </p>

            </div>
        );
    }


    if (!mlData) {
        return null;
    }


    // Get current occupancy
    const occupancy =
        Number(
            mlData.demand_prediction?.predicted_occupancy
        ) || 0;


    // Get current demand
    const demand =
        mlData.demand_prediction?.demand || "LOW";


    let alertType;
    let alertTitle;
    let alertMessage;


    // HIGH demand
    if (
        demand === "HIGH" ||
        occupancy >= 75
    ) {

        alertType = "high";

        alertTitle =
            "⚠️ High Parking Demand";

        alertMessage =
            "Parking demand is high. Available parking spaces may become limited.";

    }


    // MEDIUM demand
    else if (
        demand === "MEDIUM" ||
        occupancy >= 50
    ) {

        alertType = "medium";

        alertTitle =
            "🟡 Moderate Parking Demand";

        alertMessage =
            "Parking demand is moderate. Some parking spaces are still available.";

    }


    // LOW demand
    else {

        alertType = "low";

        alertTitle =
            "🟢 Parking Availability Good";

        alertMessage =
            "Parking demand is currently low. Sufficient parking spaces are available.";

    }


    return (

        <div className="alerts-section">

            <h2>
                🚨 Parking Alerts
            </h2>


            <div
                className={`alert-card ${alertType}`}
            >

                <h3>
                    {alertTitle}
                </h3>


                <div className="alert-occupancy">
                    {occupancy}%
                </div>


                <p>
                    Predicted Occupancy
                </p>


                <p className="alert-demand">

                    Demand Level:{" "}

                    <strong>
                        {demand}
                    </strong>

                </p>


                <p className="alert-message">

                    {alertMessage}

                </p>

            </div>

        </div>

    );
};


export default Alerts;