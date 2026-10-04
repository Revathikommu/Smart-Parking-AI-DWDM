USE smart_parking_dw;

SELECT
    d.full_date,
    SUM(f.amount) AS total_revenue
FROM fact_parking f
JOIN dim_date d
    ON f.date_id = d.date_id
GROUP BY
    d.full_date
ORDER BY
    d.full_date;