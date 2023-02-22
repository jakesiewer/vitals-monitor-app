import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import RechartContext from '../../contexts/RechartContext';
import GoogleMaps from '../maps/GoogleMaps';
import eventBus from '../tracker/ActivityData';
import fitbitEventBus from '../tracker/FitbitActivityData';
// import rechartContext from '../../contexts/rechartContext';

const initialData = [{ name: 'Page A', Lat: 53.3837370, Lng: -6.5941090, HR: 85, amt: 160 }, { name: 'Page B', HR: 110, Lat: 53.3849580, Lng: -6.5974880, amt: 160 }, { name: 'Page C', HR: 100, Lat: 53.3841190, Lng: -6.6000700, amt: 160 }, { name: 'Page D', HR: 68, Lat: 53.3838070, Lng: -6.5999090, amt: 160 }, { name: 'Page E', HR: 58, Lat: 53.3838200, Lng: -6.5999130, amt: 160 }, { name: 'Page F', HR: 76, Lat: 53.3838200, Lng: -6.5999130, amt: 160 }, { name: 'Page G', HR: 82, Lat: 53.3838200, Lng: -6.5999130, amt: 160 }, { name: 'Page H', HR: 70, Lat: 53.3838200, Lng: -6.5999130, amt: 160 }, { name: 'Page I', HR: 90, Lat: 53.3838200, Lng: -6.5999130, amt: 160 }];
// const data = [{ name: 'Page A', Lat: 53.3837370, Lng: -6.5941090, HR: 85 }, { name: 'Page B', Lat: 53.3849580, Lng: -6.5974880, HR: 110 }, { name: 'Page C', Lat: 53.3841190, Lng: -6.6000700, HR: 100 }, { name: 'Page D', Lat: 53.3838070, Lng: -6.5999090, HR: 68 }, { name: 'Page E', Lat: 53.3838200, Lng: -6.5999130, HR: 58 }];


const ScrubberChart = () => {
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [data, setData] = useState(initialData);
	// const data = useContext(RechartContext);

	// useEffect(() => {
	// 	eventBus.on('dataUpdated', (newData) => {
	// 		setData(newData.data);
	// 	});

	// 	return () => {
	// 		eventBus.off('dataUpdated', () => () => {}) ;

	// 	};
	// }, [lat, lng]);

	useEffect(() => {
		fitbitEventBus.on('fitbitDataUpdated', (newData) => {
			console.log(newData.data)
			setData(newData.data);
		});

		return () => {
			fitbitEventBus.off('fitbitDataUpdated', () => () => {}) ;
		};
	}, [lat, lng]);

	const handleClick = (e) => {
		try {
			setLat(e.activePayload[0].payload.Lat);
			setLng(e.activePayload[0].payload.Lng)
		}
		catch {
			console.log("Invalid Click")
		}
	}

	return (
		<React.Fragment>
			<LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} onClick={handleClick}>
				{/* <GoogleMaps data={state.location}/> */}
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" tick={{ fontSize: 12 }}/>
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="HR" stroke="#8884d8" dot={{ r: 0 }}/>
				{/* <Line type="monotone" dataKey="Lng" stroke="#82ca9d" /> */}
			</LineChart>
			<GoogleMaps data={[lat, lng]} />
		</React.Fragment>
	);
};

export function DataProvider(props) {
	return (
		<RechartContext.Provider value={props.data}>
			{props.children}
		</RechartContext.Provider>
	);
}

export default ScrubberChart;

// import React, { useEffect, useState } from "react";

// import { Line } from "react-chartjs-2";
// // import { Chart as ChartJS } from 'chart.js/auto'
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);

// function ScrubberChart({ chartData, chartLabels, chartTitle }) {
// 	const [labels, setLabels] = useState([]);
// 	const [dataset, setDataset] = useState([]);

// 	useEffect(() => {
// 		if (chartData?.length > 0 && chartLabels?.length > 0) {
// 			setLabels(chartLabels);
// 			setDataset(chartData);
// 		} else {
// 			setLabels([
// 				"January",
// 				"February",
// 				"March",
// 				"April",
// 				"May",
// 				"June",
// 				"July",
// 			]);
// 			setDataset([65, 59, 80, 81, 56, 55, 40]);
// 		}
// 	}, [chartData, chartLabels]);

// 	const data = {
// 		labels: labels,
// 		datasets: [
// 			{
// 				label: chartTitle || "My First dataset",
// 				fill: false,
// 				lineTension: 0.1,
// 				backgroundColor: "rgba(75,192,192,0.4)",
// 				borderColor: "rgba(75,192,192,1)",
// 				borderCapStyle: "butt",
// 				borderDash: [],
// 				borderDashOffset: 0.0,
// 				borderJoinStyle: "miter",
// 				pointBorderColor: "rgba(75,192,192,1)",
// 				pointBackgroundColor: "#fff",
// 				pointBorderWidth: 1,
// 				pointHoverRadius: 5,
// 				pointHoverBackgroundColor: "rgba(75,192,192,1)",
// 				pointHoverBorderColor: "rgba(220,220,220,1)",
// 				pointHoverBorderWidth: 2,
// 				pointRadius: 1,
// 				pointHitRadius: 10,
// 				data: dataset,
// 			},
// 		],
// 	};

// 	return (
// 		<div>
// 			<Line data={data} />
// 		</div>
// 	);
// }

//   export default ScrubberChart;
