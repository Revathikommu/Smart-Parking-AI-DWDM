const mysqlConnection = require("../config/mysql");

// Get total parking records
const getTotalParking = async () => {
    const [rows] = await mysqlConnection.execute(`
        SELECT COUNT(*) AS total
        FROM fact_parking
    `);

    return rows[0];
};

// Get total revenue
const getRevenue = async () => {
    const [rows] = await mysqlConnection.execute(`
        SELECT COALESCE(SUM(amount), 0) AS total_revenue
        FROM fact_parking
    `);

    return rows[0];
};

// Get average parking duration
const getAverageDuration = async () => {
    const [rows] = await mysqlConnection.execute(`
        SELECT COALESCE(AVG(duration_minutes), 0) AS average_duration
        FROM fact_parking
    `);

    return rows[0];
};

// Get peak parking hours
const getPeakHours = async () => {
    const [rows] = await mysqlConnection.execute(`
        SELECT
            dt.hour,
            dt.hour_label,
            COUNT(fp.parking_id) AS parking_count
        FROM fact_parking fp
        JOIN dim_time dt
            ON fp.time_id = dt.time_id
        GROUP BY dt.hour, dt.hour_label
        ORDER BY parking_count DESC
    `);

    return rows;
};

// Get vehicle analysis
const getVehicleAnalysis = async () => {
    const [rows] = await mysqlConnection.execute(`
        SELECT
            dv.vehicle_type,
            COUNT(fp.parking_id) AS vehicle_count
        FROM fact_parking fp
        JOIN dim_vehicle dv
            ON fp.vehicle_id = dv.vehicle_id
        GROUP BY dv.vehicle_type
        ORDER BY vehicle_count DESC
    `);

    return rows;
};

module.exports = {
    getTotalParking,
    getRevenue,
    getAverageDuration,
    getPeakHours,
    getVehicleAnalysis
};