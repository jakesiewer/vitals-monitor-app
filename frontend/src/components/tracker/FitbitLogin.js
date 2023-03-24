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
