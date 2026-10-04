import { useEffect, useState } from "react";
import "./Heatmap.css";

const API_URL = "http://localhost:5000/api/parking";

function Heatmap() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSlots = async () => {
        try {
            const response = await fetch(`${API_URL}/slots`);

            if (!response.ok) {
                throw new Error("Unable to fetch parking slots");
            }

            const data = await response.json();

            setSlots(Array.isArray(data) ? data : []);
            setError("");
        } catch (err) {
            console.error("Heatmap error:", err);
            setError("Unable to load parking slots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();

        // Refresh every 5 seconds
        const interval = setInterval(fetchSlots, 5000);

        return () => clearInterval(interval);
    }, []);

    const availableCount = slots.filter(
        (slot) => slot.status === "available"
    ).length;

    const occupiedCount = slots.filter(
        (slot) => slot.status === "occupied"
    ).length;

    if (loading) {
        return (
            <section className="heatmap-section">
                <h2>🅿️ Parking Heatmap</h2>
                <p className="heatmap-loading">
                    Loading parking slots...
                </p>
            </section>
        );
    }

    return (
        <section className="heatmap-section">

            <div className="heatmap-header">
                <div>
                    <h2>🅿️ Parking Heatmap</h2>
                    <p>
                        Live parking slot availability
                    </p>
                </div>

                <div className="heatmap-summary">
                    <span className="legend available">
                        🟢 Available: {availableCount}
                    </span>

                    <span className="legend occupied">
                        🔴 Occupied: {occupiedCount}
                    </span>
                </div>
            </div>

            {error && (
                <div className="heatmap-error">
                    {error}
                </div>
            )}

            <div className="parking-map">

                {slots.map((slot) => {

                    const isOccupied =
                        slot.status === "occupied";

                    return (
                        <div
                            key={slot._id}
                            className={`parking-slot ${
                                isOccupied
                                    ? "slot-occupied"
                                    : "slot-available"
                            }`}
                        >

                            <div className="slot-number">
                                {slot.slotNumber}
                            </div>

                            <div className="slot-icon">
                                {isOccupied ? "🚗" : "🅿️"}
                            </div>

                            <div className="slot-status">
                                {isOccupied
                                    ? "OCCUPIED"
                                    : "AVAILABLE"}
                            </div>

                            {isOccupied &&
                                slot.vehicleNumber && (
                                    <div className="vehicle-number">
                                        {slot.vehicleNumber}
                                    </div>
                                )}

                            <div className="slot-floor">
                                {slot.floor}
                            </div>

                        </div>
                    );
                })}

            </div>

            {slots.length === 0 && (
                <div className="no-slots">
                    No parking slots found.
                </div>
            )}

        </section>
    );
}

export default Heatmap;