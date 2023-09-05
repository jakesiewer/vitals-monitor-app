# Lifelog

The goal of this project is to develop a **mental awareness app** that **tracks heart rate data and GPS data alongside journal entries** which allows the user to have a minute-by-minute log of their mental and bodily behaviour, giving them an **in-depth view at their emotional, physical, and cognitive patterns**, ultimately empowering them to make informed decisions for better mental health and overall well-being.

***Note, this may documentation may not be completely up to date. It will be added to as more features are implemented***

## Client
**The client comprises of various components and layouts** written in ReactJS and serves as the **frontend**. The client communicates solely through the API exposed by the server described below. **This section will describe the components and layouts along with various miscellaneous elements**.

***App.js***

**App** is the main entry point to the frontend and comprises of the rrouting and layouts associated with each route. It also describes thee layouts which are shielded by private routes, notably Profile, Home, and Journal.

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import About from "./components/layouts/About";
import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import Home from "./components/layouts/Home"
import Journal from "./components/layouts/Journal"
import Profile from "./components/accounts/Profile";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import Header from "./components/layouts/Header";
import ErrorMessage from "./components/layouts/ErrorMessage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <ErrorMessage />
                <Routes>
                    <Route exact path="/" element={<About />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route
                        exact path="/profile"
                        element={
                            <WithPrivateRoute>
                                <Profile />
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact path="/home"
                        element={
                            <WithPrivateRoute>
                                <Home />
                            </WithPrivateRoute>
                        }
                    />
                    <Route
                        exact path="/journal"
                        element={
                            <WithPrivateRoute>
                                <Journal />
                            </WithPrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

#### Configuration Files
The configuration files are secret files, empty here and unavailable in the GitHub repo, contact jake.siewer.2020@mumail.ie for an instance of these configuration files.

***.env***
This file contains the configurations for the connected services.

```javascript
REACT_APP_FIREBASE_API_KEY = ""
REACT_APP_FIREBASE_AUTH_DOMAIN = ""
REACT_APP_FIREBASE_DATABASE_URL= ""
REACT_APP_FIREBASE_PROJECT_ID = ""
REACT_APP_FIREBASE_STORAGE_BUCKET = ""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ""
REACT_APP_FIREBASE_APP_ID = ""
REACT_APP_MEASUREMENT_ID = ""

REACT_APP_FITBIT_CLIENT_ID = ""
REACT_APP_STRAVA_CLIENT_ID = ""

REACT_APP_GOOGLE_MAPS_API_KEY = ""
```

#### Components

***FitbitLogin.js***

**FitbitLogin** includes two functions, handleLogin() and handleLogout(), that respectively handle the login and logout processes. When the user clicks the "Log In" button, the handleLogin() function redirects the user to the Fitbit login page, passing in the app's client ID and other parameters. When the user successfully logs in, they are redirected back to the application's callback URL, which triggers the useEffect() hook to store the access token.

When the component loads, it checks for an access token in the URL parameters. If an access token is found, it is stored in the component's state and in the browser's local storage. This allows the user to stay logged in even if they refresh the page.

If the user is already logged in, the component displays a "Log Out" button, which triggers the handleLogout() function when clicked. This removes the access token from the local storage and updates the component's state to reflect the logout status.

```javascript
import React, { useState, useEffect } from 'react';

const FitbitLogin = () => {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        if (token) {
            setAccessToken(token);
            localStorage.setItem('fitbit_access_token', token);
        }
    }, []);

    function handleLogin() {
        const client_id = process.env.REACT_APP_FITBIT_CLIENT_ID;
        window.location = `https://www.fitbit.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3001/api/fitbit-callback&scope=activity%20heartrate%20location`;
    }

    function handleLogout() {
        localStorage.removeItem('fitbit_access_token');
        setAccessToken('');
    }

    return (
        <>
            <h2 className="mt-4 mb-2 text-2xl tracking-tight font-light text-slate-600 dark:text-white">Log in with Fitbit</h2>
            {accessToken ? (
                <div>
                    <p className='mb-2 text-slate-600'>You are logged in with Fitbit!</p>
                    <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Log Out</button>
                </div>
            ) : (
                <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogin}>Log In</button>
            )}
        </>
    );
};

export default FitbitLogin;
```

***FitbitActivityList.js***

**FitbitActivityList** fetches Fitbit activity data using the server API endpoint and displays the list of activities as radio buttons. When the user clicks on a radio button, the component calls a function to fetch the detailed activity data using the TCX file link and displays it.

The component also provides a calendar interface to select a particular day's activities. When the user clicks on the calendar icon, it shows a calendar where the user can select a particular date. The selected date is stored in the selectedDate state variable and is used to fetch activities for that particular day.

The component is also responsible for formatting the date in the desired format and handling errors like when no access token is found or when no activity data is found for a particular date.

```javascript
import React, { useState } from 'react';
import axios from 'axios';
import { CalendarIcon } from "@heroicons/react/solid";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { GetUserActivity } from './ActivityData';
import { getFitbitActivityData } from './FitbitActivityData';

const FitbitActivityList = () => {
    const [activities, setActivities] = useState([]);
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
        if (response.data.length == 0) {
            alert("No activity data found, please select a valid date");
        }
        else {
            console.log(response.data)
            setActivities(response.data);
        }
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
        <>
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
                    role="img"
                    onClick={() => setShowCalendar(!showCalendar)}
                />
            </div>
            {showCalendar && (
                <Calendar
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
        </>
    );
};

export default FitbitActivityList;
```

***ScrubberChart.js***

**ScrubberChart** configures the chart that the Fitbit health data is injected into. The data is injected by the FitbitActivityList component when an activity is selected.

By default, the chart contains no data while the data is updated through an EventEmitter controlled by the FitbitActivityList component.

The ScrubberChart updates the dropped pin on the map component through an EventEmitter named mapEventBus.

```javascript
import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import EventEmitter from 'events';
import fitbitEventBus from '../tracker/FitbitActivityData';
import { getCurrentJournal } from '../../services/JournalService';

export const journalEventBus = new EventEmitter();
export const mapEventBus = new EventEmitter();

const initialData = [{ name: 'No Data', Lat: 0, Lng: 0, HR: 0, amt: 160 }];

const ScrubberChart = () => {
	const [lat, setLat] = useState();
	const [lng, setLng] = useState();
	const [data, setData] = useState(initialData);

	useEffect(() => {
		fitbitEventBus.on('fitbitDataUpdated', (newData) => {
			setData(newData.data);
		});

		return () => {
			fitbitEventBus.off('fitbitDataUpdated', () => () => { });
		};
	}, [lat, lng]);

	const handleClick = async (e) => {
		try {
			setLat(e.activePayload[0].payload.Lat);
			setLng(e.activePayload[0].payload.Lng);

			mapEventBus.emit('mapDataUpdated', { 'lat': e.activePayload[0].payload.Lat, 'lng': e.activePayload[0].payload.Lng });

			const currentJournal = await getCurrentJournal(e.activePayload[0].payload.name);
			journalEventBus.emit('journalDataUpdated', currentJournal);
		}
		catch {
			alert("Invalid Click")
		}
	}

	return (
		<>
			<div>
				<ResponsiveContainer aspect={2}>
					<LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} onClick={handleClick}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" tick={{ fontSize: 12 }} />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="HR" stroke="#8884d8" dot={{ r: 0 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</>
	);
};

export default ScrubberChart;
```

***GoogleMaps.jsx***

**GoogleMaps** component uses the Google Maps API to display a map and add a marker to a particular location. The component is wrapped in a container to manage its layout.

The component uses useState and useEffect hooks to manage its state variables like current, showingInfoWindow, activeMarker, selectedPlace, and markers. useState is used to create state variables and useEffect is used to listen for events.

The component displays a map and sets an initial location to Maynooth, Ireland. When the user clicks on the map, it sets a marker at the clicked location and updates the selected location's name in the InfoWindow. When the user clicks on the marker, it shows an InfoWindow with the location's name.

The component also listens to an event called "mapDataUpdated" controlled by the ScrubberChart component using the mapEventBus, which updates the current location of the marker. When the current location changes, the component updates the marker's position and resets the InfoWindow.

```javascript
import React, { Component, useEffect, useState } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { mapEventBus } from '../chart/ScrubberChart';

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

export const MapContainer = () => {
  const [current, setCurrent] = useState({
    lat: 53.3813477,
    lng: -6.5990704
  });

  useEffect(() => {
    mapEventBus.on('mapDataUpdated', (location) => {
      setShowingInfoWindow(false);
      setCurrent(location);
    });

    return () => {
      mapEventBus.off('mapDataUpdated', () => () => { });
    };
  }, []);

  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const onMarkerClick = (props, marker, e) => {
    const geocoder = new window.google.maps.Geocoder();
    const location = new window.google.maps.LatLng(current.lat, current.lng);
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK') {
        setSelectedPlace(results[0].formatted_address);
      }
    });
      setActiveMarker(marker);
      setShowingInfoWindow(true);
    }

  const onClose = (props) => {
      if (showingInfoWindow) {
        setShowingInfoWindow(false);
      }
    };

    return (
      <div id="map-wrapper" style={{ height: '500px', width: '100%', position: 'relative' }}>
        <Map
          google={window.google}
          zoom={14}
          style={mapStyles}
          initialCenter={current}
          onClick={onMapClick}
        >
          <Marker
            position={{
              lat: current.lat,
              lng: current.lng
            }}
            onClick={onMarkerClick}
          />
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={onClose}
          >
            {selectedPlace && (
              <div>
                <h3>{selectedPlace}</h3>
              </div>
            )}
          </InfoWindow>
        </Map>
      </div>
    );
  }
```

***CurrentJournal.js***

**CurrentJournal** is used to display a user's journal data. The component listens to an event called journalDataUpdated using the journalEventBus to update the state variable journal when the journal data is updated through the ScrubberChart component.

The component uses useState and useEffect hooks to manage its state variables. useState is used to create a state variable called journal, which holds the journal data. useEffect is used to listen for events and log the journal data when it changes.

The component displays the journal data if it exists or shows a message if there is no journal data. The displayed journal data includes the user's overall mood, positive and negative emotions, activities, journal entry, and any further comments. If the user has no journal data, the component displays a message saying "No Journal."

```javascript
import React, { useState, useEffect } from 'react';
import { journalEventBus } from '../chart/ScrubberChart';

export const CurrentJournal = () => {
    const [journal, setJournal] = useState();

    useEffect(() => {
        journalEventBus.on('journalDataUpdated', (currentJournal) => {

            setJournal(currentJournal);
        });

        return () => {
            journalEventBus.off('journalDataUpdated', () => () => { });
        };
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
```

### Accounts

***Login.js***

**Login** component renders a form with inputs for email and password. When the form is submitted, the code calls the login function from the AuthContext context. If the login is successful, the user is redirected to the home page. If the login fails, an error message is displayed through **ErrorMessage.js**

```javascript
//  Login.js

import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, login, setError } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/home");
        } catch (e) {
            setError("Failed to login");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
                        Login to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className=" w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-800 hover:bg-sky-900"
                        >
                            Login
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/register"
                                className="text-blue-600 hover:underline dark:text-blue-500"
                            >
                                Don't have an account? Register
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>)
}

```

***Logout.js***

**Logout** is a modal that is displayed when a user clicks on the "logout" button. The modal asks the user to confirm that they want to logout, and if they confirm, the user is logged out and redirected to the login page.

```javascript
// Logout.js

import { Fragment, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";

import { useAuth } from "../../contexts/AuthContext";

export default function Logout({ modal, setModal }) {
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const { logout, setError } = useAuth();

  async function handleLogout() {
    try {
      setError("");
      await logout();
      setModal(false);
      navigate("/login");
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    <Transition.Root show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-200 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                    {/* <a>logout</a> */}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-500 dark:text-gray-400"
                    >
                      Logging out
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to log out ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center shadow-sm px-4 py-2  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                  rounded-md border border-gray-300 bg-white text-gray-500 text-base font-medium hover:bg-gray-100 focus:outline-none focus:ring-gray-200 focus:ring-2 focus:ring-offset-2 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600
                  "
                  onClick={() => setModal(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
```

***Logout.js***


**Logout** is a registration form. It has fields for email, password, and confirm password. When the form is submitted, the code checks to see if the password and confirm password match. If they don't, an error is displayed. If they do match, the code tries to register the user with the given email and password. If the registration is successful, the user is redirected to the profile page. If the registration is unsuccessful, an error is displayed.

```javascript
//  Register.js

import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext";

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, register, setError } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);
            await register(email, password);
            navigate("/profile");
        } catch (e) {
            setError("Failed to register");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
                        Register your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className=" w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-800 hover:bg-sky-900"
                        >
                            Register
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline dark:text-blue-500"
                            >
                                Already have an account? Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>)
}

```

### Layouts

***About.js***

**About** is a simple Layout that descibes the project, it's features and the team behind it (Jake Siewer or Me).

```javascript

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import auth from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import maynoothImage from '../../assets/maynooth.jpg';

export default function About() {

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <HeroSection />
                <LoginSection />
                <FeaturesSection />
                <TeamSection />

            </div>

        </div>
    );
};

const LoginSection = () => {
    const currentUser = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const user = auth.currentUser;
            const token = user && (await user.getIdToken());
        
            const payloadHeader = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            const res = await fetch("http://localhost:3001/auth", payloadHeader);
          } catch (e) {}
        };
    
        fetchData();
      });

    const handleLogin = (e) => {
        e.preventDefault();

        try {
            navigate("/login");

        } catch (e) {
            alert("Failed to redirect");
            console.log(e)
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();

        try {
            navigate("/register");

        } catch (e) {
            alert("Failed to redirect");
            console.log(e)
        }
    }

    return (
        <>
            {currentUser.currentUser == null && (
                <section className="text-center">
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="inline-block h-10 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                            onClick={handleLogin}
                        >
                            Login
                        </button>
                        <button
                            type="submit"
                            className="inline-block h-10 ml-4 px-5 text-white bg-sky-500 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-sky-800"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </section>
            )}
        </>
    );
};

const HeroSection = () => {
    return (
        <section className="text-center py-8">
            <h1 className="text-4xl font-light mb-4">About Lifelog</h1>
            <p className="text-lg text-slate-600">
                Learn about what our website does and how it can help you.
            </p>
        </section>
    );
};

const FeaturesSection = () => {
    const features = [
        {
            title: 'Connect To Fitbit',
            description: 'The connection our service makes to your Fitbit account will enable you to pull your activity data and display it alongside the various other features. This feature is secure and seamless. None of the data is stored, only read and displayed for your personal use.'
        },
        {
            title: 'Data Visualization',
            description: 'Your activity data will be displayed in a chart, depending on the Fitbit watch you are using and the features it , this chart will display various data points (Heart-Rate, Skin Temperature, Blood Oxygen, Respiratory Rate, etc.). With this data you will be able to see your location at the peaks and troughs of these data points. Alongside this, you can view your journals to know exactly your state of mind at that point, giving you an in-depth view at your emotional, physical, and cognitive patterns.'
        },
        {
            title: 'Journal Logging',
            description: 'Alongside various other features, we have included a method of logging mood journals, these mood journals are used to give you more context behind your physical data. Ideally, recording 2-hour segments on your Fitbit while simultaneously logging journals periodically during this time will give you the optimal experience. We have also included a method of viewing all your past journals for your own viewing experience.'
        }
    ];

    return (
        <section className="py-8">
            <h2 className="text-2xl font-light mb-4">Our Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} />
                ))}
            </div>
        </section>
    );
};

const FeatureCard = ({ feature }) => {
    return (
        <div className="p-6 border rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-light mb-2">{feature.title}</h3>
            <p className="text-slate-600">{feature.description}</p>
        </div>
    );
};

const TeamSection = () => {
    return (
        <section className="text-center py-8">
            <h2 className="text-2xl font-light mb-4">Our Team</h2>
            <p className="text-lg text-slate-600">
                Meet the individuals behind Lifelog and learn more about their roles and expertise.
            </p>
            <div className="flex justify-center items-center mt-8">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard key={index} member={member} />
                ))}
            </div>
        </section>
    );
};

const teamMembers = [
    {
        name: 'Jake Siewer',
        role: 'Developer',
        image: maynoothImage,
    }
];

const TeamMemberCard = ({ member }) => {
    return (
        // <div className="flex justify-center items-center">
        <div className="p-6 border rounded-lg shadow-sm bg-white">
            <img
                className="w-full h-64 object-cover mb-4 rounded-lg"
                src={member.image}
                alt={member.name}
            />
            <h3 className="text-xl font-light mb-2">{member.name}</h3>
            <p className="text-gray-600 text-slate-600">{member.role}</p>
        </div>
        // </div>
    );
};
```

***ErrorMessage.js***

**ErrorMessage** imports an icon called "XCircleIcon" from the HeroIcons library, and also imports the useAuth function from **AuthContext.js**

The ErrorMessage function is then defined. This function uses the useAuth function to get the error and setError values from the AuthContext context.

If the "error" value is true, then a div element is rendered. This div element contains another div element, which contains the XCircleIcon icon and a message saying what the error is.

If the user clicks on the XCircleIcon icon, then the "setError" function is called with an empty string, which will clear the error message.

```javascript
import { XCircleIcon } from "@heroicons/react/solid";

import { useAuth } from "../../contexts/AuthContext";

export default function ErrorMessage() {
  const { error, setError } = useAuth();

  return (
    error && (
      <div className="flex justify-center">
        <div className="rounded-md max-w-md w-full bg-red-50 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                onClick={() => setError("")}
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error: {error}
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
```

***Header.js***

**Header** defines a React component. This component renders a navbar with some links in it. If the user is logged in which the header check in thee UseEffect hook, the navbar will also include links for the user's home page, profile, and a logout button. If the user clicks the logout button, a modal with a logout form will appear.

```javascript
// Header.js

import { LogoutIcon, QuestionMarkCircleIcon, UserIcon, HomeIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


import auth from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";

export default function Header() {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        console.log(token)

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await fetch("http://localhost:3001/auth", payloadHeader);
        console.log(await res.text());
        console.log(currentUser);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  });

  return (
    <>
      <nav className="px-2 sm:px-4 py-2.5 bg-slate-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link to="/" className="flex">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-600 dark:text-white font-sans">
              Lifelog
            </span>
          </Link>
          <div className="flex md:order-2">
            {/* <ThemeToggler /> */}

            {currentUser && (
              <>
                <Link
                  to="/home"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <HomeIcon className="w-8 h-8 rounded-full" aria-hidden="true"></HomeIcon>
                </Link>
                <Link
                  to="/"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <QuestionMarkCircleIcon className="w-8 h-8 rounded-full" aria-hidden="true"></QuestionMarkCircleIcon>
                </Link>
                <Link
                  to="/journal"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <PencilAltIcon className="w-8 h-8 rounded-full" aria-hidden="true"></PencilAltIcon>
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <UserIcon className="w-8 h-8 rounded-full" aria-hidden="true"></UserIcon>
                </Link>
                <button
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => setModal(true)}
                >
                  <LogoutIcon className="h-8 w-8 rounded-full" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}
```

***Journal.js***

**Journal** two buttons that allow users to toggle between two tabs: Journal Entry and Get Journals. Clicking each button triggers a corresponding function that updates the active tab state of the component.

When the Journal Entry tab is active a form is displayed in the format of a Journal. When filled out and submitted. The journal entry is uploaded to the corresponding user's Firebase database.

When the Get Journals tab is active, the component displays a form with a button labeled Get Journals. Clicking this button displays a list of journals corresponding with the Calendar date.

```javascript
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
            if (!selectedDate) {
                alert('Please pick a date');
                return;
            }


            const response = await getAllJournals(convertCalendarDate(selectedDate))
            if (response == undefined) {
                alert("No journal data found, please select a valid date");
            }
            else {
                console.log(response)
                setJournals(response);
            }
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
            <div className="min-h-screen bg-stone-50">
                <div className=" min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            </div>
        </>
    );
}
```

### Miscellaneous 

***WithPrivateRoute.js***

**WithPrivateRoute** defines a function that checks for authentication before passing a page onto the browser. If authenticated then the user is routed to their desired page, if not then the user is directed to the Login page.

```javascript

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const WithPrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();

    // If there is a current user it will render the passed down component
    if (currentUser) {
        return children;
    }

    // Otherwise redirect to the login route
    return <Navigate to="/login" />;
};

export default WithPrivateRoute;
```

***firebase.js***

**firebaseConfig** is an object that holds the app's Firebase configuration details such as the API key, database URL, and messaging sender ID. These details are obtained from environment variables that are prefixed with REACT_APP_ for security reasons. **initializeApp** is then called with firebaseConfig to initialize the Firebase app instance. **getAuth** is called with the initialized app instance to create an authentication instance which is assigned to the auth variable. The code also exports a function called **getDB**, which returns a connection to the Firebase Realtime Database. This function is called with the app instance to create the database connection.

```javascript
// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase  } from "firebase/database"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// gives us an auth instance
const auth = getAuth(app);

export const getDB = () => {

  return getDatabase(app);
}
```

***AuthContext.js***

**AuthContext** uyses various Firbase sign in, sign out, and register functions to authenticate the client side.

```javascript
// AuthContext.js

import { createContext, useContext, useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import auth from "../config/firebase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function register(email, password) {
        // If the new account was created, the user is signed in automatically.
        return createUserWithEmailAndPassword(auth, email, password);
    }
    
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        error,
        setError,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
```
***JournalService.js***

**JournalService** imports three different libraries: axios, and auth from the Firebase configuration file. It sets the baseURL variable to the journal API endpoint. The getUserToken function is defined as an asynchronous function that retrieves the current user's token from Firebase Authentication. If a user is logged in, it returns the user's unique ID (uid).

```javascript
import axios from "axios";
import auth from "../config/firebase";

import { getDB } from "../config/firebase";

const baseURL = "http://localhost:3001/journal/";

const getUserToken = async () => {
    const user = auth.currentUser;
    const token = user && (await user.getIdToken());
    return user.uid;
};
```

### Component Tests

***CurrentJournal.test.js***
This code is testing the CurrentJournal component. The first test checks that the component renders correctly when there is no journal data. The second test checks that the component renders correctly when there is journal data.

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrentJournal } from '../components/journal/CurrentJournal';
import { journalEventBus } from '../components/chart/ScrubberChart';

jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('CurrentJournal', () => {
  beforeEach(() => {
    render(<CurrentJournal />);
  });

  test('renders the component without journal data', () => {
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('No Journal')).toBeInTheDocument();
  });

  test('renders the component with journal data', () => {
    const journalData = {
      mood: ['Happy'],
      positive: ['Excited'],
      negative: ['Anxious'],
      activities: ['Running'],
      journal: ['I had a great day today!'],
      comments: ['Keep up the good work!'],
    };

    journalEventBus.emit('journalDataUpdated', journalData);

    expect(screen.getByText('Overall Mood:')).toBeInTheDocument();
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Positive Emotion(s):')).toBeInTheDocument();
    expect(screen.getByText('Excited')).toBeInTheDocument();
    expect(screen.getByText('Negative Emotion(s):')).toBeInTheDocument();
    expect(screen.getByText('Anxious')).toBeInTheDocument();
    expect(screen.getByText('Activities:')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('I had a great day today!')).toBeInTheDocument();
    expect(screen.getByText('Further Comments:')).toBeInTheDocument();
    expect(screen.getByText('Keep up the good work!')).toBeInTheDocument();
  });
});

```

***FitbitActivityList.test.js***

This code is testing the FitbitActivityList component. The component is rendered, and various tests are performed on it. These tests check that the component renders without crashing, that the calendar closes when a date is selected, and that the component fetches activities and displays them when the "Fetch Activities" button is clicked.

```javascript
import React from 'react';
import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from "axios";
import FitbitActivityList from '../components/tracker/FitbitActivityList';

jest.mock('axios');

describe('FitbitActivityList', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    const activitiesMock = [
        {
            logId: 1,
            originalStartTime: '2023-03-22T10:00:00',
            tcxLink: 'https://www.example.com/activity/1'
        },
        {
            logId: 2,
            originalStartTime: '2023-03-22T12:00:00',
            tcxLink: 'https://www.example.com/activity/2'
        }
    ];

    it('renders component without crashing', () => {
        render(<FitbitActivityList />);
    });

    it('closes the calendar when a date is selected', async () => {
        render(<FitbitActivityList />);
        const calendarIcon = screen.getByRole('img', { hidden: true });
        fireEvent.click(calendarIcon);

        const calendarDate = screen.getByText('22');
        fireEvent.click(calendarDate);

        await waitFor(() => {
            expect(screen.queryByRole('grid')).not.toBeInTheDocument();
        });
    });

    it('fetches activities and displays them when the "Fetch Activities" button is clicked', async () => {
        // Set a dummy fitbit_access_token in localStorage
        localStorage.setItem('fitbit_access_token', 'dummy-token');

        axios.get.mockResolvedValueOnce({ data: activitiesMock });

        render(<FitbitActivityList />);
        const fetchActivitiesButton = screen.getByText('Fetch Activities');
        fireEvent.click(fetchActivitiesButton);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/fitbit-activities', expect.any(Object));
            expect(screen.getByText(activitiesMock[0].originalStartTime)).toBeInTheDocument();
            expect(screen.getByText(activitiesMock[1].originalStartTime)).toBeInTheDocument();
        });

        // Clean up the localStorage after the test
        localStorage.removeItem('fitbit_access_token');
    });
});
```

***FitbitLogin.test.js***

This code is testing the FitbitLogin component. The tests check that the component behaves correctly when a user is logged in or logged out. The component is tested by creating a fake window.location object, which is used to simulate the behavior of a real browser window.


```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FitbitLogin from '../components/tracker/FitbitLogin';

// Set up a custom render function to mock the window.location.search
const customRender = (ui, { locationSearch = '', ...options } = {}) => {
  delete window.location;
  window.location = { search: locationSearch };
  return render(ui, options);
};

describe('FitbitLogin component', () => {
  test('renders login button when not logged in', () => {
    customRender(<FitbitLogin />);
    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument();
  });

  test('handles login and sets access token', () => {
    const fakeToken = 'fake_access_token';
    customRender(<FitbitLogin />, { locationSearch: `?access_token=${fakeToken}` });

    expect(localStorage.getItem('fitbit_access_token')).toBe(fakeToken);
    const logoutButton = screen.getByText('Log Out');
    expect(logoutButton).toBeInTheDocument();
  });

  test('handles logout and removes access token', () => {
    const fakeToken = 'fake_access_token';
    customRender(<FitbitLogin />, { locationSearch: `?access_token=${fakeToken}` });

    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('fitbit_access_token')).toBe(null);
    const loginButton = screen.getByText('Log In');
    expect(loginButton).toBeInTheDocument();
  });
});

```

***Login.test.js***

This code is testing the Login component. It imports a number of functions that will be used to test the Login component. The code then defines a customRender function that will be used to render the Login component. The code then defines a describe block for the Login component. Then a beforeEach block is created that will run before each test in the describe block. After that there is a test that will match a snapshot of the Login component, a test that renders a login form with email and password inputs, a test that renders a login button, a test that renders a register link, and a test that allows a user to enter an email and password.

```javascript
// Login.test.js

import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import Login from '../components/accounts/Login';

const customRender = (ui, options) =>
    render(ui, { wrapper: (props) => <Router><AuthProvider>{props.children}</AuthProvider></Router>, ...options });

describe('Login Component', () => {
    beforeEach(() => {
        customRender(<Login />, {});
    });

    test('matches snapshot', async () => {
        await waitFor(() => {
            const { container } = customRender(<Login />, {});
            expect(prettyDOM(container)).toMatchSnapshot();
        })
    });

    test('renders login form with email and password inputs', async () => {
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        })
    });

    test('renders login button', async () => {
        await waitFor(() => {
            const loginButton = screen.getByText('Login');
            expect(loginButton).toBeInTheDocument();
        })
    });

    test('renders register link', async () => {
        await waitFor(() => {
            const registerLink = screen.getByText("Don't have an account? Register");
            expect(registerLink).toBeInTheDocument();
            expect(registerLink).toHaveAttribute('href', '/register');
        })
    });

    test('allows user to enter email and password', async () => {
        await waitFor(() => {

            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('testPassword');
        })
    });
});

```

***Register.test.js***

This code is testing the Register component. The tests make sure that the component renders the form inputs and buttons correctly, and that the user is able to enter values into the form inputs.

```javascript
// Register.test.js

import { render, fireEvent, screen, waitFor, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Register from '../components/accounts//Register';

const customRender = (ui, options) =>
    render(ui, { wrapper: (props) => <Router><AuthProvider>{props.children}</AuthProvider></Router>, ...options });

describe('Register Component', () => {
    beforeEach(() => {
        customRender(<Register />, {});
    });

    test('matches snapshot', async () => {
        await waitFor(() => {
            const { container } = customRender(<Register />, {});
            expect(prettyDOM(container)).toMatchSnapshot();
        })
    });

    test('renders registration form with email, password, and confirm password inputs', async () => {
        await waitFor(() => {
            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
        })
    });

    test('renders register button', async () => {
        await waitFor(() => {
            const registerButton = screen.getByRole('button', { name: /register/i });
            expect(registerButton).toBeInTheDocument();
        })
    });

    test('renders login link', async () => {
        await waitFor(() => {
            const loginLink = screen.getByText('Already have an account? Login');
            expect(loginLink).toBeInTheDocument();
            expect(loginLink).toHaveAttribute('href', '/login');
        })
    });

    test('allows user to enter email, password, and confirm password', async () => {
        await waitFor(() => {
            const emailInput = screen.getByPlaceholderText('Email address');
            const passwordInput = screen.getByPlaceholderText('Password');
            const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
            fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('testPassword');
            expect(confirmPasswordInput.value).toBe('testPassword');
        })
    });
});

```

## Server

**The server comprises of various endpoints** written in ExpressJS and serves as an **API** for the frontend to communicate with various **resources like Fitbit and Firebase**. This section will break down each of the notable endpoints and describe the **processes used to gather and sanitize data**.

The initial plan was to use **Strava** instead of Fitbit, these Strava endpoints still exist in the codebase but are essentially residual, as they are not utilized in the client side

***index.js***
This is the main entry point to the server, it initializes the app and its port and the roots of each endpoint.

```javascript
// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import fitbitActivityRoutes from "./routes/fitbitActivityRoutes.js";
import fitbitAuthRoutes from "./routes/fitbitAuthRoutes.js";

import insertJournalRoute from './routes/journalRoutes.js'

const app = express();

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const axios = require("axios");
const strava = require('strava-v3');

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", VerifyToken);

const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("working fine");
});

app.use(cookieParser());
app.use("/api", stravaAuthRoutes);
// app.options('/api', cors(corsOptions))
app.use("/api", stravaActivityRoutes);

app.use("/api", fitbitAuthRoutes);
app.use("/api", fitbitActivityRoutes);

app.use("/journal", insertJournalRoute);
```

#### Configuration Files
The configuration files are secret files, empty here and unavailable in the GitHub repo, contact jake.siewer.2020@mumail.ie for an instance of these configuration files.

***serviceAccountKey.json***
This file contains the configurations for Firebase

```javascript
{
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
}

```
***.env***
This file contains the configurations for the connected services (strava not needed)

```javascript
PORT=3001

FITBIT_CLIENT_ID=""
FITBIT_CLIENT_SECRET=""

STRAVA_CLIENT_ID=""
STRAVA_CLIENT_SECRET=""
```

#### Fitbit Endpoints and Associated Functions
***fitbitAuthController.js***
> http://localhost:3001/api/fitbit-callback

<br>

**fitbitCallback** handles the callback once the auth flow is triggerd from the frontend. 

- client_id decribes the API configuration. This is configured in a .env file
- grant_type takes an authorization code and exchanges it for an access token
- redirect_uri contains the frontend redirect uri to which accessToken is sent
- code contains the access scopes required

```javascript
export const fitbitCallback = async (req, res) => {
    const { code } = req.query;
    const response = await axios.post('https://api.fitbit.com/oauth2/token', qs.stringify({
      client_id: client_id,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
      code: code,
    }), {
      headers: {
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const accessToken = response.data.access_token;
    console.log(accessToken);
    res.redirect(`${ frontendUri }?access_token=${ accessToken }`);
};
```

<br>

***fitbitActivityController.js***
> http://localhost:3001/api/fitbit-activities

<br>

**getFitbitActivities** describes the communication between the server and the Fitbit API to gain a list of activities.

- access_token is supplied in the call from the frontend. This allows the server access to Fitbit data
- afterDate describes the date in which to collect a max of 10 activities after said date

The GET request requests a list of 10 activities after the afterDate

```javascript
export const getFitbitActivities = (req, res) => {
    // Bearer with access token
    const access_token = req.headers.authorization;
    const afterDate = req.headers.after;

    const options = {
        url: `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${afterDate}&sort=asc&offset=0&limit=10`,
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        json: true
    };

    console.log(options);

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            body.activities = convertOriginalStartTime(body.activities);
            res.json(body.activities);
            console.log(body.activities);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
};
```

<br>

**convertOriginalStartTime** converts the originalStartTime in the response body associated with that activity in the format YYYY-MM-DDTHH:MM:SS.Z to DD-MM-YYYY HH:MM. This is for purposes of formatting for display on frontend

```javascript
const convertOriginalStartTime = (activities) => {
    // loop through each object in the array and convert the date format
    activities.forEach((obj) => {
        const originalStartTime = new Date(obj.originalStartTime);
        const day = originalStartTime.getDate();
        const month = originalStartTime.getMonth() + 1;
        const year = originalStartTime.getFullYear();
        const hours = originalStartTime.getHours();
        const minutes = originalStartTime.getMinutes();

        // Pad the day and month with a leading zero if they are less than 10
        const paddedDay = day < 10 ? `0${day}` : day;
        const paddedMonth = month < 10 ? `0${month}` : month;
        const paddedHr = hours < 10 ? `0${hours}` : hours;
        const paddedMin = minutes < 10 ? `0${minutes}` : minutes;

        // Create a string in the desired format
        const formattedDate = `${paddedDay}-${paddedMonth}-${year} ${paddedHr}:${paddedMin}`;

        obj.originalStartTime = formattedDate;
    });
    
    return activities;
}
```
<br>

> http://localhost:3001/api/fitbit-activities-data

<br>

**getFitbitActivityStream** returns the data assciated with a specific activity.

- accessToken is supplied in the headers from the frontend. This allows the server access to Fitbit data
- tcxLink is supplied in the headers. This links to the specific TCX fitness data of that activity

```javascript
export const getFibitActivityStream = (req, res) => {
    const accessToken = req.headers.authorization;
    const tcxLink = req.headers.tcxlink;

    const options = {
        url: tcxLink,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.garmin.tcx+xml'
        }
    };

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {

            const formattedData = tcxToJSON(response.body);

            res.json(formattedData);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
};
```

**tcxToJSON** converts the TCX response from Fitbit into formatted JSON to be directly injected into the chart

TCX files are segmented into bock of data called **trackpoints**, these trackpoints are ooped through and the required data (time, latitude, longitude, heartrate) are parsed out and formatted into JSON blocks

```javascript
const tcxToJSON = (body) => {
    const tcxString = body.toString();

    const dom = new JSDOM(tcxString, { contentType: "text/xml" });

    // Get all the Trackpoint elements
    const trackpoints = dom.window.document.querySelectorAll("Trackpoint");

    var formattedData = [];

    // Loop through each Trackpoint element and parse the data
    trackpoints.forEach((trackpoint, index) => {
        if (index % 2 === 1) {
            const datetime = new Date(trackpoint.getElementsByTagName("Time")[0].textContent);
            const time = datetime.toLocaleString('en-GB');
            const latitude = trackpoint.getElementsByTagName("LatitudeDegrees")[0].textContent;
            const longitude = trackpoint.getElementsByTagName("LongitudeDegrees")[0].textContent;
            const heartrate = parseInt(trackpoint.getElementsByTagName("HeartRateBpm")[0].getElementsByTagName("Value")[0].textContent);

            const entry = { name: time, Lat: latitude, Lng: longitude, HR: heartrate };

            formattedData.push(entry);
        }
    });

    return formattedData;
}
```

***fitbitActivityRoutes.js***
Below will display the Fitbit activity routes set up to create the aformentioned activity endpoints


```javascript
import express from 'express';

import { getFitbitActivities, getFibitActivityStream } from '../controllers/fitbitActivityController.js';

const router = express.Router();

router.get('/fitbit-activities', getFitbitActivities);
router.get('/fitbit-activity-data', getFibitActivityStream);

export default router;
```

***fitbitAuthRoutes.js***
Below will display the Fitbit auth routes set up to create the aformentioned authentication endpoints

```javascript
import express from "express";
import { fitbitLogin, fitbitCallback } from "../controllers/fitbitAuthController.js"

const router = express.Router();

router.get('/fitbit-callback', fitbitCallback);

export default router;
```

<br>

#### Journal Endpoints and Associated Functions
***journalControllers.js***
> http://localhost:3001/journal/insert

<br>

**insertJournal** describes the call to Firebase that inserts a journal composed on the client side

- data stores re.body which contains the journal FormData
- uid contains the user id that describes the authenticated user

```javascript
export const insertJournal = async (req, res) => {
  const data = req.body;
  const uid = req.headers.uid;

  const dbRef = admin.database().ref(`${uid}/journals`);
  dbRef.push(data)
    .then(() => {
      res.send('Data inserted successfully!');
    })
    .catch((error) => {
      console.error('Error inserting data:', error);
      res.status(500).send('Error inserting data');
    });
};
```

> http://localhost:3001/journal/nearest

**getNearestJournal** gets the nearest jounral to a specific timestamp. This is essential to the functionality of the scrbber chart on the frontend, as when a data point is clicked the nearest jounral to the time when that was recorded needs to be recieved.

- db contains the database reference
- dataId contains the user id associated with the logged in account
- timestamp contains the time to which the nearest journal needs to be fetched
- date is the formatted timestamp for the call
- dataRef contains the reference to the directory insode the database
- snapshot pulls a snapshot of the database directory
- query records the query used to find the nearest journal to a timestamp

```javascript
export const getNearestJournal = async (req, res) => {
  const db = admin.database();
  const dataId = req.query.uid;
  const timestamp = req.query.timestamp;
  const date = dateToDateObj(timestamp);
  const dataRef = db.ref('journals');

  try {
    const snapshot = await dataRef.child(dataId).once('value');
    const message = snapshot.val();
    const userId = snapshot.key;

    if (!message) {
      console.log("Not Found")
      return res.status(404).json({ error: 'Message not found' });
    }
    else if (date == 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid Date' });
    }
    else if (userId !== req.query.uid) {
      console.log("Unauthorized");
      return res.status(403).json({ error: 'Unauthorized' });
    }
    else {
      const unixTimestamp = date.getTime();
      const dbRef = db.ref(`journals/${userId}`);
      const query = dbRef.orderByChild('timestamp').startAt(unixTimestamp).limitToFirst(1);

      query.once('value')
        .then(snapshot => {
          let closestEntry = snapshot.val();
          const key = Object.keys(closestEntry); // extract the key of the first object
          closestEntry = formatJournal(closestEntry[key]);

          res.json(closestEntry);
        })
        .catch(error => {
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**dateToDateObj** turns a timestamp of the format DD/MM/YYYY, HH:MM:SS to a date object. In the above code block this date object is then turned into a unix timestamp.

```javascript
function dateToDateObj(timestamp) {
  const [datePart, timePart] = timestamp.split(", ");
  const [day, month, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  const dateObj = new Date(year, month - 1, day, hour, minute, second); // months are zero indexed

  return dateObj;
}
```

**formatJournal** formats the jounral for direct injection into the CurrentJournal component on the client side

```javascript
function formatJournal(journal) {
  journal.activities = journal.activities.join(', ');
  journal.negative = journal.negative.join(', ');
  journal.positive = journal.positive.join(', ');
  journal.timestamp = unixDateToDate(journal.timestamp);

  return journal;
}
```

**unixDateToDate** converts a unix formatted date to a date of the format DD-MM-YYY HH:MM

```javascript
function unixDateToDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
```

> http://localhost:3001/journal/all

**getAllJournals** works similarly to getNearestJournal. The difference is thatit collects all the journals for a specific day

```javascript
export const getAllJournals = async (req, res) => {
  const db = admin.database();
  const dataId = req.query.uid;
  const timestamp = req.query.timestamp;
  const date = dateToDateObj(timestamp);
  const dataRef = db.ref('journals');

  try {
    const snapshot = await dataRef.child(dataId).once('value');
    const message = snapshot.val();
    const userId = snapshot.key;

    if (!message) {
      console.log("Not Found");
      return res.status(404).json({ error: 'Message not found' });
    } else if (date == 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid Date' });
    } else if (userId !== req.query.uid) {
      console.log("Unauthorized");
      return res.status(403).json({ error: 'Unauthorized' });
    } else {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      const dbRef = db.ref(`journals/${userId}`);
      const query = dbRef.orderByChild('timestamp').startAt(startTimestamp).endAt(endTimestamp);

      query.once('value')
        .then(snapshot => {
          const entries = snapshot.val();
          const formattedEntries = [];

          Object.keys(entries).forEach(key => {
            let entry = formatJournal(entries[key]);
            formattedEntries.push(entry);
          });

          res.json(formattedEntries);
        })
        .catch(error => {
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

***fitbitActivityRoutes.js***
Below will display the journal routes set up to create the aformentioned journal endpoints

```javascript
import express from "express";

import { insertJournal, getNearestJournal, getAllJournals, getJournalId, getJournalTimestamp } from "../controllers/journalControllers.js";

const router = express.Router();

router.post("/insert", insertJournal);
router.get("/nearest", getNearestJournal);
router.get("/all", getAllJournals);

export default router;
```

#### Firebase Authentication and Associated Functions
***VerifyToken.js***
> http://localhost:3001/auth

**VerifyToken** uses the above route to confirm authentication on the server against the authentication on the client side using the getAuth() Firebase function inside **firebase-config.js**. The tokn is then decoded and a status 200 code is sent bac to the client side confirming verification.

- token contains the access token from the client side

```javascript
export const VerifyToken = async (req, res, next) => {

  let token;
  
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.json({ message: "Authorization header not present" });
  }


  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      console.log(req.user);
      res.status(200).json({ message: "Authenticated" });
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Access token invalid" });  }
};
```

***userController.js***

**getUser** gets the user information like user id, email, display name, and profile picture

```javascript
export const getUser = async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);

    // const { uid, email, displayName, photoURL } = userRecord;
    const { uid, email } = userRecord;

    res.status(200).json({ uid, email });
  } catch (error) {
    console.log(error);
  }
};
```

***user.js***

Below will display the user routes set up to create the user endpoints, which are used to get user data

```javascript
import express from "express";

import { getAllUsers, getUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/:userId", getUser);

export default router;
```

***firebase-config***

This file intializes the firebase app using the credentials in serviceAccountKey.json which is provided by Firebase and also sets up the reference to the database

```javascript
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccountKey = require('./serviceAccountKey.json');


const app = initializeApp({
  credential: cert(serviceAccountKey),
  databaseURL: 'https://finalyearproject-f8768-default-rtdb.europe-west1.firebasedatabase.app',
});

const auth = getAuth(app);
```

#### Libraries Used

***Client Side***

```javascript
    "@headlessui/react": "^1.7.3",
    "@heroicons/react": "^1.0.6",
    "@testing-library/dom": "^9.0.1",
    "dotenv": "^16.0.3",
    "firebase": "^9.12.1",
    "google-maps-react": "^2.0.6",
    "react": "^18.2.0",
    "react-calendar": "^4.0.0",
    "react-dom": "^18.2.0",
    "react-loader-spinner": "^5.3.4",
    "react-oauth2-hook": "^1.0.12",
    "react-router-dom": "^6.4.2",
    "react-scripts": "5.0.1",
    "recharts": "^2.3.2",
    "web-vitals": "^2.1.4"

    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "autoprefixer": "^10.4.12",
    "babel-jest": "^29.5.0",
    "jest": "^29.5.0",
    "postcss": "^8.4.18",
    "tailwindcss": "^3.2.1"
```

***Server Side***

```javascript
    "axios": "^1.3.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-list-endpoints": "^6.0.0",
    "firebase": "^9.14.0",
    "firebase-admin": "^11.2.0",
    "jsdom": "^21.1.0",
    "mongoose": "^6.7.3",
    "socket.io": "^4.5.3",
    "strava-v3": "^2.1.0"
```