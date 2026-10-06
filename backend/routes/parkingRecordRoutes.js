const express = require("express");

const ParkingRecord = require("../models/ParkingRecord");
const ParkingSlot = require("../models/ParkingSlot");
const runETL = require("../services/etlService");

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

        // Validation
        if (!vehicleNumber || !slotNumber || !parkingArea) {
            return res.status(400).json({
                success: false,
                message:
                    "Vehicle number, slot number and parking area are required."
            });
        }

        // Find parking slot
        const slot = await ParkingSlot.findOne({
            slotNumber: slotNumber
        });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Parking slot not found."
            });
        }

        // Check slot availability
        if (slot.status === "occupied") {
            return res.status(400).json({
                success: false,
                message: "This parking slot is already occupied."
            });
        }

        // Check vehicle already parked
        const existingVehicle = await ParkingRecord.findOne({
            vehicleNumber: vehicleNumber,
            exitTime: null
        });

        if (existingVehicle) {
            return res.status(400).json({
                success: false,
                message: "This vehicle is already parked."
            });
        }

        // Create parking record
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

        // Update parking slot
        slot.status = "occupied";
        slot.vehicleNumber = vehicleNumber;

        await slot.save();

        // Response
        res.status(201).json({
            success: true,
            message: "Vehicle entered successfully.",
            record: savedRecord
        });

    } catch (error) {
        console.error(
            "Vehicle entry error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Unable to process vehicle entry.",
            error: error.message
        });
    }
});


// ======================================================
// VEHICLE EXIT
// ======================================================

router.post("/exit", async (req, res) => {
    try {
        const { vehicleNumber } = req.body;

        // Validation
        if (!vehicleNumber) {
            return res.status(400).json({
                success: false,
                message: "Vehicle number is required."
            });
        }

        // Find active parking record
        const parkingRecord = await ParkingRecord.findOne({
            vehicleNumber: vehicleNumber,
            exitTime: null
        });

        if (!parkingRecord) {
            return res.status(404).json({
                success: false,
                message:
                    "No active parking record found for this vehicle."
            });
        }

        // Calculate exit time
        const exitTime = new Date();

        // Calculate duration
        const durationMilliseconds =
            exitTime.getTime() -
            new Date(parkingRecord.entryTime).getTime();

        const durationMinutes = Math.max(
            0,
            durationMilliseconds / (1000 * 60)
        );

        // Parking fee
        // ₹20 per started hour
        const hours = Math.ceil(
            durationMinutes / 60
        );

        const amount = Math.max(
            1,
            hours
        ) * 20;

        // Update parking record
        parkingRecord.exitTime = exitTime;

        parkingRecord.duration =
            Number(durationMinutes.toFixed(2));

        parkingRecord.amount =
            Number(amount.toFixed(2));

        const updatedRecord =
            await parkingRecord.save();

        // Make parking slot available
        const slot = await ParkingSlot.findOne({
            slotNumber: parkingRecord.slotNumber
        });

        if (slot) {
            slot.status = "available";
            slot.vehicleNumber = null;

            await slot.save();
        }


        // ==================================================
        // AUTOMATIC ETL
        // ==================================================

        console.log("");
        console.log("==========================================");
        console.log("RUNNING AUTOMATIC ETL AFTER VEHICLE EXIT");
        console.log("==========================================");

        try {
            await runETL();

            console.log(
                "Automatic ETL completed successfully."
            );

        } catch (etlError) {

            console.error(
                "Automatic ETL failed:",
                etlError.message
            );

            // Important:
            // Vehicle exit should still succeed
            // even if ETL has an error.
        }


        // Response
        res.json({
            success: true,

            message:
                "Vehicle exited successfully.",

            record:
                updatedRecord,

            parkingFee:
                Number(amount.toFixed(2)),

            durationMinutes:
                Number(durationMinutes.toFixed(2))
        });

    } catch (error) {

        console.error(
            "Vehicle exit error:",
            error.message
        );

        res.status(500).json({
            success: false,

            message:
                "Unable to process vehicle exit.",

            error:
                error.message
        });
    }
});


// ======================================================
// PARKING LOGS
// ======================================================

router.get("/logs", async (req, res) => {
    try {

        // Get all parking records
        // Newest first
        const records =
            await ParkingRecord.find()
                .sort({
                    entryTime: -1
                })
                .lean();


        // Prepare log data
        const logs = await Promise.all(

            records.map(
                async (record) => {

                    // Find slot information
                    const slot =
                        await ParkingSlot.findOne({
                            slotNumber:
                                record.slotNumber
                        }).lean();


                    const isCompleted =
                        Boolean(
                            record.exitTime
                        );


                    return {

                        id:
                            record._id,

                        vehicleNumber:
                            record.vehicleNumber,

                        slotNumber:
                            record.slotNumber,

                        floor:
                            slot?.floor ||
                            "Floor 1",

                        area:
                            record.parkingArea ||
                            slot?.area ||
                            "A",

                        entryTime:
                            record.entryTime,

                        exitTime:
                            record.exitTime,

                        type:
                            isCompleted
                                ? "Exit"
                                : "Entry",

                        status:
                            isCompleted
                                ? "Success"
                                : "Active",

                        duration:
                            Number(
                                record.duration
                            ) || 0,

                        amount:
                            Number(
                                record.amount
                            ) || 0
                    };
                }
            )
        );


        // Response
        res.json({

            success: true,

            count:
                logs.length,

            logs:
                logs
        });


    } catch (error) {

        console.error(
            "Parking logs error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to load parking logs.",

            error:
                error.message
        });
    }
});


// ======================================================
// GET ACTIVE PARKING RECORDS
// ======================================================

router.get("/active", async (req, res) => {
    try {

        const records =
            await ParkingRecord.find({
                exitTime: null
            })
            .sort({
                entryTime: -1
            });


        res.json({

            success: true,

            count:
                records.length,

            records:
                records
        });


    } catch (error) {

        console.error(
            "Active parking records error:",
            error.message
        );

        res.status(500).json({

            success: false,

            error:
                error.message
        });
    }
});


// ======================================================
// GET ALL PARKING RECORDS
// ======================================================

router.get("/records", async (req, res) => {
    try {

        const records =
            await ParkingRecord.find()
                .sort({
                    entryTime: -1
                });


        res.json({

            success: true,

            count:
                records.length,

            records:
                records
        });


    } catch (error) {

        console.error(
            "Parking records error:",
            error.message
        );

        res.status(500).json({

            success: false,

            error:
                error.message
        });
    }
});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;