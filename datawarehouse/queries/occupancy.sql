USE smart_parking_dw;

SELECT
    d.full_date,
    l.floor,
    l.area,
    COUNT(*) AS total_parking_records,
    SUM(
        CASE
            WHEN f.parking_status = 'Occupied'
            THEN 1
            ELSE 0
        END
    ) AS occupied_count
FROM fact_parking f
JOIN dim_date d
    ON f.date_id = d.date_id
JOIN dim_location l
    ON f.location_id = l.location_id
GROUP BY
    d.full_date,
    l.floor,
    l.area
ORDER BY
    d.full_date;