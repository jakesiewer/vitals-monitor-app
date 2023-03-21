import React, { useState } from 'react'
import { CalendarIcon } from "@heroicons/react/solid";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useAuth } from "../../contexts/AuthContext";
import { InsertData } from '../../services/JournalService';
import { getAllJournals } from '../../services/JournalService';

export default function Journal() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('journalEntry');
    const [journals, setJournals] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    function handleFormSubmit(e) {
        e.preventDefault();

        const data = new FormData(e.target.form);

        const value = new FormData();

        value.mood = data.getAll("mood");
        value.positive = data.getAll("positive");
        value.negative = data.getAll("negative");
        value.activities = data.getAll("activities");
        value.journal = data.getAll("journal");
        value.comments = data.getAll("comments");

        console.log({ value });

        try {
            console.log("Submit button clicked")
            // setLoading(true);
            // await login(email, password);
            // navigate("/profile");
            InsertData(value);

        } catch (e) {
            alert("Failed to submit");
            console.log(e)
        }

        // setLoading(false);
    }

    const handleJournalSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Submit button clicked")

            if (!selectedDate) {
                alert('Please pick a date');
                return;
            }

            const response = await getAllJournals(convertCalendarDate(selectedDate))
            setJournals(response);

        } catch (e) {
            alert("Failed to submit");
            console.log(e)
        }
    }


    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowCalendar(false); // hide the calendar when a date is selected
    };

    const handleCalendarClick = () => {
        setShowCalendar(true); // show the calendar when the icon is clicked
    };

    const convertCalendarDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero for single-digit months
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero for single-digit days
        const formattedDate = `${day}/${month}/${year}, 00:00:00`;

        return formattedDate;
    }

    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 bg-stone-50 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-3xl px-8 pt-6 pb-8 mb-4 flex flex-col my-2 w-full lg:w-1/2">
                    <div className="mb-4">
                        <nav className="flex flex-row justify-center gap-4 relative">
                            <div className="flex flex-row space-x-4">
                                <button
                                    className={`text-lg font-semibold px-6 py-2 focus:outline-none ${activeTab === 'journalEntry' ? 'text-sky-500' : 'text-gray-500'
                                        }`}
                                    onClick={() => setActiveTab('journalEntry')}
                                >
                                    Journal Entry
                                </button>
                                <button
                                    className={`text-lg font-semibold px-6 py-2 focus:outline-none ${activeTab === 'getJournals' ? 'text-sky-500' : 'text-gray-500'
                                        }`}
                                    onClick={() => setActiveTab('getJournals')}
                                >
                                    Get Journals
                                </button>
                            </div>
                            <span
                                className="absolute h-1 w-32 bg-sky-500 rounded-full transition-all duration-300"
                                style={{
                                    bottom: 0,
                                    left: '50%',
                                    transform: activeTab === 'journalEntry' ? 'translateX(-145px)' : 'translateX(20px)',
                                }}
                            />
                        </nav>
                    </div>

                    <div className="w-full">
                        {activeTab === 'journalEntry' && (
                            <form onSubmit={handleFormSubmit}>
                                <>
                                    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                                        <div className="max-w-xl w-full space-y-8">
                                            <form>
                                                <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
                                                    Log Your Mood
                                                </h2>
                                                <div className="mt-4 py-4">
                                                    <span className="text-gray-700">Rate Your Mood {"(Low to High)"}</span>
                                                    <div className="mt-2 text-center">
                                                        <label className="inline-flex items-center">
                                                            <input type="radio" className="form-radio" name="mood" value="1" />
                                                            <span className="ml-2">1</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="2" />
                                                            <span className="ml-2">2</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="3" />
                                                            <span className="ml-2">3</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="4" />
                                                            <span className="ml-2">4</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="5" />
                                                            <span className="ml-2">5</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="6" />
                                                            <span className="ml-2">6</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="7" />
                                                            <span className="ml-2">7</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="8" />
                                                            <span className="ml-2">8</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="9" />
                                                            <span className="ml-2">9</span>
                                                        </label>
                                                        <label className="inline-flex items-center ml-6">
                                                            <input type="radio" className="form-radio" name="mood" value="10" />
                                                            <span className="ml-2">10</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="block mt-4">
                                                    <span className="text-gray-700">Did you experience any positive emotions?</span>
                                                    <div className="mt-2">
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Joy" />
                                                                <span className="ml-2">Joy</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Gratitude" />
                                                                <span className="ml-2">Gratitude</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Serenity" />
                                                                <span className="ml-2">Serenity</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Interest" />
                                                                <span className="ml-2">Interest</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Hope" />
                                                                <span className="ml-2">Hope</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Pride" />
                                                                <span className="ml-2">Pride</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Amusement" />
                                                                <span className="ml-2">Amusement</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Inspiration" />
                                                                <span className="ml-2">Inspiration</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Awe" />
                                                                <span className="ml-2">Awe</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Love" />
                                                                <span className="ml-2">Love</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Satisfaction" />
                                                                <span className="ml-2">Satisfaction</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Confidence" />
                                                                <span className="ml-2">Confidence</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Optimism" />
                                                                <span className="ml-2">Optimism</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="positive" value="Happiness" />
                                                                <span className="ml-2">Happiness</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" />
                                                                <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="block mt-4">
                                                    <span className="text-gray-700">Did you experience any negative emotions?</span>
                                                    <div className="mt-2">
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Anger" />
                                                                <span className="ml-2">Anger</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Emptiness" />
                                                                <span className="ml-2">Emptiness</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Frustration" />
                                                                <span className="ml-2">Frustration</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Inadequacy" />
                                                                <span className="ml-2">Inadequacy</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Helplessness" />
                                                                <span className="ml-2">Helplessness</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Fear" />
                                                                <span className="ml-2">Fear</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Guilt" />
                                                                <span className="ml-2">Guilt</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Loneliness" />
                                                                <span className="ml-2">Loneliness</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Overwhelmed" />
                                                                <span className="ml-2">Overwhelmed</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Jealousy" />
                                                                <span className="ml-2">Jealousy</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Sadness" />
                                                                <span className="ml-2">Sadness</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Failure" />
                                                                <span className="ml-2">Failure</span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" name="negative" value="Resentment" />
                                                                <span className="ml-2">Resentment</span>
                                                            </label>
                                                        </div>
                                                        {/* <div>
                                    <label class="inline-flex mt-1 ml-6 items-center">
                                        <input type="checkbox" class="form-checkbox" />
                                        <span class="ml-2">Happiness</span>
                                    </label>
                                </div> */}
                                                        <div>
                                                            <label className="inline-flex mt-1 ml-6 items-center">
                                                                <input type="checkbox" className="form-checkbox" />
                                                                <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="block mt-4">
                                                        <span className="text-gray-700">What activities did you do?</span>
                                                        <div className="mt-2">
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Physical" />
                                                                    <span className="ml-2">Physical</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Social" />
                                                                    <span className="ml-2">Social</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Leisure" />
                                                                    <span className="ml-2">Leisure</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Eating" />
                                                                    <span className="ml-2">Eating</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="School" />
                                                                    <span className="ml-2">School</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Work" />
                                                                    <span className="ml-2">Work</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Shopping" />
                                                                    <span className="ml-2">Shopping</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Travel" />
                                                                    <span className="ml-2">Travel</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Meditation" />
                                                                    <span className="ml-2">Meditation</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" name="activities" value="Reading" />
                                                                    <span className="ml-2">Reading</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" />
                                                                    <span className="ml-2">Care {"(Elder, Child)"}</span>
                                                                </label>
                                                            </div>
                                                            <div>
                                                                <label className="inline-flex mt-1 ml-6 items-center">
                                                                    <input type="checkbox" className="form-checkbox" />
                                                                    <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-6">
                                                    <label className="block py-2">
                                                        <span className="text-gray-700">Journal</span>
                                                        <textarea className="form-textarea mt-1 px-6 py-3 h-36 block w-full border rounded-xl border-gray-100 shadow-sm" rows="3" placeholder="Enter text" name="journal"></textarea>
                                                    </label>
                                                    <label className="block py-2">
                                                        <span className="text-gray-700">Further Comments</span>
                                                        <textarea className="form-textarea mt-1 px-6 py-3 h-36 block w-full border rounded-xl border-gray-100 shadow-sm" rows="3" placeholder="Enter text" name="comments"></textarea>
                                                    </label>

                                                    {/* <div className="mb-2">
                                <label>
                                    <span className="text-gray-700">Your name</span>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full block px-16 py-2 mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        placeholder="John cooks"
                                    />
                                </label>
                            </div> */}
                                                </div>
                                                <div className="float-right mb-6 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="h-10 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                                                        onClick={handleFormSubmit}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </>
                            </form>
                        )}
                        {activeTab === 'getJournals' && (
                            <div>
                                <div className="flex justify-center items-center">
                                    <button
                                        type="submit"
                                        className="h-10 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                                        onClick={handleJournalSubmit}
                                    >
                                        Get Journals
                                    </button>
                                    <div className="inline-block pl-4" onClick={handleCalendarClick}>
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
                                </div>
                                <div className="p-6">
                                    {journals && journals.length > 0 ? (
                                        journals.map((journal, index) => (
                                            <div key={index} className="pb-8">
                                                <div>
                                                    <h2 className="inline-block font-medium text-gray-400">Time:&nbsp;</h2>
                                                    <p className="inline-block font-medium text-slate-600 pb-4">{journal.timestamp}</p>
                                                </div>
                                                <div>
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
                                                    <p className="p-3 text-[14px] text-gray-400">{journal.journal[0]}</p>
                                                </div>
                                                <h2 className="font-medium text-gray-400 pb-4">Further Comments:&nbsp;</h2>
                                                <div className="rounded-lg border-solid border border-gray-300 mb-4">
                                                    <p className="p-3 text-[14px] text-gray-400">{journal.comments[0]}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <h2 className="text-gray-400 font-medium">No Journal</h2>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

    // return (
    //     <>
    //         <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    //             <div className="max-w-xl w-full space-y-8">
    //                 <form>
    //                     <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
    //                         Log Your Mood
    //                     </h2>
    //                     <div className="mt-4 py-4">
    //                         <span className="text-gray-700">Rate Your Mood {"(Low to High)"}</span>
    //                         <div className="mt-2 text-center">
    //                             <label className="inline-flex items-center">
    //                                 <input type="radio" className="form-radio" name="mood" value="1" />
    //                                 <span className="ml-2">1</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="2" />
    //                                 <span className="ml-2">2</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="3" />
    //                                 <span className="ml-2">3</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="4" />
    //                                 <span className="ml-2">4</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="5" />
    //                                 <span className="ml-2">5</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="6" />
    //                                 <span className="ml-2">6</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="7" />
    //                                 <span className="ml-2">7</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="8" />
    //                                 <span className="ml-2">8</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="9" />
    //                                 <span className="ml-2">9</span>
    //                             </label>
    //                             <label className="inline-flex items-center ml-6">
    //                                 <input type="radio" className="form-radio" name="mood" value="10" />
    //                                 <span className="ml-2">10</span>
    //                             </label>
    //                         </div>
    //                     </div>
    //                     <div className="block mt-4">
    //                         <span className="text-gray-700">Did you experience any positive emotions?</span>
    //                         <div className="mt-2">
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Joy" />
    //                                     <span className="ml-2">Joy</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Gratitude" />
    //                                     <span className="ml-2">Gratitude</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Serenity" />
    //                                     <span className="ml-2">Serenity</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Interest" />
    //                                     <span className="ml-2">Interest</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Hope" />
    //                                     <span className="ml-2">Hope</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Pride" />
    //                                     <span className="ml-2">Pride</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Amusement" />
    //                                     <span className="ml-2">Amusement</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Inspiration" />
    //                                     <span className="ml-2">Inspiration</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Awe" />
    //                                     <span className="ml-2">Awe</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Love" />
    //                                     <span className="ml-2">Love</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Satisfaction" />
    //                                     <span className="ml-2">Satisfaction</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Confidence" />
    //                                     <span className="ml-2">Confidence</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Optimism" />
    //                                     <span className="ml-2">Optimism</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="positive" value="Happiness" />
    //                                     <span className="ml-2">Happiness</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" />
    //                                     <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
    //                                 </label>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="block mt-4">
    //                         <span className="text-gray-700">Did you experience any negative emotions?</span>
    //                         <div className="mt-2">
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Anger" />
    //                                     <span className="ml-2">Anger</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Emptiness" />
    //                                     <span className="ml-2">Emptiness</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Frustration" />
    //                                     <span className="ml-2">Frustration</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Inadequacy" />
    //                                     <span className="ml-2">Inadequacy</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Helplessness" />
    //                                     <span className="ml-2">Helplessness</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Fear" />
    //                                     <span className="ml-2">Fear</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Guilt" />
    //                                     <span className="ml-2">Guilt</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Loneliness" />
    //                                     <span className="ml-2">Loneliness</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Overwhelmed" />
    //                                     <span className="ml-2">Overwhelmed</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Jealousy" />
    //                                     <span className="ml-2">Jealousy</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Sadness" />
    //                                     <span className="ml-2">Sadness</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Failure" />
    //                                     <span className="ml-2">Failure</span>
    //                                 </label>
    //                             </div>
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" name="negative" value="Resentment" />
    //                                     <span className="ml-2">Resentment</span>
    //                                 </label>
    //                             </div>
    //                             {/* <div>
    //                                 <label class="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" class="form-checkbox" />
    //                                     <span class="ml-2">Happiness</span>
    //                                 </label>
    //                             </div> */}
    //                             <div>
    //                                 <label className="inline-flex mt-1 ml-6 items-center">
    //                                     <input type="checkbox" className="form-checkbox" />
    //                                     <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
    //                                 </label>
    //                             </div>
    //                         </div>
    //                         <div className="block mt-4">
    //                             <span className="text-gray-700">What activities did you do?</span>
    //                             <div className="mt-2">
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Physical" />
    //                                         <span className="ml-2">Physical</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Social" />
    //                                         <span className="ml-2">Social</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Leisure" />
    //                                         <span className="ml-2">Leisure</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Eating" />
    //                                         <span className="ml-2">Eating</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="School" />
    //                                         <span className="ml-2">School</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Work" />
    //                                         <span className="ml-2">Work</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Shopping" />
    //                                         <span className="ml-2">Shopping</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Travel" />
    //                                         <span className="ml-2">Travel</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Meditation" />
    //                                         <span className="ml-2">Meditation</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" name="activities" value="Reading" />
    //                                         <span className="ml-2">Reading</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" />
    //                                         <span className="ml-2">Care {"(Elder, Child)"}</span>
    //                                     </label>
    //                                 </div>
    //                                 <div>
    //                                     <label className="inline-flex mt-1 ml-6 items-center">
    //                                         <input type="checkbox" className="form-checkbox" />
    //                                         <input className="form-input ml-2 px-2 block w-full" placeholder="Other" />
    //                                     </label>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                     <div className="mt-6">
    //                         <label className="block py-2">
    //                             <span className="text-gray-700">Journal</span>
    //                             <textarea className="form-textarea mt-1 px-6 py-3 h-36 block w-full border rounded-xl border-gray-100 shadow-sm" rows="3" placeholder="Enter text" name="journal"></textarea>
    //                         </label>
    //                         <label className="block py-2">
    //                             <span className="text-gray-700">Further Comments</span>
    //                             <textarea className="form-textarea mt-1 px-6 py-3 h-36 block w-full border rounded-xl border-gray-100 shadow-sm" rows="3" placeholder="Enter text" name="comments"></textarea>
    //                         </label>

    //                         {/* <div className="mb-2">
    //                             <label>
    //                                 <span className="text-gray-700">Your name</span>
    //                                 <input
    //                                     type="text"
    //                                     name="name"
    //                                     className="w-full block px-16 py-2 mt-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    //                                     placeholder="John cooks"
    //                                 />
    //                             </label>
    //                         </div> */}
    //                     </div>
    //                     <div className="float-right mb-6 mt-4">
    //                         <button
    //                             type="submit"
    //                             className="h-10 px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800"
    //                             onClick={handleFormSubmit}
    //                         >
    //                             Submit
    //                         </button>
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </>
    // );
}