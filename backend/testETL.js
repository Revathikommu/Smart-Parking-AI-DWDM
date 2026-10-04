require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");

const runETLTest = async () => {
    try {
        console.log("Starting ETL MongoDB test...");

        await connectDB();

        console.log("MongoDB connection successful!");
        console.log("Database:", mongoose.connection.name);

        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        console.log("\nCollections found:");

        collections.forEach((collection) => {
            console.log(" -", collection.name);
        });

        await mongoose.connection.close();

        console.log("\nETL connection test completed successfully.");

    } catch (error) {
        console.error("ETL test failed:");
        console.error(error.message);
    }
};

runETLTest();