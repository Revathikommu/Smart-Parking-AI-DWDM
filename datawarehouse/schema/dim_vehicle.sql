CREATE TABLE IF NOT EXISTS dim_vehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(30),
    registration_type VARCHAR(30)
);