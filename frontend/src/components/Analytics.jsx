import { useEffect, useState } from "react";

function Analytics() {
    const [totalParking, setTotalParking] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);

    const [peakHours, setPeakHours] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [liveParking, setLiveParking] = useState({
        totalSlots: 0,
        occupiedSlots: 0,
        availableSlots: 0,
        occupancyPercentage: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setError("");

                const [
                    totalResponse,
                    revenueResponse,
                    durationResponse,
                    peakResponse,
                    vehicleResponse,
                    liveResponse
                ] = await Promise.all([
                    fetch("http://localhost:5000/api/analytics/total"),
                    fetch("http://localhost:5000/api/analytics/revenue"),
                    fetch("http://localhost:5000/api/analytics/average-duration"),
                    fetch("http://localhost:5000/api/analytics/peak-hours"),
                    fetch("http://localhost:5000/api/analytics/vehicles"),
                    fetch("http://localhost:5000/api/analytics/live")
                ]);

                if (
                    !totalResponse.ok ||
                    !revenueResponse.ok ||
                    !durationResponse.ok ||
                    !peakResponse.ok ||
                    !vehicleResponse.ok ||
                    !liveResponse.ok
                ) {
                    throw new Error("One or more analytics APIs failed");
                }

                const totalData = await totalResponse.json();
                const revenueData = await revenueResponse.json();
                const durationData = await durationResponse.json();
                const peakData = await peakResponse.json();
                const vehicleData = await vehicleResponse.json();
                const liveData = await liveResponse.json();

                // -----------------------------
                // Historical Analytics
                // -----------------------------

                setTotalParking(
                    Number(totalData.total) || 0
                );

                setRevenue(
                    Number(revenueData.total_revenue) || 0
                );

                setAverageDuration(
                    Number(durationData.average_duration) || 0
                );

                // IMPORTANT:
                // Backend returns { peak_hours: [...] }
                setPeakHours(
                    Array.isArray(peakData.peak_hours)
                        ? peakData.peak_hours
                        : []
                );

                // IMPORTANT:
                // Backend returns { vehicles: [...] }
                setVehicles(
                    Array.isArray(vehicleData.vehicles)
                        ? vehicleData.vehicles
                        : []
                );

                // -----------------------------
                // Live Parking Analytics
                // -----------------------------

                setLiveParking({
                    totalSlots:
                        Number(liveData.totalSlots) || 0,

                    occupiedSlots:
                        Number(liveData.occupiedSlots) || 0,

                    availableSlots:
                        Number(liveData.availableSlots) || 0,

                    occupancyPercentage:
                        Number(liveData.occupancyPercentage) || 0
                });

            } catch (err) {
                console.error("Analytics error:", err);

                setError(
                    `Unable to load parking analytics: ${err.message}`
                );
            } finally {
                setLoading(false);
            }
        };

        // First load
        fetchAnalytics();

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchAnalytics();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);

    if (loading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>
                    📊 Parking Analytics
                </h2>

                <p style={styles.loading}>
                    Loading analytics...
                </p>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            <h2 style={styles.title}>
                📊 Parking Analytics
            </h2>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* ================================
                LIVE PARKING STATUS
            ================================= */}

            <div style={styles.liveSection}>

                <h3 style={styles.liveTitle}>
                    🅿️ Live Parking Status
                </h3>

                <div style={styles.liveGrid}>

                    <div style={styles.liveCard}>
                        <div style={styles.liveIcon}>
                            🚗
                        </div>

                        <div style={styles.liveLabel}>
                            Total Slots
                        </div>

                        <div style={styles.liveValue}>
                            {liveParking.totalSlots}
                        </div>
                    </div>

                    <div style={styles.liveCard}>
                        <div style={styles.liveIcon}>
                            🟢
                        </div>

                        <div style={styles.liveLabel}>
                            Available
                        </div>

                        <div
                            style={{
                                ...styles.liveValue,
                                color: "#16a34a"
                            }}
                        >
                            {liveParking.availableSlots}
                        </div>
                    </div>

                    <div style={styles.liveCard}>
                        <div style={styles.liveIcon}>
                            🔴
                        </div>

                        <div style={styles.liveLabel}>
                            Occupied
                        </div>

                        <div
                            style={{
                                ...styles.liveValue,
                                color: "#dc2626"
                            }}
                        >
                            {liveParking.occupiedSlots}
                        </div>
                    </div>

                    <div style={styles.liveCard}>
                        <div style={styles.liveIcon}>
                            📊
                        </div>

                        <div style={styles.liveLabel}>
                            Occupancy
                        </div>

                        <div style={styles.liveValue}>
                            {liveParking.occupancyPercentage}%
                        </div>
                    </div>

                </div>
            </div>

            {/* ================================
                SUMMARY CARDS
            ================================= */}

            <div style={styles.statsGrid}>

                <div style={styles.card}>
                    <div style={styles.cardIcon}>
                        🚗
                    </div>

                    <h3 style={styles.cardTitle}>
                        Total Parking
                    </h3>

                    <p style={styles.cardValue}>
                        {totalParking}
                    </p>

                    <p style={styles.cardLabel}>
                        Parking records
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.cardIcon}>
                        💰
                    </div>

                    <h3 style={styles.cardTitle}>
                        Total Revenue
                    </h3>

                    <p style={styles.cardValue}>
                        ₹{revenue.toFixed(2)}
                    </p>

                    <p style={styles.cardLabel}>
                        Total parking revenue
                    </p>
                </div>

                <div style={styles.card}>
                    <div style={styles.cardIcon}>
                        ⏱️
                    </div>

                    <h3 style={styles.cardTitle}>
                        Average Duration
                    </h3>

                    <p style={styles.cardValue}>
                        {averageDuration.toFixed(2)}
                    </p>

                    <p style={styles.cardLabel}>
                        Minutes
                    </p>
                </div>

            </div>

            {/* ================================
                PEAK HOURS
            ================================= */}

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>
                    ⏰ Peak Parking Hours
                </h3>

                {peakHours.length === 0 ? (
                    <p style={styles.noData}>
                        No peak-hour data available.
                    </p>
                ) : (
                    <div style={styles.list}>

                        {peakHours.map((item, index) => (
                            <div
                                key={index}
                                style={styles.listItem}
                            >
                                <span>
                                    {item.hour_label}
                                </span>

                                <strong>
                                    {item.count} parking
                                </strong>
                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* ================================
                VEHICLE ANALYSIS
            ================================= */}

            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>
                    🚘 Vehicle Analysis
                </h3>

                {vehicles.length === 0 ? (
                    <p style={styles.noData}>
                        No vehicle data available.
                    </p>
                ) : (
                    <div style={styles.list}>

                        {vehicles.map((vehicle, index) => (
                            <div
                                key={index}
                                style={styles.listItem}
                            >
                                <span>
                                    {vehicle.vehicle_type}
                                </span>

                                <strong>
                                    {vehicle.count}
                                </strong>
                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

const styles = {
    container: {
        background: "#ffffff",
        borderRadius: "16px",
        padding: "25px",
        marginTop: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#1f2937"
    },

    loading: {
        textAlign: "center",
        color: "#64748b",
        fontSize: "18px"
    },

    error: {
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        textAlign: "center"
    },

    liveSection: {
        marginBottom: "25px"
    },

    liveTitle: {
        textAlign: "center",
        color: "#334155",
        marginBottom: "15px"
    },

    liveGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px"
    },

    liveCard: {
        background: "#f8fafc",
        padding: "18px",
        borderRadius: "12px",
        textAlign: "center",
        border: "1px solid #e2e8f0"
    },

    liveIcon: {
        fontSize: "28px",
        marginBottom: "8px"
    },

    liveLabel: {
        color: "#64748b",
        fontSize: "14px"
    },

    liveValue: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#1e293b",
        marginTop: "5px"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "18px",
        marginBottom: "25px"
    },

    card: {
        background: "#f8fafc",
        padding: "20px",
        borderRadius: "12px",
        textAlign: "center",
        border: "1px solid #e2e8f0"
    },

    cardIcon: {
        fontSize: "30px"
    },

    cardTitle: {
        color: "#334155",
        margin: "8px 0"
    },

    cardValue: {
        fontSize: "30px",
        fontWeight: "bold",
        color: "#2563eb",
        margin: "5px 0"
    },

    cardLabel: {
        color: "#64748b",
        fontSize: "14px"
    },

    section: {
        marginTop: "25px"
    },

    sectionTitle: {
        color: "#334155",
        marginBottom: "12px"
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    listItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 15px",
        background: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
    },

    noData: {
        color: "#64748b",
        textAlign: "center"
    }
};

export default Analytics;