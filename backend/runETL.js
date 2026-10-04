require("dotenv").config();

const connectDB = require("./config/db");
const runETL = require("./services/etlService");

const startETL = async () => {
    try {
        console.log("Connecting to MongoDB...");
        
        await connectDB();

        console.log("MongoDB ready for ETL.");

        await runETL();

        console.log("ETL process finished successfully.");

        process.exit(0);

    } catch (error) {

        console.error("ETL process failed:");
        console.error(error);

        process.exit(1);
    }
};

startETL();