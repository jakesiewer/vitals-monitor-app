import axios from "axios";
// import React from "react";
// import RechartContext from '../../contexts/RechartContext';
import EventEmitter from 'events';

const fitbitEventBus = new EventEmitter();
export default fitbitEventBus;

// // Sibling One
// import eventBus from './EventBus';

export const getFitbitActivityData = async (tcxLink) => {
    // const setData = React.useContext(RechartContext)[1];

    try {
        const accessToken = localStorage.getItem('fitbit_access_token');
        const response = await axios.get(
            "http://localhost:3001/api/fitbit-activity-data",
            {
                headers: { 
                        //    'authorization': `Bearer ${accessToken}`,
                           'authorization': accessToken,
                           'tcxlink': tcxLink,
                        //    'start_date': start_date
                 }
            }
        );
        console.log(response);
        // setData(response.data);
        fitbitEventBus.emit('fitbitDataUpdated', response);
        return response;
    } catch (error) {
        console.log(error);
    }
};