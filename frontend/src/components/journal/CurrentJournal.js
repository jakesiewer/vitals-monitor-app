import React, { useState, useEffect } from 'react';
import { journalEventBus } from '../chart/ScrubberChart';

import { useAuth } from '../../contexts/AuthContext';

export const CurrentJournal = () => {
    const [journal, setJournal] = useState();

    useEffect(() => {
        // const fetchData = async () => {
        journalEventBus.on('journalDataUpdated', (currentJournal) => {

            setJournal(currentJournal);
        });

        return () => {
            journalEventBus.off('journalDataUpdated', () => () => { });
        };
        // }
        // fetchData();
    });

    useEffect(() => {
        console.log(journal);
    }, [journal]);

    return (
        <>
            <div>
                <div className="p-4 pb-6 pr-6">
                    <h2 className="pb-5 text-2xl tracking-tight font-light dark:text-white">Journal</h2>
                    {journal ? (
                        <><div>
                            <h2 className="inline-block font-medium text-gray-400">Overall Mood:&nbsp;</h2>
                            <p className="inline-block font-medium text-slate-600 pb-4">{journal.mood[0]}</p>
                        </div>
                            <div>
                                <h2 className="inline-block font-medium text-gray-400">Positive Emotion(s):&nbsp;</h2>
                                <p className='inline-block font-medium text-slate-600 pb-4'>{journal.positive}</p>
                            </div>
                            <div>
                                <h2 className="inline-block font-medium text-gray-400">Negative Emotion(s):&nbsp;</h2>
                                <p className='inline-block font-medium text-slate-600 pb-4'>{journal.negative}</p>
                            </div>
                            <div>
                                <h2 className="inline-block font-medium text-gray-400">Activities:&nbsp;</h2>
                                <p className='inline-block font-medium text-slate-600 pb-4'>{journal.activities}</p>
                            </div>
                            <h2 className="font-medium text-gray-400 pb-4">Journal</h2>
                            <div className="rounded-lg border-solid border border-gray-300 mb-4">
                                <p className="p-3 text-[10px] text-gray-400">{journal.journal[0]}</p>
                            </div>
                            <h2 className="font-medium text-gray-400 pb-4">Further Comments:&nbsp;</h2><div className="rounded-lg border-solid border border-gray-300 mb-4">
                                <p className="p-3 text-[10px] text-gray-400">{journal.comments[0]}</p>
                            </div></>
                    ) : (
                        <h2 className="text-gray-400 font-medium" >No Journal</h2>
                    )}
                </div>
            </div>
        </>
    );
};