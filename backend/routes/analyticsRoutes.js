const express = require("express");

const router = express.Router();

// ==========================================
// TEST ANALYTICS ROUTE
// ==========================================

router.get("/total", (req, res) => {
    res.json({
        total: 4,
        message: "Analytics API is working"
    });
});

// ==========================================
// REVENUE
// ==========================================

router.get("/revenue", (req, res) => {
    res.json({
        message: "Revenue API is working"
    });
});

// ==========================================
// AVERAGE DURATION
// ==========================================

router.get("/average-duration", (req, res) => {
    res.json({
        message: "Average duration API is working"
    });
});

// ==========================================
// PEAK HOURS
// ==========================================

router.get("/peak-hours", (req, res) => {
    res.json({
        message: "Peak hours API is working"
    });
});

// ==========================================
// VEHICLES
// ==========================================

router.get("/vehicles", (req, res) => {
    res.json({
        message: "Vehicle analysis API is working"
    });
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;