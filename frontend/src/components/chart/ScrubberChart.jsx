import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EventEmitter from 'events';
import fitbitEventBus from '../tracker/FitbitActivityData';
import { getCurrentJournal } from '../../services/JournalService';

export const journalEventBus = new EventEmitter();
export const mapEventBus = new EventEmitter();

const initialData = [{ name: 'No Data', Lat: 0, Lng: 0, HR: 0, amt: 160 }];

const ScrubberChart = () => {
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [data, setData] = useState(initialData);

	useEffect(() => {
		fitbitEventBus.on('fitbitDataUpdated', (newData) => {
			setData(newData.data);
		});

		return () => {
			fitbitEventBus.off('fitbitDataUpdated', () => () => { });
		};
	}, [lat, lng]);

	const handleClick = async (e) => {
		try {
			setLat(e.activePayload[0].payload.Lat);
			setLng(e.activePayload[0].payload.Lng);

			mapEventBus.emit('mapDataUpdated', { 'lat': e.activePayload[0].payload.Lat, 'lng': e.activePayload[0].payload.Lng });

			const currentJournal = await getCurrentJournal(e.activePayload[0].payload.name);
			journalEventBus.emit('journalDataUpdated', currentJournal);
		}
		catch {
			alert("Invalid Click")
		}
	}

	return (
		<>
			<div>
				<ResponsiveContainer aspect={2}>
					<LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} onClick={handleClick}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" tick={{ fontSize: 12 }} />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="HR" stroke="#8884d8" dot={{ r: 0 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default ScrubberChart;

// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import EventEmitter from 'events';
// import fitbitEventBus from '../tracker/FitbitActivityData';
// import { getCurrentJournal } from '../../services/JournalService';
// import * as Loader from 'react-loader-spinner';

// export const journalEventBus = new EventEmitter();
// export const mapEventBus = new EventEmitter();

// const initialData = [{ name: 'No Data', Lat: 0, Lng: 0, HR: 0, amt: 160 }];

// const ScrubberChart = () => {
// 	const [lat, setLat] = useState();
// 	const [lng, setLng] = useState();
// 	const [data, setData] = useState(initialData);
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [initialLoad, setInitialLoad] = useState(false); // Add initialLoad state

// 	useEffect(() => {
// 		fitbitEventBus.on('fitbitDataUpdated', (newData) => {
// 			setIsLoading(true);
// 			setData(newData.data);
// 			setIsLoading(false);
// 			if (!initialLoad) {
// 				setInitialLoad(true); // Update initialLoad state only once
// 			}
// 		});

// 		return () => {
// 			fitbitEventBus.off('fitbitDataUpdated', () => () => {});
// 		};
// 	}, [lat, lng, initialLoad]); // Add initialLoad to the dependency array

// 	const handleClick = async (e) => {
// 		try {
// 			setLat(e.activePayload[0].payload.Lat);
// 			setLng(e.activePayload[0].payload.Lng);

// 			mapEventBus.emit('mapDataUpdated', { 'lat': e.activePayload[0].payload.Lat, 'lng': e.activePayload[0].payload.Lng });

// 			const currentJournal = await getCurrentJournal(e.activePayload[0].payload.name);
// 			journalEventBus.emit('journalDataUpdated', currentJournal);
// 		}
// 		catch {
// 			alert("Invalid Click")
// 		}
// 	}

// 	return (
// 		<React.Fragment>
// 			<div>
// 				{isLoading && initialLoad ? ( // Conditionally render the spinner based on isLoading and initialLoad states
// 					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
// 						<Loader.TailSpin type="ThreeDots" color="#00BFFF" height={80} width={80} />
// 					</div>
// 				) : (
// 					<ResponsiveContainer aspect={2}>
// 						<LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} onClick={handleClick}>
// 							<CartesianGrid strokeDasharray="3 3" />
// 							<XAxis dataKey="name" tick={{ fontSize: 12 }} />
// 							<YAxis />
// 							<Tooltip />
// 							<Legend />
// 							<Line type="monotone" dataKey="HR" stroke="#8884d8" dot={{ r: 0 }} />
// 						</LineChart>
// 					</ResponsiveContainer>
// 				)}
// 			</div>
// 		</React.Fragment>
// 	);
// };

// export default ScrubberChart;
