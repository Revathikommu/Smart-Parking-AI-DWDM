import { useEffect, useState } from "react";
import "./App.css";

import Analytics from "./components/Analytics";
import Heatmap from "./components/Heatmap";
import MLInsights from "./components/MLInsights";
import Recommendation from "./components/Recommendation";
import Alerts from "./components/Alerts";
import Logs from "./components/Logs";
import EntryForm from "./components/EntryForm";
import ExitForm from "./components/ExitForm";

// ==========================================
// BACKEND API
// ==========================================

const API_URL = "http://localhost:5000/api/parking";

function App() {

    // ==========================================
    // STATES
    // ==========================================

    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState("");
    const [activePage, setActivePage] = useState("dashboard");


    // ==========================================
    // GET PARKING SLOTS
    // ==========================================

    const fetchSlots = async () => {
        try {
            const response = await fetch(`${API_URL}/slots`);

            if (!response.ok) {
                throw new Error("Failed to fetch parking slots");
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setSlots(data);
            } else if (Array.isArray(data.slots)) {
                setSlots(data.slots);
            } else {
                setSlots([]);
            }

        } catch (error) {
            console.error("Error fetching slots:", error);
        }
    };


    // ==========================================
    // LOAD SLOTS EVERY 5 SECONDS
    // ==========================================

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
    // SLOT CARD
    // ==========================================

    const SlotCard = ({ slot }) => (
        <div
            className={`slot ${
                slot.status === "occupied"
                    ? "occupied"
                    : "available"
            }`}
        >
            <h3>{slot.slotNumber}</h3>

            <p>{slot.floor}</p>

            <strong>
                {slot.status === "occupied"
                    ? "OCCUPIED"
                    : "AVAILABLE"}
            </strong>

            {slot.vehicleNumber && (
                <small>{slot.vehicleNumber}</small>
            )}
        </div>
    );


    // ==========================================
    // DASHBOARD PAGE
    // ==========================================

    const DashboardPage = () => (
        <div className="page-content">

            <div className="page-title">
                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Smart Parking Management Overview
                    </p>
                </div>
            </div>


            {/* STATISTICS */}

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


            {/* MESSAGE */}

            {message && (
                <div className="message">
                    {message}
                </div>
            )}


            {/* PARKING SLOTS */}

            <section className="section">

                <div className="section-header">
                    <div>
                        <h2>Parking Slots</h2>

                        <p>
                            Live parking availability
                        </p>
                    </div>
                </div>


                <div className="slots-grid">

                    {slots.map((slot) => (
                        <SlotCard
                            key={
                                slot._id ||
                                slot.slotNumber
                            }
                            slot={slot}
                        />
                    ))}

                </div>

            </section>

        </div>
    );


    // ==========================================
    // PARKING PAGE
    // ==========================================

    const ParkingPage = () => (
        <div className="page-content">

            <div className="page-title">
                <div>
                    <h1>Parking Slots</h1>

                    <p>
                        Monitor all parking spaces in real time
                    </p>
                </div>
            </div>


            <section className="section">

                <div className="slots-grid">

                    {slots.map((slot) => (
                        <SlotCard
                            key={
                                slot._id ||
                                slot.slotNumber
                            }
                            slot={slot}
                        />
                    ))}

                </div>

            </section>

        </div>
    );


    // ==========================================
    // ENTRY / EXIT PAGE
    // ==========================================

    /*
       IMPORTANT FIX:

       EntryForm and ExitForm are imported components.

       DO NOT keep vehicleNumber, exitVehicleNumber,
       handleEntry, handleExit or their handlers in App.

       EntryForm and ExitForm maintain their own state.
    */

    const EntryExitContent = (
        <div className="page-content">

            <div className="page-title">
                <div>

                    <h1>
                        Vehicle Entry / Exit
                    </h1>

                    <p>
                        Manage vehicle parking transactions
                    </p>

                </div>
            </div>


            <section className="forms">

                {/* VEHICLE ENTRY */}

                <EntryForm
                    slots={slots}
                    onSuccess={fetchSlots}
                />


                {/* VEHICLE EXIT */}

                <ExitForm
                    onSuccess={fetchSlots}
                />

            </section>

        </div>
    );


    // ==========================================
    // ANALYTICS PAGE
    // ==========================================

    const AnalyticsPage = () => (
        <div className="page-content">

            <div className="page-title">
                <div>

                    <h1>Analytics</h1>

                    <p>
                        Parking analytics and AI insights
                    </p>

                </div>
            </div>


            <Heatmap />

            <Analytics />

            <MLInsights />

            <Alerts />

        </div>
    );


    // ==========================================
    // RECOMMENDATION PAGE
    // ==========================================

    const RecommendationPage = () => (
        <div className="page-content">

            <div className="page-title">
                <div>

                    <h1>Recommendation</h1>

                    <p>
                        AI-powered parking recommendation
                    </p>

                </div>
            </div>


            <Recommendation />

        </div>
    );


    // ==========================================
    // LOGS PAGE
    // ==========================================

    const LogsPage = () => (
        <div className="page-content">

            <Logs />

        </div>
    );


    // ==========================================
    // SETTINGS PAGE
    // ==========================================

    const SettingsPage = () => (
        <div className="page-content">

            <div className="page-title">
                <div>

                    <h1>Settings</h1>

                    <p>
                        Smart Parking system settings
                    </p>

                </div>
            </div>


            <div className="settings-card">

                <h2>
                    ⚙️ System Information
                </h2>


                <div className="setting-row">

                    <span>
                        Backend
                    </span>

                    <strong>
                        Connected
                    </strong>

                </div>


                <div className="setting-row">

                    <span>
                        MongoDB
                    </span>

                    <strong>
                        Connected
                    </strong>

                </div>


                <div className="setting-row">

                    <span>
                        MySQL Data Warehouse
                    </span>

                    <strong>
                        Connected
                    </strong>

                </div>

            </div>

        </div>
    );


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="app-layout">


            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="sidebar">


                {/* LOGO */}

                <div className="sidebar-logo">

                    <img
                        src="/parking-logo.png"
                        alt="Smart Parking Logo"
                    />

                    <div>

                        <h2>
                            Smart Parking
                        </h2>

                        <span>
                            Management System
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav className="sidebar-nav">


                    {/* DASHBOARD */}

                    <button
                        className={
                            activePage === "dashboard"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >

                        🏠

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* PARKING */}

                    <button
                        className={
                            activePage === "parking"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("parking")
                        }
                    >

                        🅿️

                        <span>
                            Parking Slots
                        </span>

                    </button>


                    {/* ENTRY / EXIT */}

                    <button
                        className={
                            activePage === "entryexit"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("entryexit")
                        }
                    >

                        🚘

                        <span>
                            Entry / Exit
                        </span>

                    </button>


                    {/* ANALYTICS */}

                    <button
                        className={
                            activePage === "analytics"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("analytics")
                        }
                    >

                        📊

                        <span>
                            Analytics
                        </span>

                    </button>


                    {/* LOGS */}

                    <button
                        className={
                            activePage === "logs"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("logs")
                        }
                    >

                        📄

                        <span>
                            Logs
                        </span>

                    </button>


                    {/* RECOMMENDATION */}

                    <button
                        className={
                            activePage === "recommendation"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("recommendation")
                        }
                    >

                        💡

                        <span>
                            Recommendation
                        </span>

                    </button>


                    {/* SETTINGS */}

                    <button
                        className={
                            activePage === "settings"
                                ? "nav-button active"
                                : "nav-button"
                        }
                        onClick={() =>
                            setActivePage("settings")
                        }
                    >

                        ⚙️

                        <span>
                            Settings
                        </span>

                    </button>

                </nav>


                {/* =================================
                    ADMIN DISPLAY
                    Display Only - No Action
                ================================= */}

                <div className="sidebar-footer">

                    <div className="admin-avatar">
                        👤
                    </div>


                    <div className="admin-info">

                        <strong>
                            Admin
                        </strong>

                        <span>
                            Smart Parking
                        </span>

                    </div>

                </div>


            </aside>


            {/* =====================================
                MAIN AREA
            ===================================== */}

            <main className="main-area">


                {/* TOP BAR */}

                <header className="topbar">

                    <div className="topbar-title">

                        <h2>
                            Smart Parking
                        </h2>

                        <span>
                            Intelligent Parking Management
                        </span>

                    </div>


                    <div className="system-status">

                        <span className="status-dot">
                        </span>

                        System Online

                    </div>

                </header>


                {/* =================================
                    PAGE CONTENT
                ================================= */}


                {activePage === "dashboard" && (
                    <DashboardPage />
                )}


                {activePage === "parking" && (
                    <ParkingPage />
                )}


                {activePage === "entryexit" && (
                    EntryExitContent
                )}


                {activePage === "analytics" && (
                    <AnalyticsPage />
                )}


                {activePage === "logs" && (
                    <LogsPage />
                )}


                {activePage === "recommendation" && (
                    <RecommendationPage />
                )}


                {activePage === "settings" && (
                    <SettingsPage />
                )}

            </main>

        </div>
    );
}

export default App;