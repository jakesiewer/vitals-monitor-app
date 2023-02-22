import React from 'react'
import GoogleMaps from '../maps/GoogleMaps'
import { useAuth } from "../../contexts/AuthContext";
import ScrubberChart from '../chart/ScrubberChart';
import StravaAuth from '../../contexts/StravaAuth';
import StravaLogin from '../tracker/StravaLogin';
import ActivityList from '../tracker/ActivityList';
import FitbitLogin from '../tracker/FitbitLogin';
import FitbitActivityList from '../tracker/FitbitActivityList';
export default function Home() {
    const { currentUser } = useAuth();

    return (
        <>

            {currentUser && (
                <FitbitLogin />
            )}
            {currentUser && (
                <FitbitActivityList />
            )}
            {currentUser && (
                <StravaLogin />
            )}
            {currentUser && (
                <ActivityList />
            )}
            {currentUser && (
                <ScrubberChart />
            )}
            {/* {currentUser && (
                    <GoogleMaps />
                )} */}


        </>
    );
    // return (
    //     <div className="flex flex-row overflow-hidden">
    //         <div className="w-3/4 order-1">
    //             <div className="w-full h-full">
    //                 {currentUser && (
    //                     <ScrubberChart />
    //                 )}
    //             </div>
    //             {/* {currentUser && (
    //                 <GoogleMaps />
    //             )} */}

    //         </div>
    //         <div className="w-1/4 order-2">
    //             {currentUser && (
    //                 <StravaLogin />
    //             )}
    //             {currentUser && (
    //                 <ActivityList />
    //             )}
    //         </div>

    //     </div>
    // );
}
