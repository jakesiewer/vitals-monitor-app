import { useEffect, useState } from "react";
import LineChart from "./chart/ScrubberChart";

function ChartApi() {
    const [chart, setChart] = useState({
        data: [],
        labels: [],
        title: "Title",
        type: "line",
    });

    useEffect(() => {
        async function getData() {
            const url = "https://progitek.no/privat/bp/wp-json/wp/v2/chart";
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                const items = data[1].acf.data.split("},");
                console.log(items, "PARSED");
                const chartLabels = data[1]?.acf?.labels?.split(",") || [];
                const chartData = data[1]?.acf?.data
                    ?.split(",")
                    .map((value) => +value) || [1, 2, 3];
                setChart({
                    labels: chartLabels,
                    data: chartData,
                    title: data[1]?.title?.rendered || "TITLE",
                    type: data?.acf?.chart_type || "line",
                });
            } catch (error) { }
        }
        getData();
    }, []);

    useEffect(() => {
        console.log(chart);
    }, [chart]);

    return (
        <div>
            <h2>ChartAPI</h2>
            {chart.type === "line" && (
                <LineChart
                    chartData={chart.data}
                    chartLabels={chart.labels}
                    chartTitle={chart?.title}
                />
            )}
            <hr />
        </div>
    );
}
export default ChartApi;