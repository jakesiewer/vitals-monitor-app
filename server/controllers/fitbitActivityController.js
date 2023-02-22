import request from 'request';
// import Tcx from 'tcx-js';
import jsdom from 'jsdom';
const { JSDOM } = jsdom
export const getFitbitActivities = (req, res) => {
    // Bearer with access token
    const access_token = req.headers.authorization;
    //   const beforeDate = '2023-02-20';
    const afterDate = '2023-02-21';

    const options = {
        url: `https://api.fitbit.com/1/user/-/activities/list.json?afterDate=${afterDate}&sort=asc&offset=0&limit=10`,
        // url: 'https://api.fitbit.com/1/user/-/activities/list.json',
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
        },
        // params: {
        //     beforeDate: '2023-02-20',
        //     afterDate: '2023-02-18',
        //     sort: 'asc',
        //     limit: 2
        // },
        json: true
    };

    console.log(options);

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(body.activities);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
};

export const getFibitActivityStream = (req, res) => {
    console.log(req.headers);
    const accessToken = req.headers.authorization;
    const tcxLink = req.headers.tcxlink;
    // const start_date = req.headers.start_date;

    // const keys = "heartrate,time,latlng"
    // const key_by_type = true;

    const options = {
        url: tcxLink,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.garmin.tcx+xml'
        },
        //   qs: {
        //     "keys": keys,
        //     "key_by_type": key_by_type
        //   },
        //   json: true
    };

    // console.log(convertElapsedTimeToTime(elapsedTimeJson, start_date))
    console.log(options);

    request.get(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {

            const formattedData = tcxToJSON(response.body);

            res.json(formattedData);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
};

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
            const time = datetime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            const latitude = trackpoint.getElementsByTagName("LatitudeDegrees")[0].textContent;
            const longitude = trackpoint.getElementsByTagName("LongitudeDegrees")[0].textContent;
            // const latitude = (Math.round(trackpoint.getElementsByTagName("LatitudeDegrees")[0].textContent * 100) / 100).toFixed(4);
            // const longitude = (Math.round(trackpoint.getElementsByTagName("LongitudeDegrees")[0].textContent * 100) / 100).toFixed(4);
            const heartrate = trackpoint.getElementsByTagName("HeartRateBpm")[0].getElementsByTagName("Value")[0].textContent;
            // const altitude = trackpoint.getElementsByTagName("AltitudeMeters")[0].textContent;

            const entry = { name: time, Lat: latitude, Lng: longitude, HR: heartrate, amt: 160 };

            formattedData.push(entry);
        }
    });

    return formattedData;
}