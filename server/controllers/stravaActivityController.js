import request from 'request';

export const getActivities = (req, res) => {
  // Bearer with access token
  const access_token = req.headers.authorization;

  const options = {
    url: 'https://www.strava.com/api/v3/athlete/activities',
    headers: {
      'Authorization': access_token
    },
    json: true
  };

  console.log(options);

  request.get(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.json(body);
    } else {
      res.status(response.statusCode).send(error);
    }
  });
};

export const getActivityStream = (req, res) => {
    const accessToken = req.headers.authorization;
    const activity_id = req.headers.activity_id;
    const start_date = req.headers.start_date;

    const keys = "heartrate,time,latlng"
    const key_by_type = true;
  
    const options = {
      url: `https://www.strava.com/api/v3/activities/${activity_id}/streams`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,

      },
      qs: {
        "keys": keys,
        "key_by_type": key_by_type
      },
      json: true
    };
  
    // console.log(convertElapsedTimeToTime(elapsedTimeJson, start_date))
    console.log(options);
  
    request.get(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let formattedTimes = convertElapsedTimeToTime(body.time, start_date);
        body.time = formattedTimes;
        // console.log(formattedTimes)
        let formattedData = formatRechartJSON(body);

        res.json(formattedData);
      } else {
        res.status(response.statusCode).send(error);
      }
    });
  };

  function formatRechartJSON (data) {
    // console.log(data.heartrate.data.length);
    var formattedData = [];
    // console.log(data.time);

    for(let i = 0; i < data.heartrate.data.length; i++)
    {
        let entry = {name: data.time[i], Lat: data.latlng.data[i][0], Lng: data.latlng.data[i][1], HR: data.heartrate.data[i], amt: 160};
        formattedData.push(entry)
    }

    return formattedData;
  }

  function convertElapsedTimeToTime(elapsedTime, startTime) {
    console.log(startTime);
    const startDate = Date.parse(startTime);
    const timeInMilliseconds = elapsedTime.data.map(time => startDate + (time * 1000));
    const timeStrings = timeInMilliseconds.map(time => new Date(time).toLocaleTimeString());
    return timeStrings;
  }
  
  // Example usage
//   const elapsedTimeJson = {"time":[161,166,171,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,196,201,206,211,216,221,226,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,256,261,266,271,276,281,286,291,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309]};
//   const startTime = "2022-11-08T08:55:58Z";
  
//   const timeStrings = convertElapsedTimeToTime(elapsedTimeJson, startTime);