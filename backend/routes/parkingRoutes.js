const express = require("express");

const ParkingSlot = require("../models/ParkingSlot");

const router = express.Router();


// GET all parking slots
router.get("/slots", async (req, res) => {
    try {
        const slots = await ParkingSlot.find();

        res.json(slots);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching parking slots",
            error: error.message
        });
    }
});


// CREATE a parking slot
router.post("/slots", async (req, res) => {
    try {
        const {
            slotNumber,
            floor,
            area
        } = req.body;

        const newSlot = new ParkingSlot({
            slotNumber,
            floor,
            area
        });

        const savedSlot = await newSlot.save();

        res.status(201).json(savedSlot);

    } catch (error) {
        res.status(500).json({
            message: "Error creating parking slot",
            error: error.message
        });
    }
});


module.exports = router;