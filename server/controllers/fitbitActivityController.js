import request from 'request';
// import Tcx from 'tcx-js';
import jsdom from 'jsdom';
const { JSDOM } = jsdom

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