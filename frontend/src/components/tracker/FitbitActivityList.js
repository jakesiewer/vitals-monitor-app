import React, { useState } from 'react';
import axios from 'axios';
import { CalendarIcon } from "@heroicons/react/solid";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { GetUserActivity } from './ActivityData';
import { getFitbitActivityData } from './FitbitActivityData';

const FitbitActivityList = () => {
    const [activities, setActivities] = useState([]);
    // const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const fetchActivities = async () => {
        const accessToken = localStorage.getItem('fitbit_access_token');
        if (!accessToken) {
            console.error('No access token found');
            return;
        }

        if (!selectedDate) {
            alert('Please pick a date');
            return;
        }

        const response = await axios.get('http://localhost:3001/api/fitbit-activities', {
            headers: {
                Authorization: `${accessToken}`,
                after: convertCalendarDate(selectedDate)
            }
        });
        setActivities(response.data);
        console.log(response)
    };

    const convertCalendarDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero for single-digit months
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero for single-digit days
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }

    const handleActivityClick = (activity) => {

        const tcxLink = activity.target.defaultValue;

        getFitbitActivityData(tcxLink);
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowCalendar(false); // hide the calendar when a date is selected
    };

    const handleCalendarClick = () => {
        setShowCalendar(true); // show the calendar when the icon is clicked
    };

    return (
        // <div className="max-w-md mx-auto my-8">
        <>
            {/* <div className="flex items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg"> */}
            <h2 className="mt-4 mb-2 text-2xl tracking-tight font-light text-slate-600 dark:text-white">Fitbit Activities</h2>
            <button
                className="inline-block bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 mr-4 rounded"
                onClick={fetchActivities}
            >
                Fetch Activities
            </button>
            <div className="inline-block" onClick={handleCalendarClick}>
                <CalendarIcon
                    className="inline-block w-12 h-12 rounded-full text-sky-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none text-sm p-2.5"
                    aria-hidden="true"
                    onClick={() => setShowCalendar(!showCalendar)}
                />
            </div>
            {showCalendar && (
                <Calendar
                    // onChange={(value) => setDateRange(value)}
                    // value={dateRange}
                    // selectRange={true}
                    onChange={handleDateClick}
                    value={selectedDate}
                    selectRange={false}
                />
            )}
            <ul className="list-none ml-2 mb-10 mt-4 text-gray-400 font-medium">
                {activities.map((activity) => (
                    <li key={activity.logId}>
                        <label className="flex items-center mb-4">
                            <input type="radio" name="selectedActivity" value={activity.tcxLink} className="flex items-center w-5 h-5 mr-2 border-sky-500" onClick={(handleActivityClick)} />
                            {/* <input type="radio" name="selectedActivity" value={activity.id + ',' + activity.start_date} className="mr-2"/> */}
                            {activity.originalStartTime}
                        </label>
                    </li>
                ))}
            </ul>
            {/* </div>
            </div> */}
        </>
        //   </div>
    );
};

export default FitbitActivityList;