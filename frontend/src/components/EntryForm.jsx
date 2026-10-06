import React, { useState } from "react";

const EntryForm = ({ slots, onSuccess }) => {
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [parkingArea, setParkingArea] = useState("A");
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

        if (!selectedSlot) {
            setError("Please select a parking slot.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/parking/entry",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        vehicleNumber:
                            vehicleNumber.trim().toUpperCase(),
                        slotNumber: selectedSlot,
                        parkingArea: parkingArea.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Unable to park vehicle."
                );
            }

            setMessage(
                `Vehicle ${vehicleNumber.toUpperCase()} parked successfully in ${selectedSlot}.`
            );

            setVehicleNumber("");
            setSelectedSlot("");

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {
            console.error("Entry error:", error);

            setError(
                error.message ||
                "Error connecting to server."
            );
        } finally {
            setLoading(false);
        }
    };

    const availableSlots = (slots || []).filter(
        (slot) => slot.status === "available"
    );

    return (
        <div className="form-card">

            <h2>🚘 Vehicle Entry</h2>

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

                <label>
                    Parking Slot
                </label>

                <select
                    value={selectedSlot}
                    onChange={(e) =>
                        setSelectedSlot(e.target.value)
                    }
                >
                    <option value="">
                        Select Slot
                    </option>

                    {availableSlots.map((slot) => (
                        <option
                            key={
                                slot._id ||
                                slot.slotNumber
                            }
                            value={slot.slotNumber}
                        >
                            {slot.slotNumber}
                        </option>
                    ))}
                </select>

                <label>
                    Parking Area
                </label>

                <input
                    type="text"
                    value={parkingArea}
                    onChange={(e) =>
                        setParkingArea(e.target.value)
                    }
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
                    disabled={loading}
                >
                    {loading
                        ? "Parking..."
                        : "Park Vehicle"}
                </button>

            </form>

        </div>
    );
};

export default EntryForm;