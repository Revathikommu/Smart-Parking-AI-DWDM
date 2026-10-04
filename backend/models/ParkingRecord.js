const mongoose = require("mongoose");

const parkingRecordSchema = new mongoose.Schema(
    {
        vehicleNumber: {
            type: String,
            required: true
        },

        slotNumber: {
            type: String,
            required: true
        },

        entryTime: {
            type: Date,
            required: true
        },

        exitTime: {
            type: Date,
            default: null
        },

        duration: {
            type: Number,
            default: 0
        },

        amount: {
            type: Number,
            default: 0
        },

        parkingArea: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ParkingRecord",
    parkingRecordSchema
);