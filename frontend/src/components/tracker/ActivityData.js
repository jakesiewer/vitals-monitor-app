import axios from "axios";
// import React from "react";
// import RechartContext from '../../contexts/RechartContext';
import EventEmitter from 'events';

const eventBus = new EventEmitter();
export default eventBus;

// // Sibling One
// import eventBus from './EventBus';

export const GetUserActivity = async (activity_id, start_date) => {
    // const setData = React.useContext(RechartContext)[1];

    try {
        const accessToken = localStorage.getItem('strava_access_token');
        const response = await axios.get(
            "http://localhost:3001/api/activity-stream",
            {
                headers: { 
                        //    'authorization': `Bearer ${accessToken}`,
                           'authorization': accessToken,
                           'activity_id': activity_id,
                           'start_date': start_date
                 }
            }
        );
        console.log(response);
        // setData(response.data);
        eventBus.emit('dataUpdated', response);
        return response;
    } catch (error) {
        console.log(error);
    }
};