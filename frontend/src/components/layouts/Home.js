import React, { useState } from 'react'
// import GoogleMaps from '../maps/GoogleMaps'
import { useAuth } from "../../contexts/AuthContext";
import ScrubberChart from '../chart/ScrubberChart';
import FitbitLogin from '../tracker/FitbitLogin';
import FitbitActivityList from '../tracker/FitbitActivityList';
import { CurrentJournal } from '../journal/CurrentJournal';
import GoogleMaps from '../maps/GoogleMaps';
// import { useEffect } from 'react';

export default function Home() {
    const { currentUser } = useAuth();
    const [showChartHelper, setShowChartHelper] = useState(false);
    const [showMapHelper, setShowMapHelper] = useState(false);
    const [showFitbitHelper, setShowFitbitHelper] = useState(false);
    const [showJournalHelper, setShowJournalHelper] = useState(false);

    return (
        <>
            <div className='bg-stone-50 pt-12'>
                <div className="container mx-auto p-4">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-3/4 md:mr-24 mb-6 md:mb-0">
                            <div className="mb-6 bg-white rounded-3xl shadow-lg">
                                {currentUser && (
                                    <div
                                        className="relative group"
                                        onMouseEnter={() => setShowChartHelper(true)}
                                        onMouseLeave={() => setShowChartHelper(false)}
                                    >
                                        {showChartHelper && (
                                            <div className="absolute left-0 bottom-full mt-2 p-2 bg-gray-200 text-sm rounded-md shadow-md">
                                                After selecting an activity, click the chart once its populated with data to see location and journal information
                                            </div>
                                        )}
                                        <h2 className="pt-6 pl-12 text-2xl tracking-tight font-light dark:text-white">Heart Rate</h2>
                                        <div className="p-6">
                                            <ScrubberChart />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mb-6 bg-white rounded-3xl shadow-lg">
                                {currentUser && (
                                    <div
                                        className="relative group"
                                        onMouseEnter={() => setShowMapHelper(true)}
                                        onMouseLeave={() => setShowMapHelper(false)}
                                    >
                                        {showMapHelper && (
                                            <div className="absolute left-0 bottom-full mt-2 p-2 bg-gray-200 text-sm rounded-md shadow-md">
                                                Click on the populated chart to show location during an activity
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="pt-6 pl-12 text-2xl tracking-tight font-light dark:text-white">Map</h2>
                                            <div className="p-6">
                                                <GoogleMaps />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/4 order-first md:order-last">
                            <div className="mb-6 bg-white rounded-3xl shadow-lg">
                                {currentUser && (
                                    <div
                                        className="relative group"
                                        onMouseEnter={() => setShowFitbitHelper(true)}
                                        onMouseLeave={() => setShowFitbitHelper(false)}
                                    >
                                        {showFitbitHelper && (
                                            <div className="absolute left-0 bottom-full mt-2 p-2 bg-gray-200 text-sm rounded-md shadow-md">
                                                Log in and select an activity to get started
                                            </div>
                                        )}
                                        <div className="pt-6 pl-8">
                                            <FitbitLogin />
                                        </div>
                                        <div className="pt-2 pl-8 pb-2">
                                            <FitbitActivityList />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4 bg-white rounded-3xl shadow-lg">
                            {currentUser && (
                                    <div
                                        className="relative group"
                                        onMouseEnter={() => setShowJournalHelper(true)}
                                        onMouseLeave={() => setShowJournalHelper(false)}
                                    >
                                        {showJournalHelper && (
                                            <div className="absolute left-0 bottom-full mt-2 p-2 bg-gray-200 text-sm rounded-md shadow-md">
                                                Click on the populated chart to show journal during an activity
                                            </div>
                                        )}
                                        <div className="pt-2 pl-8 pb-2">
                                            <CurrentJournal />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
