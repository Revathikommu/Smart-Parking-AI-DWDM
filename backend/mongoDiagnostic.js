require("dotenv").config();

const mongoose = require("mongoose");

async function testMongoDB() {
    console.log("Starting direct MongoDB diagnostic...\n");

    try {
        console.log("MongoDB URI loaded:", !!process.env.MONGO_URI);
        console.log("Connecting using IPv4...");

        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });

        console.log("\n================================");
        console.log("MongoDB CONNECTED SUCCESSFULLY");
        console.log("================================");

        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
        console.log("Ready State:", mongoose.connection.readyState);

        await mongoose.disconnect();

        console.log("\nConnection closed successfully.");

    } catch (error) {
        console.log("\n================================");
        console.log("MONGODB CONNECTION FAILED");
        console.log("================================");

        console.log("\nError name:");
        console.log(error.name);

        console.log("\nError message:");
        console.log(error.message);

        console.log("\nError code:");
        console.log(error.code);

        console.log("\nError reason:");
        console.log(error.reason);

        console.log("\nFull error:");
        console.log(error);
    }
}

testMongoDB();