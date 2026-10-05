const express = require("express");
const mysqlConnection = require("../config/mysql");
const ParkingSlot = require("../models/ParkingSlot");

const router = express.Router();


// =====================================================
// TOTAL PARKING RECORDS
// =====================================================

router.get("/total", async (req, res) => {
    try {

        const [rows] = await mysqlConnection.execute(`
            SELECT COUNT(*) AS total
            FROM fact_parking
        `);

        const total = Number(rows[0]?.total) || 0;

        res.json({
            success: true,
            total: total
        });

    } catch (error) {

        console.error(
            "Total parking error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================================
// TOTAL REVENUE
// =====================================================

router.get("/revenue", async (req, res) => {
    try {

        const [rows] = await mysqlConnection.execute(`
            SELECT
                COALESCE(SUM(amount), 0) AS total_revenue
            FROM fact_parking
        `);

        const revenue =
            Number(rows[0]?.total_revenue) || 0;

        res.json({
            success: true,
            total_revenue: Number(
                revenue.toFixed(2)
            )
        });

    } catch (error) {

        console.error(
            "Revenue error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================================
// AVERAGE DURATION
// =====================================================

router.get("/average-duration", async (req, res) => {
    try {

        const [rows] = await mysqlConnection.execute(`
            SELECT
                COALESCE(
                    AVG(duration_minutes),
                    0
                ) AS average_duration
            FROM fact_parking
        `);

        const averageDuration =
            Number(rows[0]?.average_duration) || 0;

        res.json({
            success: true,
            average_duration: Number(
                averageDuration.toFixed(2)
            )
        });

    } catch (error) {

        console.error(
            "Average duration error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================================
// PEAK PARKING HOURS
// =====================================================

router.get("/peak-hours", async (req, res) => {
    try {

        const [rows] = await mysqlConnection.execute(`
            SELECT
                dt.hour,
                dt.hour_label,
                COUNT(fp.parking_id) AS parking_count
            FROM fact_parking fp
            INNER JOIN dim_time dt
                ON fp.time_id = dt.time_id
            GROUP BY
                dt.hour,
                dt.hour_label
            ORDER BY
                parking_count DESC
            LIMIT 10
        `);

        const peakHours = rows.map(row => ({
            hour: row.hour,
            hour_label: row.hour_label,

            // Used by frontend
            count: Number(row.parking_count),

            // Keep original name too
            parking_count: Number(row.parking_count)
        }));

        res.json({
            success: true,
            peak_hours: peakHours
        });

    } catch (error) {

        console.error(
            "Peak hours error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================================
// VEHICLE ANALYSIS
// =====================================================

router.get("/vehicles", async (req, res) => {
    try {

        const [rows] = await mysqlConnection.execute(`
            SELECT
                COALESCE(
                    dv.vehicle_type,
                    'Car'
                ) AS vehicle_type,

                COUNT(fp.parking_id) AS vehicle_count

            FROM fact_parking fp

            LEFT JOIN dim_vehicle dv
                ON fp.vehicle_id = dv.vehicle_id

            GROUP BY
                COALESCE(
                    dv.vehicle_type,
                    'Car'
                )

            ORDER BY
                vehicle_count DESC
        `);

        const vehicles = rows.map(row => ({
            vehicle_type: row.vehicle_type,

            // Used by frontend
            count: Number(row.vehicle_count),

            // Original field
            vehicle_count: Number(row.vehicle_count)
        }));

        res.json({
            success: true,
            vehicles: vehicles
        });

    } catch (error) {

        console.error(
            "Vehicle analysis error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================================
// LIVE PARKING STATUS
// =====================================================

router.get("/live", async (req, res) => {
    try {

        const totalSlots =
            await ParkingSlot.countDocuments();

        const occupiedSlots =
            await ParkingSlot.countDocuments({
                status: "occupied"
            });

        const availableSlots =
            await ParkingSlot.countDocuments({
                status: "available"
            });

        const occupancyPercentage =
            totalSlots === 0
                ? 0
                : (
                    occupiedSlots /
                    totalSlots
                ) * 100;

        res.json({
            success: true,

            totalSlots: totalSlots,

            occupiedSlots: occupiedSlots,

            availableSlots: availableSlots,

            occupancyPercentage: Number(
                occupancyPercentage.toFixed(2)
            )
        });

    } catch (error) {

        console.error(
            "Live analytics error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;