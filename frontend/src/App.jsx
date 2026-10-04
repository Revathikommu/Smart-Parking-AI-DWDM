import { useEffect, useState } from "react";
import "./App.css";
import Analytics from "./components/Analytics";
import Heatmap from "./components/Heatmap";
import MLInsights from "./components/MLInsights";
import Recommendation from "./components/Recommendation";
import Alerts from "./components/Alerts";

const API_URL = "http://localhost:5000/api/parking";

function App() {
    const [slots, setSlots] = useState([]);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [parkingArea, setParkingArea] = useState("A");
    const [exitVehicleNumber, setExitVehicleNumber] = useState("");
    const [message, setMessage] = useState("");

    // ==========================================
    // GET PARKING SLOTS
    // ==========================================

    const fetchSlots = async () => {
        try {
            const response = await fetch(`${API_URL}/slots`);
            const data = await response.json();

            setSlots(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };

    useEffect(() => {
    fetchSlots();

    const interval = setInterval(() => {
        fetchSlots();
    }, 5000);

    return () => {
        clearInterval(interval);
    };
}, []);

    // ==========================================
    // VEHICLE ENTRY
    // ==========================================

    const handleEntry = async (e) => {
        e.preventDefault();

        if (!vehicleNumber || !selectedSlot) {
            setMessage(
                "Please enter vehicle number and select a slot."
            );
            return;
        }

        try {
            const response = await fetch(`${API_URL}/entry`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    vehicleNumber,
                    slotNumber: selectedSlot,
                    parkingArea
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Unable to park vehicle."
                );
                return;
            }

            setMessage("Vehicle parked successfully!");

            setVehicleNumber("");
            setSelectedSlot("");

            await fetchSlots();

        } catch (error) {
            console.error("Entry error:", error);
            setMessage("Error connecting to server.");
        }
    };

    // ==========================================
    // VEHICLE EXIT
    // ==========================================

    const handleExit = async (e) => {
        e.preventDefault();

        if (!exitVehicleNumber) {
            setMessage("Please enter vehicle number.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/exit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    vehicleNumber: exitVehicleNumber
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Unable to exit vehicle."
                );
                return;
            }

            setMessage(
                `Vehicle exited successfully. Amount: ₹${data.record.amount}`
            );

            setExitVehicleNumber("");

            await fetchSlots();

        } catch (error) {
            console.error("Exit error:", error);
            setMessage("Error connecting to server.");
        }
    };

    // ==========================================
    // PARKING STATISTICS
    // ==========================================

    const totalSlots = slots.length;

    const availableSlots = slots.filter(
        (slot) => slot.status === "available"
    ).length;

    const occupiedSlots = slots.filter(
        (slot) => slot.status === "occupied"
    ).length;

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="app">

            {/* ==========================================
                HEADER
            ========================================== */}

            <header className="header">
                <h1>🚗 Smart Parking</h1>
            </header>

            <main className="container">

                {/* ==========================================
                    STATISTICS
                ========================================== */}

                <section className="stats">

                    <div className="stat-card">
                        <h3>Total Slots</h3>
                        <p>{totalSlots}</p>
                    </div>

                    <div className="stat-card available-card">
                        <h3>Available</h3>
                        <p>{availableSlots}</p>
                    </div>

                    <div className="stat-card occupied-card">
                        <h3>Occupied</h3>
                        <p>{occupiedSlots}</p>
                    </div>

                </section>

                {/* ==========================================
                    MESSAGE
                ========================================== */}

                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}

                {/* ==========================================
                    PARKING SLOTS
                ========================================== */}

                <section className="section">

                    <h2>Parking Slots</h2>

                    <div className="slots-grid">

                        {slots.map((slot) => (

                            <div
                                className={`slot ${
                                    slot.status === "occupied"
                                        ? "occupied"
                                        : "available"
                                }`}
                                key={slot._id}
                            >

                                <h3>
                                    {slot.slotNumber}
                                </h3>

                                <p>
                                    {slot.floor}
                                </p>

                                <strong>
                                    {slot.status === "occupied"
                                        ? "OCCUPIED"
                                        : "AVAILABLE"}
                                </strong>

                                {slot.vehicleNumber && (
                                    <small>
                                        {slot.vehicleNumber}
                                    </small>
                                )}

                            </div>

                        ))}

                    </div>

                </section>

                {/* ==========================================
                    VEHICLE ENTRY / EXIT
                ========================================== */}

                <section className="forms">

                    {/* ======================================
                        VEHICLE ENTRY
                    ====================================== */}

                    <div className="form-card">

                        <h2>
                            🚘 Vehicle Entry
                        </h2>

                        <form onSubmit={handleEntry}>

                            <label>
                                Vehicle Number
                            </label>

                            <input
                                type="text"
                                placeholder="AP39AB1234"
                                value={vehicleNumber}
                                onChange={(e) =>
                                    setVehicleNumber(
                                        e.target.value
                                    )
                                }
                            />

                            <label>
                                Parking Slot
                            </label>

                            <select
                                value={selectedSlot}
                                onChange={(e) =>
                                    setSelectedSlot(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Slot
                                </option>

                                {slots
                                    .filter(
                                        (slot) =>
                                            slot.status ===
                                            "available"
                                    )
                                    .map((slot) => (

                                        <option
                                            key={slot._id}
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
                                    setParkingArea(
                                        e.target.value
                                    )
                                }
                            />

                            <button type="submit">
                                Park Vehicle
                            </button>

                        </form>

                    </div>

                    {/* ======================================
                        VEHICLE EXIT
                    ====================================== */}

                    <div className="form-card">

                        <h2>
                            🚗 Vehicle Exit
                        </h2>

                        <form onSubmit={handleExit}>

                            <label>
                                Vehicle Number
                            </label>

                            <input
                                type="text"
                                placeholder="AP39AB1234"
                                value={exitVehicleNumber}
                                onChange={(e) =>
                                    setExitVehicleNumber(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="submit"
                                className="exit-button"
                            >
                                Exit Vehicle
                            </button>

                        </form>

                    </div>

                </section>

                {/* ==========================================
                    ANALYTICS
                ========================================== */}
                <Heatmap />
                <Analytics />
                <MLInsights />
                <Recommendation />
                <Alerts />
            </main>

        </div>
    );
}

export default App;