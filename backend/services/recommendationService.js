const ParkingSlot = require("../models/ParkingSlot");

const getRecommendedSlot = async () => {
    try {
        // Get all available parking slots
        const availableSlots = await ParkingSlot.find({
            status: "available"
        }).sort({
            area: 1,
            slotNumber: 1
        });

        // No slots available
        if (availableSlots.length === 0) {
            return {
                success: true,
                recommended: false,
                message: "No parking slots are currently available."
            };
        }

        // Choose the first available slot
        const bestSlot = availableSlots[0];

        return {
            success: true,
            recommended: true,
            recommendation: {
                slotNumber: bestSlot.slotNumber,
                area: bestSlot.area,
                floor: bestSlot.floor,
                status: bestSlot.status,
                reason: "This slot is currently available."
            }
        };

    } catch (error) {
        console.error(
            "Recommendation service error:",
            error.message
        );

        throw error;
    }
};

module.exports = {
    getRecommendedSlot
};