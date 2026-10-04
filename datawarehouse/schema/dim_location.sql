CREATE TABLE IF NOT EXISTS dim_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    floor VARCHAR(50),
    area VARCHAR(100),
    total_slots INT
);