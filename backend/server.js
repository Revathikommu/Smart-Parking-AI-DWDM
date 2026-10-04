require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const mysqlConnection = require("./config/mysql");

const ParkingSlot = require("./models/ParkingSlot");

const parkingRecordRoutes = require("./routes/parkingRecordRoutes");
const mlRoutes = require("./routes/mlRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");


const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());


// ======================================================
// ROUTES
// ======================================================

// Parking entry / exit
app.use("/api/parking", parkingRecordRoutes);

// Machine Learning
app.use("/api/ml", mlRoutes);
// Smart Parking Recommendation
app.use("/api/recommendation", recommendationRoutes);


// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.json({
        message: "Smart Parking AI-DWDM Backend is running",
        status: "success"
    });
});


// ======================================================
// PARKING SLOTS
// ======================================================

app.get("/api/parking/slots", async (req, res) => {
    try {

        const slots = await ParkingSlot
            .find()
            .sort({ slotNumber: 1 });

        res.json(slots);

    } catch (error) {

        console.error(
            "Parking slots error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ======================================================
// ANALYTICS - TOTAL PARKING
// ======================================================

app.get("/api/analytics/total", async (req, res) => {

    try {

        const [rows] =
            await mysqlConnection.execute(`
                SELECT COUNT(*) AS total
                FROM fact_parking
            `);

        res.json(rows[0]);

    } catch (error) {

        console.error(
            "Total parking error:",
            error.message
        );

        res.status(500).json({
            error: error.message
        });
    }
});


// ======================================================
// ANALYTICS - REVENUE
// ======================================================

app.get("/api/analytics/revenue", async (req, res) => {

    try {

        const [rows] =
            await mysqlConnection.execute(`
                SELECT
                    COALESCE(SUM(amount), 0)
                    AS total_revenue
                FROM fact_parking
            `);

        res.json(rows[0]);

    } catch (error) {

        console.error(
            "Revenue error:",
            error.message
        );

        res.status(500).json({
            error: error.message
        });
    }
});


// ======================================================
// ANALYTICS - AVERAGE DURATION
// ======================================================

app.get(
    "/api/analytics/average-duration",
    async (req, res) => {

        try {

            const [rows] =
                await mysqlConnection.execute(`
                    SELECT
                        COALESCE(
                            AVG(duration_minutes),
                            0
                        ) AS average_duration
                    FROM fact_parking
                `);

            res.json(rows[0]);

        } catch (error) {

            console.error(
                "Average duration error:",
                error.message
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ======================================================
// ANALYTICS - PEAK HOURS
// ======================================================

app.get(
    "/api/analytics/peak-hours",
    async (req, res) => {

        try {

            const [rows] =
                await mysqlConnection.execute(`
                    SELECT
                        dt.hour,
                        dt.hour_label,
                        COUNT(fp.parking_id)
                        AS parking_count
                    FROM fact_parking fp
                    JOIN dim_time dt
                        ON fp.time_id = dt.time_id
                    GROUP BY
                        dt.hour,
                        dt.hour_label
                    ORDER BY
                        parking_count DESC
                `);

            res.json(rows);

        } catch (error) {

            console.error(
                "Peak hours error:",
                error.message
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ======================================================
// ANALYTICS - VEHICLE ANALYSIS
// ======================================================

app.get(
    "/api/analytics/vehicles",
    async (req, res) => {

        try {

            const [rows] =
                await mysqlConnection.execute(`
                    SELECT
                        dv.vehicle_type,
                        COUNT(fp.parking_id)
                        AS vehicle_count
                    FROM fact_parking fp
                    JOIN dim_vehicle dv
                        ON fp.vehicle_id =
                           dv.vehicle_id
                    GROUP BY
                        dv.vehicle_type
                    ORDER BY
                        vehicle_count DESC
                `);

            res.json(rows);

        } catch (error) {

            console.error(
                "Vehicle analysis error:",
                error.message
            );

            res.status(500).json({
                error: error.message
            });
        }
    }
);


// ======================================================
// SYSTEM STATUS
// ======================================================

app.get("/api/status", async (req, res) => {

    try {

        const [rows] =
            await mysqlConnection.execute(`
                SELECT 1 AS mysql_connected
            `);

        res.json({

            server: "running",

            mongodb: "connected",

            mysql:
                rows[0].mysql_connected === 1
                    ? "connected"
                    : "not connected",

            ml: "available"

        });

    } catch (error) {

        res.status(500).json({

            server: "running",

            mongodb: "connected",

            mysql: "not connected",

            ml: "available",

            error: error.message

        });
    }
});


// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "API endpoint not found",

        path: req.originalUrl

    });

});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server Error:",
            err
        );

        res.status(500).json({

            success: false,

            error: "Internal server error",

            message: err.message

        });

    }
);


// ======================================================
// PORT
// ======================================================

const PORT =
    process.env.PORT || 5000;


// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {

    try {

        console.log(
            "========================================"
        );

        console.log(
            "   STARTING SMART PARKING BACKEND"
        );

        console.log(
            "========================================"
        );


        // ------------------------------------------
        // MongoDB
        // ------------------------------------------

        console.log(
            "Connecting to MongoDB..."
        );

        await connectDB();

        console.log(
            "MongoDB ready."
        );


        // ------------------------------------------
        // MySQL
        // ------------------------------------------

        console.log(
            "Checking MySQL connection..."
        );

        await mysqlConnection.execute(
            "SELECT 1"
        );

        console.log(
            "MySQL ready."
        );


        // ------------------------------------------
        // Start Express
        // ------------------------------------------

        app.listen(
            PORT,
            () => {

                console.log(
                    "========================================"
                );

                console.log(
                    "   SMART PARKING AI-DWDM BACKEND"
                );

                console.log(
                    "========================================"
                );

                console.log(
                    `Server running on port ${PORT}`
                );

                console.log(
                    `URL: http://localhost:${PORT}`
                );

                console.log(
                    "MongoDB: Connected"
                );

                console.log(
                    "MySQL: Connected"
                );

                console.log(
                    "Parking Entry: Ready"
                );

                console.log(
                    "Parking Exit: Ready"
                );

                console.log(
                    "Analytics: Ready"
                );

                console.log(
                    "ML Routes: Ready"
                );

                console.log(
                    "========================================"
                );
            }
        );

    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "SERVER STARTUP FAILED"
        );

        console.error(
            "========================================"
        );

        console.error(
            error.message
        );

        process.exit(1);
    }
};


startServer();