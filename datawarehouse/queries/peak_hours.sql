USE smart_parking_dw;

SELECT
    t.hour,
    t.hour_label,
    COUNT(*) AS parking_count
FROM fact_parking f
JOIN dim_time t
    ON f.time_id = t.time_id
GROUP BY
    t.hour,
    t.hour_label
ORDER BY
    parking_count DESC;