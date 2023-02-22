import React from 'react';
import axios from 'axios';

export default function StravaAuth() {

  const Authenticate = async () => {
    // const config = {
    //   headers:{
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json',
    //     'Access-Control-Allow-Origin': 'http://localhost:3000',
    //     'Access-Control-Allow-Credentials': 'true'
    //   }
    // };

    // try {
    //   const response = await axios.get('http://localhost:3001/api/login', config)
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error)
    // }
  }

  return (
    // <button><a href="http://localhost:3001/api/login">Login with Strava</a></button>
  //   <button
  //     type="submit"
  //     className="h-10 px-5 text-indigo-100 bg-indigo-700 rounded-lg transition-colors duration-150 focus:shadow-outline hover:bg-indigo-800"
  //     onClick={Authenticate}
  //   >
  //     Login with Strava
  //   </button>
  // );
  <a href="http://localhost:3001/api/login">Login with Strava</a>
  );
}