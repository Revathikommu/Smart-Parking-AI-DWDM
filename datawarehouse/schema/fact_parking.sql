CREATE TABLE IF NOT EXISTS fact_parking (
    parking_id INT AUTO_INCREMENT PRIMARY KEY,

    date_id INT,
    time_id INT,
    location_id INT,
    vehicle_id INT,

    slot_number VARCHAR(20),

    entry_time DATETIME,
    exit_time DATETIME,

    duration_minutes DECIMAL(10,2),
    amount DECIMAL(10,2),

    parking_status VARCHAR(20),

    FOREIGN KEY (date_id)
        REFERENCES dim_date(date_id),

    FOREIGN KEY (time_id)
        REFERENCES dim_time(time_id),

    FOREIGN KEY (location_id)
        REFERENCES dim_location(location_id),

    FOREIGN KEY (vehicle_id)
        REFERENCES dim_vehicle(vehicle_id)
);