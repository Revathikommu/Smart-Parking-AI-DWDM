import { useEffect, useState } from "react";

function StatsCards() {
    const [totalParking, setTotalParking] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [averageDuration, setAverageDuration] = useState(0);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const totalResponse = await fetch(
                    "http://localhost:5000/api/analytics/total"
                );

                const revenueResponse = await fetch(
                    "http://localhost:5000/api/analytics/revenue"
                );

                const durationResponse = await fetch(
                    "http://localhost:5000/api/analytics/average-duration"
                );

                const totalData = await totalResponse.json();
                const revenueData = await revenueResponse.json();
                const durationData = await durationResponse.json();

                setTotalParking(totalData.total);
                setRevenue(Number(revenueData.total_revenue));
                setAverageDuration(
                    Number(durationData.average_duration)
                );

            } catch (error) {
                console.error(
                    "Failed to fetch analytics:",
                    error
                );
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div className="stats-grid">

            <div className="stat-card">
                <h3>Total Parking</h3>
                <p>{totalParking}</p>
            </div>

            <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>₹{revenue.toFixed(2)}</p>
            </div>

            <div className="stat-card">
                <h3>Average Duration</h3>
                <p>{averageDuration.toFixed(2)} min</p>
            </div>

        </div>
    );
}

export default StatsCards;