import React, { useState } from "react";

const ExitForm = ({ onSuccess }) => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!vehicleNumber.trim()) {
            setError("Please enter vehicle number.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/parking/exit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        vehicleNumber:
                            vehicleNumber.trim().toUpperCase()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to exit vehicle."
                );
            }

            setMessage(
                `Vehicle ${vehicleNumber.toUpperCase()} exited successfully.`
            );

            setVehicleNumber("");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Exit error:", error);

            setError(
                error.message ||
                "Error connecting to server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">

            <h2>🚗 Vehicle Exit</h2>

            <form onSubmit={handleSubmit}>

                <label>
                    Vehicle Number
                </label>

                <input
                    type="text"
                    placeholder="AP39AB1234"
                    value={vehicleNumber}
                    onChange={(e) =>
                        setVehicleNumber(e.target.value)
                    }
                    autoComplete="off"
                />

                {error && (
                    <div className="form-error">
                        ⚠️ {error}
                    </div>
                )}

                {message && (
                    <div className="form-success">
                        ✅ {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="exit-button"
                    disabled={loading}
                >
                    {loading
                        ? "Processing..."
                        : "Exit Vehicle"}
                </button>

            </form>

        </div>
    );
};

export default ExitForm;