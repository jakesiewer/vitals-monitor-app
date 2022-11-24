import React from 'react'

import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
    const { currentUser } = useAuth();

    // const form = document.querySelector("form");

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
        } catch (e) {
            alert("Failed to submit");
        }

        // setLoading(false);
    }

    return (
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
                                className="h-10 px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800"
                                onClick={handleFormSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}