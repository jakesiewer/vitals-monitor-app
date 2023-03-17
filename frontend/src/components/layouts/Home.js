import React from 'react'
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
    const isSmallScreen = window.innerWidth > 1000;

    // useEffect(() => {
    //     console.log(isSmallScreen);
    //     console.log(window.innerWidth)
    // }, []);

    return (
        <>
            {/* {isSmallScreen ? (
            <div className='flex w-full justify-center space-x-24 pt-12 pb-24 bg-stone-50'>
                <div className="w-1/2 inline-block">
                    <div className="grid grid-cols-1 gap-12">
                        <div className="bg-white col-span-1 rounded-3xl shadow-lg flex-col" style={{ height: "max-content" }}>
                            {currentUser && (
                                <>
                                    <h2 className="pt-6 pl-12 mt-4 text-2xl tracking-tight font-light dark:text-white">Heart Rate</h2>
                                    <div className="p-6">
                                        <ScrubberChart />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="bg-white col-span-1 rounded-3xl shadow-lg flex-col" style={{ height: "max-content" }}>
                            {currentUser && (
                                <>
                                    <h2 className="pt-6 pl-12 mt-4 text-2xl tracking-tight font-light dark:text-white">Map</h2>
                                    <div className="p-6">
                                        <GoogleMaps />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-1/4 inline-block">
                    <div className="grid grid-cols-1 gap-12">
                        <div className="col-span-1 bg-white rounded-3xl shadow-lg flex-col" style={{ height: "max-content" }}>
                            {currentUser && (
                                <>
                                    <div className="pt-6 pl-8">
                                        <FitbitLogin />
                                    </div>
                                </>
                            )}
                            {currentUser && (
                                <>
                                    <div className="pt-2 pl-8">
                                        <FitbitActivityList />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="col-span-1 bg-white rounded-3xl shadow-lg flex-col" style={{ height: "max-content" }}>
                            {currentUser && (
                                <div className="pt-2 pl-8">
                                    <CurrentJournal />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            ) : (<></>)} */}
<div className="container mx-auto p-4">
  <div className="flex flex-col md:flex-row">
    <div className="md:w-3/4 md:mr-24 mb-6 md:mb-0">
      <div className="mb-6 bg-white rounded-3xl shadow-lg">
        {currentUser && (
          <>
            <h2 className="pt-6 pl-12 text-2xl tracking-tight font-light dark:text-white">Heart Rate</h2>
            <div className="p-6">
              <ScrubberChart />
            </div>
          </>
        )}
      </div>
      <div className="mb-6 bg-white rounded-3xl shadow-lg">
        {currentUser && (
          <>
            <h2 className="pt-6 pl-12 text-2xl tracking-tight font-light dark:text-white">Map</h2>
            <div className="p-6">
              <GoogleMaps />
            </div>
          </>
        )}
      </div>
    </div>
    <div className="md:w-1/4 order-first md:order-last">
      <div className="mb-6 bg-white rounded-3xl shadow-lg">
        {currentUser && (
          <>
            <div className="pt-6 pl-8">
              <FitbitLogin />
            </div>
            <div className="pt-2 pl-8 pb-2">
              <FitbitActivityList />
            </div>
          </>
        )}
      </div>
      <div className="mb-4 bg-white rounded-3xl shadow-lg">
        {currentUser && (
          <>
            <div className="pt-2 pl-8 pb-2">
              <CurrentJournal />
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</div>


        </>
    );
}
