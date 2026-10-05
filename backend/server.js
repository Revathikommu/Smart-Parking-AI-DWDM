const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const mysqlConnection = require("./config/mysql");

// =====================================================
// ROUTES
// =====================================================

const parkingRoutes = require("./routes/parkingRoutes");
const parkingRecordRoutes = require("./routes/parkingRecordRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const mlRoutes = require("./routes/mlRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Parking AI-DWDM Backend is running",
        status: "OK"
    });
});

// =====================================================
// PARKING ROUTES
// =====================================================

// Parking slots
app.use("/api/parking", parkingRoutes);

// Parking entry / exit records
app.use("/api/parking", parkingRecordRoutes);

// =====================================================
// ANALYTICS ROUTES
// =====================================================

app.use("/api/analytics", analyticsRoutes);

// =====================================================
// MACHINE LEARNING ROUTES
// =====================================================

app.use("/api/ml", mlRoutes);

// =====================================================
// RECOMMENDATION ROUTES
// =====================================================

app.use("/api/recommendation", recommendationRoutes);

// =====================================================
// STATUS ROUTE
// =====================================================

app.get("/api/status", async (req, res) => {
    try {
        const [rows] = await mysqlConnection.execute(
            "SELECT 1 AS mysql_status"
        );

        res.json({
            success: true,
            server: "running",
            mongodb: "connected",
            mysql:
                rows.length > 0
                    ? "connected"
                    : "not connected"
        });

    } catch (error) {
        console.error(
            "Status check error:",
            error.message
        );

        res.status(500).json({
            success: false,
            server: "running",
            mongodb: "connected",
            mysql: "not connected",
            error: error.message
        });
    }
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
    console.error(
        "Server error:",
        error.message
    );

    res.status(500).json({
        success: false,
        error: error.message
    });
});

// =====================================================
// SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        console.log("");
        console.log("==========================================");
        console.log("STARTING SMART PARKING BACKEND");
        console.log("==========================================");

        // ------------------------------------------
        // MongoDB
        // ------------------------------------------

        console.log("Connecting to MongoDB...");

        await connectDB();

        console.log("MongoDB ready.");

        // ------------------------------------------
        // MySQL
        // ------------------------------------------

        console.log("Checking MySQL connection...");

        const [rows] = await mysqlConnection.execute(
            "SELECT 1 AS test"
        );

        if (rows.length > 0) {
            console.log("MySQL ready.");
        }

        // ------------------------------------------
        // Start Express Server
        // ------------------------------------------

        app.listen(PORT, () => {

            console.log("");
            console.log("==========================================");
            console.log("SMART PARKING AI-DWDM BACKEND");
            console.log("==========================================");

            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `URL: http://localhost:${PORT}`
            );

            console.log("MongoDB: Connected");
            console.log("MySQL: Connected");

            console.log("");
            console.log("Parking Routes: Ready");
            console.log("Parking Entry/Exit: Ready");
            console.log("Analytics Routes: Ready");
            console.log("ML Routes: Ready");
            console.log("Recommendation Routes: Ready");

            console.log("");
            console.log("Analytics endpoints:");
            console.log(
                `http://localhost:${PORT}/api/analytics/total`
            );
            console.log(
                `http://localhost:${PORT}/api/analytics/revenue`
            );
            console.log(
                `http://localhost:${PORT}/api/analytics/average-duration`
            );
            console.log(
                `http://localhost:${PORT}/api/analytics/peak-hours`
            );
            console.log(
                `http://localhost:${PORT}/api/analytics/vehicles`
            );
            console.log(
                `http://localhost:${PORT}/api/analytics/live`
            );

            console.log("");
            console.log("==========================================");
        });

    } catch (error) {

        console.error("");
        console.error(
            "FAILED TO START SERVER"
        );

        console.error(
            error.message
        );

        process.exit(1);
    }
};

// =====================================================
// START
// =====================================================

startServer();