import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EventEmitter from 'events';
import fitbitEventBus from '../tracker/FitbitActivityData';
import GoogleMaps from '../maps/GoogleMaps';
import { getCurrentJournal } from '../../services/JournalService';

// const journalEventBus = new EventEmitter();
export const journalEventBus = new EventEmitter();
export const mapEventBus = new EventEmitter();

const initialData = [{ name: 'No Data', Lat: 0, Lng: 0, HR: 0, amt: 160 }];
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
			// console.log(newData.data)
			setData(newData.data);
		});

		return () => {
			fitbitEventBus.off('fitbitDataUpdated', () => () => {}) ;
		};
	}, [lat, lng]);

	const handleClick = async (e) => {
		try {
			setLat(e.activePayload[0].payload.Lat);
			setLng(e.activePayload[0].payload.Lng);			
			
			mapEventBus.emit('mapDataUpdated', {'lat': e.activePayload[0].payload.Lat, 'lng': e.activePayload[0].payload.Lng});

			const currentJournal = await getCurrentJournal(e.activePayload[0].payload.name);
			journalEventBus.emit('journalDataUpdated', currentJournal);
		}
		catch {
			alert("Invalid Click")
		}
	}

	return (
		<React.Fragment>
			<div>
			<ResponsiveContainer aspect={2}>
			<LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} onClick={handleClick}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" tick={{ fontSize: 12 }}/>
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="HR" stroke="#8884d8" dot={{ r: 0 }}/>
				{/* <Line type="monotone" dataKey="Lng" stroke="#82ca9d" /> */}
			</LineChart>
			</ResponsiveContainer>
			</div>
			{/* <GoogleMaps data={[lat, lng]} /> */}
		</React.Fragment>
	);
};

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
