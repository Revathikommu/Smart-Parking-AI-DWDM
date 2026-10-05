require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const runETL = require("./services/etlService");

const main = async () => {

    try {

        console.log("Starting ETL runner...");

        await connectDB();

        await runETL();

        console.log("ETL runner completed successfully.");

        await mongoose.connection.close();

        console.log("MongoDB connection closed.");

        process.exit(0);

    }
    catch (error) {

        console.error(
            "ETL runner failed:",
            error.message
        );

        try {
            await mongoose.connection.close();
        }
        catch (closeError) {
            console.error(
                "MongoDB close error:",
                closeError.message
            );
        }

        process.exit(1);
    }
};


main();