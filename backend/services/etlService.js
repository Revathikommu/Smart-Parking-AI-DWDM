const ParkingRecord = require("../models/ParkingRecord");
const mysqlConnection = require("../config/mysql");

const runETL = async () => {
    try {
        console.log("Starting ETL process...");

        // ==================================================
        // GET PARKING RECORDS FROM MONGODB
        // ==================================================

        const records = await ParkingRecord.find();

        console.log(`MongoDB records found: ${records.length}`);

        for (const record of records) {

            // ==================================================
            // 1. DATE DIMENSION
            // ==================================================

            const entryDate = new Date(record.entryTime);

            const dateId =
                entryDate.getFullYear() * 10000 +
                (entryDate.getMonth() + 1) * 100 +
                entryDate.getDate();

            const fullDate =
                `${entryDate.getFullYear()}-${String(
                    entryDate.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    entryDate.getDate()
                ).padStart(2, "0")}`;

            const day = entryDate.getDate();
            const month = entryDate.getMonth() + 1;
            const year = entryDate.getFullYear();

            const monthName = entryDate.toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );

            const quarter = Math.ceil(month / 3);

            const dayName = entryDate.toLocaleString(
                "en-US",
                {
                    weekday: "long"
                }
            );

            const isWeekend =
                dayName === "Saturday" ||
                dayName === "Sunday";

            await mysqlConnection.execute(
                `
                INSERT IGNORE INTO dim_date
                (
                    date_id,
                    full_date,
                    day,
                    month,
                    month_name,
                    quarter,
                    year,
                    day_name,
                    is_weekend
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    dateId,
                    fullDate,
                    day,
                    month,
                    monthName,
                    quarter,
                    year,
                    dayName,
                    isWeekend
                ]
            );

            // ==================================================
            // 2. TIME DIMENSION
            // ==================================================

            const hour = entryDate.getHours();
            const minute = entryDate.getMinutes();

            /*
             * Example:
             * 06:13 -> 373
             * 11:43 -> 703
             * 12:04 -> 724
             */

            const timeId =
                hour * 60 + minute;

            const hourLabel =
                entryDate.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            let period;

            if (hour < 6) {
                period = "Night";
            } else if (hour < 12) {
                period = "Morning";
            } else if (hour < 18) {
                period = "Afternoon";
            } else {
                period = "Evening";
            }

            await mysqlConnection.execute(
                `
                INSERT IGNORE INTO dim_time
                (
                    time_id,
                    hour,
                    minute,
                    hour_label,
                    period
                )
                VALUES (?, ?, ?, ?, ?)
                `,
                [
                    timeId,
                    hour,
                    minute,
                    hourLabel,
                    period
                ]
            );

            // ==================================================
            // 3. LOCATION DIMENSION
            // ==================================================

            const [locationRows] =
                await mysqlConnection.execute(
                    `
                    SELECT location_id
                    FROM dim_location
                    WHERE area = ?
                    LIMIT 1
                    `,
                    [record.parkingArea]
                );

            let locationId;

            if (locationRows.length > 0) {

                locationId =
                    locationRows[0].location_id;

            } else {

                const [locationResult] =
                    await mysqlConnection.execute(
                        `
                        INSERT INTO dim_location
                        (
                            floor,
                            area,
                            total_slots
                        )
                        VALUES (?, ?, ?)
                        `,
                        [
                            "Floor 1",
                            record.parkingArea,
                            10
                        ]
                    );

                locationId =
                    locationResult.insertId;
            }

            // ==================================================
            // 4. VEHICLE DIMENSION
            // ==================================================

            const [vehicleRows] =
                await mysqlConnection.execute(
                    `
                    SELECT vehicle_id
                    FROM dim_vehicle
                    WHERE vehicle_number = ?
                    LIMIT 1
                    `,
                    [record.vehicleNumber]
                );

            let vehicleId;

            if (vehicleRows.length > 0) {

                vehicleId =
                    vehicleRows[0].vehicle_id;

            } else {

                const [vehicleResult] =
                    await mysqlConnection.execute(
                        `
                        INSERT INTO dim_vehicle
                        (
                            vehicle_number,
                            vehicle_type,
                            registration_type
                        )
                        VALUES (?, ?, ?)
                        `,
                        [
                            record.vehicleNumber,
                            "Car",
                            "Private"
                        ]
                    );

                vehicleId =
                    vehicleResult.insertId;
            }

            // ==================================================
            // 5. DUPLICATE CHECK
            // ==================================================

            /*
             * We identify a parking event using:
             *
             * vehicle_id
             * slot_number
             * entry_time
             *
             * A 1-second tolerance is used because
             * JavaScript Date and MySQL DATETIME can have
             * slightly different representations.
             */

            const [existingFactRows] =
                await mysqlConnection.execute(
                    `
                    SELECT parking_id
                    FROM fact_parking
                    WHERE vehicle_id = ?
                      AND slot_number = ?
                      AND ABS(
                          TIMESTAMPDIFF(
                              SECOND,
                              entry_time,
                              ?
                          )
                      ) <= 1
                    LIMIT 1
                    `,
                    [
                        vehicleId,
                        record.slotNumber,
                        record.entryTime
                    ]
                );

            if (existingFactRows.length > 0) {

                console.log(
                    `Skipping existing parking record: ` +
                    `${record.vehicleNumber} | ` +
                    `${record.slotNumber} | ` +
                    `${record.entryTime}`
                );

                continue;
            }

            // ==================================================
            // 6. PARKING FACT
            // ==================================================

            /*
             * MongoDB duration is stored in minutes.
             * MySQL duration_minutes also expects minutes.
             */

            const duration =
                Number(record.duration) || 0;

            const amount =
                Number(record.amount) || 0;

            const parkingStatus =
                record.exitTime
                    ? "Completed"
                    : "Active";

            await mysqlConnection.execute(
                `
                INSERT INTO fact_parking
                (
                    date_id,
                    time_id,
                    location_id,
                    vehicle_id,
                    slot_number,
                    entry_time,
                    exit_time,
                    duration_minutes,
                    amount,
                    parking_status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    dateId,
                    timeId,
                    locationId,
                    vehicleId,
                    record.slotNumber,
                    record.entryTime,
                    record.exitTime,
                    duration,
                    amount,
                    parkingStatus
                ]
            );

            console.log(
                `Inserted parking record: ` +
                `${record.vehicleNumber} | ` +
                `${record.slotNumber}`
            );
        }

        console.log("ETL completed successfully!");

    } catch (error) {

        console.error("ETL failed:");
        console.error(error.message);

        throw error;
    }
};

module.exports = runETL;