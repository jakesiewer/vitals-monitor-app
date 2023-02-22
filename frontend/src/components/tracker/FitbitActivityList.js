import React, { useState } from 'react';
import axios from 'axios';

import { GetUserActivity } from './ActivityData';
import { getFitbitActivityData } from './FitbitActivityData';

const FitbitActivityList = () => {
    const [activities, setActivities] = useState([]);


    const fetchActivities = async () => {
        const accessToken = localStorage.getItem('fitbit_access_token');
        if (!accessToken) {
            console.error('No access token found');
            return;
        }

        const response = await axios.get('http://localhost:3001/api/fitbit-activities', {
            headers: {
                Authorization: `${accessToken}`,
            },
        });
        setActivities(response.data);
        console.log(response)
    };

    const handleActivityClick = (activity) => {
        // const name = activity.name;
        // Do something with the activity name, such as store it in state or pass it to another component
        // const idAndDate = activity.target.defaultValue.split(',');
        // console.log(idAndDate);

        const tcxLink = activity.target.defaultValue;

        getFitbitActivityData(tcxLink);
      };

    return (
        // <div className="max-w-md mx-auto my-8">
        <>
            {/* <div className="flex items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg"> */}
                    <h2 className="mt-4 text-2xl tracking-tight font-light dark:text-white">Fitbit Activities</h2>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={fetchActivities}
                    >
                        Fetch Activities
                    </button>
                    <ul className="list-none pl-8 mt-4">
                        {activities.map((activity) => (
                            <li key={activity.logId}>
                                <label className="flex items-center">
                                    <input type="radio" name="selectedActivity" value={activity.tcxLink} className="mr-2" onClick={(handleActivityClick)}/>
                                    {/* <input type="radio" name="selectedActivity" value={activity.id + ',' + activity.start_date} className="mr-2"/> */}
                                    {activity.logId}
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