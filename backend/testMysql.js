require("dotenv").config();

const mysqlConnection = require("./config/mysql");

async function testMySQL() {
    try {
        const [rows] = await mysqlConnection.query(
            "SELECT DATABASE() AS database_name"
        );

        console.log("MySQL connected successfully!");
        console.log("Database:", rows[0].database_name);

        process.exit(0);
    } catch (error) {
        console.error("MySQL connection failed:");
        console.error(error.message);

        process.exit(1);
    }
}

testMySQL();