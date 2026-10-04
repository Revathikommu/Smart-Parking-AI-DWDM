import { useEffect, useState } from "react";

function Analytics() {
    const [totalParking, setTotalParking] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);
    const [peakHours, setPeakHours] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    totalResponse,
                    revenueResponse,
                    durationResponse,
                    peakResponse,
                    vehicleResponse
                ] = await Promise.all([
                    fetch("http://localhost:5000/api/analytics/total"),
                    fetch("http://localhost:5000/api/analytics/revenue"),
                    fetch("http://localhost:5000/api/analytics/average-duration"),
                    fetch("http://localhost:5000/api/analytics/peak-hours"),
                    fetch("http://localhost:5000/api/analytics/vehicles")
                ]);

                // Check API responses
                if (
                    !totalResponse.ok ||
                    !revenueResponse.ok ||
                    !durationResponse.ok ||
                    !peakResponse.ok ||
                    !vehicleResponse.ok
                ) {
                    throw new Error("Failed to fetch analytics data");
                }

                const totalData = await totalResponse.json();
                const revenueData = await revenueResponse.json();
                const durationData = await durationResponse.json();
                const peakData = await peakResponse.json();
                const vehicleData = await vehicleResponse.json();

                setTotalParking(Number(totalData.total) || 0);

                setRevenue(
                    Number(revenueData.total_revenue) || 0
                );

                setAverageDuration(
                    Number(durationData.average_duration) || 0
                );

                setPeakHours(
                    Array.isArray(peakData) ? peakData : []
                );

                setVehicles(
                    Array.isArray(vehicleData) ? vehicleData : []
                );

            } catch (err) {
                console.error("Analytics error:", err);
                setError("Unable to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>📊 Parking Analytics</h2>
                <p style={styles.loading}>Loading analytics...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* =========================================
                TITLE
            ========================================= */}
            <h2 style={styles.title}>
                📊 Parking Analytics
            </h2>

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* =========================================
                SUMMARY CARDS
            ========================================= */}
            <div style={styles.statsGrid}>

                <div style={styles.card}>
                    <div style={styles.cardIcon}>🚗</div>

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
                    <div style={styles.cardIcon}>💰</div>

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
                    <div style={styles.cardIcon}>⏱️</div>

                    <h3 style={styles.cardTitle}>
                        Average Duration
                    </h3>

                    <p style={styles.cardValue}>
                        {averageDuration.toFixed(2)}
                    </p>

                    <p style={styles.cardLabel}>
                        Minutes per vehicle
                    </p>
                </div>

            </div>

            {/* =========================================
                PEAK HOURS
            ========================================= */}
            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>
                    📈 Peak Parking Hours
                </h3>

                {peakHours.length === 0 ? (
                    <p style={styles.noData}>
                        No peak-hour data available.
                    </p>
                ) : (
                    <div style={styles.chartContainer}>

                        {peakHours.map((item, index) => {

                            const maxCount = Math.max(
                                ...peakHours.map(
                                    (p) => Number(p.parking_count) || 0
                                ),
                                1
                            );

                            const count =
                                Number(item.parking_count) || 0;

                            const width =
                                (count / maxCount) * 100;

                            return (
                                <div
                                    key={index}
                                    style={styles.chartRow}
                                >

                                    <div style={styles.chartLabel}>
                                        {item.hour_label}
                                    </div>

                                    <div style={styles.barBackground}>

                                        <div
                                            style={{
                                                ...styles.bar,
                                                width: `${width}%`
                                            }}
                                        >
                                            <span>
                                                {count}
                                            </span>
                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

            {/* =========================================
                VEHICLE ANALYSIS
            ========================================= */}
            <div style={styles.section}>

                <h3 style={styles.sectionTitle}>
                    🚘 Vehicle Analysis
                </h3>

                {vehicles.length === 0 ? (
                    <p style={styles.noData}>
                        No vehicle analysis data available.
                    </p>
                ) : (
                    <div style={styles.vehicleGrid}>

                        {vehicles.map((vehicle, index) => (

                            <div
                                key={index}
                                style={styles.vehicleCard}
                            >

                                <div style={styles.vehicleIcon}>
                                    🚗
                                </div>

                                <div>
                                    <h4 style={styles.vehicleType}>
                                        {vehicle.vehicle_type || "Unknown"}
                                    </h4>

                                    <p style={styles.vehicleCount}>
                                        {Number(vehicle.vehicle_count) || 0}
                                        {" "}
                                        vehicles
                                    </p>
                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}


/* =========================================
   STYLES
========================================= */

const styles = {

    container: {
        width: "100%",
        boxSizing: "border-box",
        padding: "25px",
        backgroundColor: "#f5f7fa",
        borderRadius: "15px",
        marginTop: "25px"
    },

    title: {
        textAlign: "center",
        fontSize: "28px",
        marginBottom: "25px",
        color: "#1f2937"
    },

    loading: {
        textAlign: "center",
        fontSize: "18px",
        color: "#666"
    },

    error: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "12px 15px",
        borderRadius: "8px",
        marginBottom: "20px",
        textAlign: "center"
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "25px"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "22px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
    },

    cardIcon: {
        fontSize: "30px",
        marginBottom: "8px"
    },

    cardTitle: {
        margin: "5px 0",
        color: "#4b5563",
        fontSize: "18px"
    },

    cardValue: {
        margin: "10px 0 5px",
        fontSize: "32px",
        fontWeight: "bold",
        color: "#111827"
    },

    cardLabel: {
        margin: 0,
        color: "#6b7280",
        fontSize: "14px"
    },

    section: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "25px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
    },

    sectionTitle: {
        textAlign: "center",
        fontSize: "22px",
        marginBottom: "25px",
        color: "#1f2937"
    },

    noData: {
        textAlign: "center",
        color: "#6b7280"
    },

    chartContainer: {
        width: "100%"
    },

    chartRow: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "15px"
    },

    chartLabel: {
        width: "100px",
        fontWeight: "600",
        color: "#374151",
        textAlign: "right"
    },

    barBackground: {
        flex: 1,
        height: "32px",
        backgroundColor: "#e5e7eb",
        borderRadius: "6px",
        overflow: "hidden"
    },

    bar: {
        height: "100%",
        minWidth: "40px",
        backgroundColor: "#2563eb",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "10px",
        boxSizing: "border-box",
        color: "#ffffff",
        fontWeight: "bold"
    },

    vehicleGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px"
    },

    vehicleCard: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "18px",
        borderRadius: "10px",
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb"
    },

    vehicleIcon: {
        fontSize: "30px"
    },

    vehicleType: {
        margin: "0 0 5px",
        color: "#1f2937",
        fontSize: "18px"
    },

    vehicleCount: {
        margin: 0,
        color: "#6b7280"
    }
};

export default Analytics;