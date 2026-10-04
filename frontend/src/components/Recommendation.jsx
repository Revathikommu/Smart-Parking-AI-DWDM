import React, { useEffect, useState } from "react";

const Recommendation = () => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        fetch("http://localhost:5000/api/recommendation")
            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch recommendation"
                    );
                }

                return response.json();
            })
            .then((data) => {

                if (data.recommended) {
                    setRecommendation(
                        data.recommendation
                    );
                } else {
                    setRecommendation(null);
                }

                setLoading(false);
            })
            .catch((err) => {

                console.error(
                    "Recommendation API Error:",
                    err
                );

                setError(
                    "Unable to load parking recommendation."
                );

                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="recommendation-section">
                <h2>
                    🅿️ Smart Parking Recommendation
                </h2>

                <p>
                    Finding the best available parking slot...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendation-section">

                <h2>
                    🅿️ Smart Parking Recommendation
                </h2>

                <p className="recommendation-error">
                    {error}
                </p>

            </div>
        );
    }

    return (
        <div className="recommendation-section">

            <h2>
                🅿️ Smart Parking Recommendation
            </h2>

            {recommendation ? (

                <div className="recommendation-card">

                    <div className="recommendation-icon">
                        🅿️
                    </div>

                    <h3>
                        Recommended Parking Slot
                    </h3>

                    <div className="recommended-slot">
                        {recommendation.slotNumber}
                    </div>

                    <p>
                        <strong>Area:</strong>{" "}
                        {recommendation.area}
                    </p>

                    <p>
                        <strong>Floor:</strong>{" "}
                        {recommendation.floor}
                    </p>

                    <p className="recommendation-reason">
                        ✅ {recommendation.reason}
                    </p>

                </div>

            ) : (

                <div className="no-slot">

                    <h3>
                        ⚠️ No Parking Slots Available
                    </h3>

                    <p>
                        All parking slots are currently occupied.
                    </p>

                </div>

            )}

        </div>
    );
};

export default Recommendation;