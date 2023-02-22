import React, { useState, useEffect } from 'react';

const StravaLogin = () => {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('access_token');
        if (token) {
            setAccessToken(token);
            localStorage.setItem('strava_access_token', token);
        }
    }, []);

    function handleLogin() {
        const client_id = process.env.REACT_APP_STRAVA_CLIENT_ID;
        window.location = `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3001/api/callback&scope=read,activity:read`;
    }

    function handleLogout() {
        localStorage.removeItem('strava_access_token');
        setAccessToken('');
    }

    return (
        // <div className="flex justify-center items-center h-screen">
        // <div className="flex items-center">
        //   <div className="bg-white p-8 rounded-lg shadow-lg">
        <>
            <h2 className="mt-4 text-2xl tracking-tight font-light dark:text-white">Log in with Strava</h2>
            {accessToken ? (
                <div>
                    <p>You are logged in with Strava!</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>Log out</button>
                </div>
            ) : (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogin}>Log in with Strava</button>
            )}
            {/* </div>
    </div> */}
        </>
    );
};

export default StravaLogin;
