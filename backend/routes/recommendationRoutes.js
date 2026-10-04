const express = require("express");

const {
    getRecommendedSlot
} = require("../services/recommendationService");

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const result = await getRecommendedSlot();

        res.json(result);

    } catch (error) {

        console.error(
            "Recommendation route error:",
            error.message
        );

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;