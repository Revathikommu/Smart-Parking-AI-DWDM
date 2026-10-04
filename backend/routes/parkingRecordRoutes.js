const express = require("express");

const ParkingRecord = require("../models/ParkingRecord");
const ParkingSlot = require("../models/ParkingSlot");

const router = express.Router();


// ======================================================
// VEHICLE ENTRY
// ======================================================

router.post("/entry", async (req, res) => {
    try {

        const {
            vehicleNumber,
            slotNumber,
            parkingArea
        } = req.body;

        // -------------------------------
        // Validate input
        // -------------------------------

        if (!vehicleNumber || !slotNumber || !parkingArea) {
            return res.status(400).json({
                success: false,
                message:
                    "Vehicle number, parking slot and parking area are required."
            });
        }

        // -------------------------------
        // Find parking slot
        // -------------------------------

        const slot = await ParkingSlot.findOne({
            slotNumber: slotNumber
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: `Parking slot ${slotNumber} not found.`
            });
        }

        // -------------------------------
        // Check slot availability
        // -------------------------------

        if (slot.status === "occupied") {
            return res.status(400).json({
                success: false,
                message: `Parking slot ${slotNumber} is already occupied.`
            });
        }

        // -------------------------------
        // Check vehicle already parked
        // -------------------------------

        const existingVehicle = await ParkingRecord.findOne({
            vehicleNumber: vehicleNumber,
            exitTime: null
        });

        if (existingVehicle) {
            return res.status(400).json({
                success: false,
                message:
                    `Vehicle ${vehicleNumber} is already parked in slot ${existingVehicle.slotNumber}.`
            });
        }

        // -------------------------------
        // Create parking record
        // -------------------------------

        const parkingRecord = new ParkingRecord({
            vehicleNumber: vehicleNumber,
            slotNumber: slotNumber,
            entryTime: new Date(),
            exitTime: null,
            duration: 0,
            amount: 0,
            parkingArea: parkingArea
        });

        const savedRecord = await parkingRecord.save();

        // -------------------------------
        // Update parking slot
        // -------------------------------

        slot.status = "occupied";
        slot.vehicleNumber = vehicleNumber;

        const updatedSlot = await slot.save();

        // -------------------------------
        // Send response
        // -------------------------------

        return res.status(201).json({
            success: true,
            message: "Vehicle parked successfully!",
            record: savedRecord,
            slot: updatedSlot
        });

    } catch (error) {

        console.error("VEHICLE ENTRY ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to park vehicle.",
            error: error.message
        });
    }
});


// ======================================================
// VEHICLE EXIT
// ======================================================

router.post("/exit", async (req, res) => {
    try {

        const {
            vehicleNumber
        } = req.body;

        // -------------------------------
        // Validate input
        // -------------------------------

        if (!vehicleNumber) {
            return res.status(400).json({
                success: false,
                message: "Vehicle number is required."
            });
        }

        // -------------------------------
        // Find active parking record
        // -------------------------------

        const parkingRecord =
            await ParkingRecord.findOne({
                vehicleNumber: vehicleNumber,
                exitTime: null
            });

        if (!parkingRecord) {
            return res.status(404).json({
                success: false,
                message:
                    `No active parking record found for ${vehicleNumber}.`
            });
        }

        // -------------------------------
        // Exit time
        // -------------------------------

        const exitTime = new Date();

        // -------------------------------
        // Duration in minutes
        // -------------------------------

        const durationMinutes =
            (exitTime - parkingRecord.entryTime) /
            (1000 * 60);

        // -------------------------------
        // Parking fee
        // ₹20 per started hour
        // -------------------------------

        const hours = Math.ceil(
            durationMinutes / 60
        );

        const amount = Math.max(1, hours) * 20;

        // -------------------------------
        // Update parking record
        // -------------------------------

        parkingRecord.exitTime = exitTime;

        // Store duration in minutes
        parkingRecord.duration = durationMinutes;

        parkingRecord.amount = amount;

        const updatedRecord =
            await parkingRecord.save();

        // -------------------------------
        // Make slot available
        // -------------------------------

        const slot = await ParkingSlot.findOne({
            slotNumber: parkingRecord.slotNumber
        });

        if (slot) {

            slot.status = "available";
            slot.vehicleNumber = null;

            await slot.save();
        }

        // -------------------------------
        // Send response
        // -------------------------------

        return res.json({
            success: true,
            message: "Vehicle exited successfully!",
            record: updatedRecord,
            slot: slot
        });

    } catch (error) {

        console.error("VEHICLE EXIT ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to exit vehicle.",
            error: error.message
        });
    }
});


module.exports = router;