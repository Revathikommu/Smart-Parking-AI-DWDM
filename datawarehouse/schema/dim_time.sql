CREATE TABLE IF NOT EXISTS dim_time (
    time_id INT PRIMARY KEY,
    hour INT,
    minute INT,
    hour_label VARCHAR(20),
    period VARCHAR(20)
);