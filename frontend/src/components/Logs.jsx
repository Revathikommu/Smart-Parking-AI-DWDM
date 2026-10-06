import React, { useEffect, useState } from "react";
import "./Logs.css";
const Logs = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // -----------------------------------
    // FETCH PARKING LOGS
    // -----------------------------------
    const fetchLogs = async () => {
        try {
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/parking/logs"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch parking logs");
            }

            const data = await response.json();

            if (data.success) {
                setRecords(
                    Array.isArray(data.logs)
                        ? data.logs
                        : []
                );
            } else {
                setRecords([]);
                setError("No parking logs available.");
            }

        } catch (err) {
            console.error("Logs API Error:", err);

            setError(
                "Unable to load parking activity logs."
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------
    // LOAD LOGS
    // -----------------------------------
    useEffect(() => {
        fetchLogs();

        // Refresh every 5 seconds
        const interval = setInterval(() => {
            fetchLogs();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // -----------------------------------
    // FORMAT DATE & TIME
    // -----------------------------------
    const formatDateTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // -----------------------------------
    // FORMAT DURATION
    // -----------------------------------
    const formatDuration = (duration) => {
        if (
            duration === null ||
            duration === undefined ||
            duration === 0
        ) {
            return "-";
        }

        const minutes = Number(duration);

        if (isNaN(minutes)) {
            return "-";
        }

        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);

        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }

        return `${mins}m`;
    };

    // -----------------------------------
    // PAGE
    // -----------------------------------
    return (
        <div className="logs-container">

            {/* PAGE HEADER */}
            <div className="logs-header">

                <div>
                    <h1>Parking Activity Log</h1>

                    <p>
                        Detailed log of all parking
                        entry and exit activities
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchLogs}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="logs-error">
                    ⚠️ {error}
                </div>
            )}

            {/* LOADING */}
            {loading ? (

                <div className="logs-loading">
                    Loading parking activity...
                </div>

            ) : (

                <div className="logs-table-card">

                    <div className="table-wrapper">

                        <table className="logs-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Time</th>
                                    <th>Vehicle Number</th>
                                    <th>Slot Number</th>
                                    <th>Floor</th>
                                    <th>Area</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Duration</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>

                            <tbody>

                                {records.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="10"
                                            className="no-records"
                                        >
                                            📋 No parking records
                                            available.
                                        </td>

                                    </tr>

                                ) : (

                                    records.map(
                                        (record, index) => {

                                            /*
                                             * Backend /logs API
                                             * already provides type.
                                             */
                                            const isExit =
                                                record.type === "Exit";

                                            return (

                                                <tr
                                                    key={
                                                        record.id ||
                                                        record._id ||
                                                        index
                                                    }
                                                >

                                                    {/* NUMBER */}
                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    {/* TIME */}
                                                    <td>
                                                        {formatDateTime(
                                                            record.entryTime
                                                        )}
                                                    </td>

                                                    {/* VEHICLE */}
                                                    <td>
                                                        <strong>
                                                            {
                                                                record.vehicleNumber
                                                            }
                                                        </strong>
                                                    </td>

                                                    {/* SLOT */}
                                                    <td>
                                                        {
                                                            record.slotNumber
                                                        }
                                                    </td>

                                                    {/* FLOOR */}
                                                    <td>
                                                        {
                                                            record.floor ||
                                                            "Floor 1"
                                                        }
                                                    </td>

                                                    {/* AREA */}
                                                    <td>
                                                        {
                                                            record.area ||
                                                            record.parkingArea ||
                                                            "-"
                                                        }
                                                    </td>

                                                    {/* TYPE */}
                                                    <td>

                                                        {isExit ? (

                                                            <span className="type-exit">
                                                                ↗ Exit
                                                            </span>

                                                        ) : (

                                                            <span className="type-entry">
                                                                ↘ Entry
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* STATUS */}
                                                    <td>

                                                        <span className="status-success">
                                                            {record.status ||
                                                                "Success"}
                                                        </span>

                                                    </td>

                                                    {/* DURATION */}
                                                    <td>
                                                        {formatDuration(
                                                            record.duration
                                                        )}
                                                    </td>

                                                    {/* AMOUNT */}
                                                    <td>
                                                        ₹
                                                        {Number(
                                                            record.amount || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* FOOTER */}
                    <div className="logs-footer">

                        Showing{" "}

                        <strong>
                            {records.length}
                        </strong>{" "}

                        parking records

                    </div>

                </div>
            )}

        </div>
    );
};

export default Logs;