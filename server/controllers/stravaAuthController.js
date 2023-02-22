import request from 'request';
import axios from 'axios';
import qs from 'qs';
import dotenv from "dotenv";

dotenv.config();

const client_id = process.env.STRAVA_CLIENT_ID;
const client_secret = process.env.STRAVA_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3001/api/callback';
const frontendUri = 'http://localhost:3000/home';

export const login = (req, res) => {
  const scope = 'read,activity:read';
  const state = frontendUri;
  res.redirect('https://www.strava.com/oauth/authorize?' +
    qs.stringify({
      client_id: client_id,
      redirect_uri: redirect_uri,
      response_type: 'code',
      scope: scope,
      state: state
    }));
  // console.log(res)
};

// export const callback = async (req, res) => {
//   try {
//     // Exchange the authorization code for an access token
//     const { code, state } = req.query;
//     const params = {
//       client_id: client_id,
//       client_secret: client_secret,
//       code,
//       grant_type: 'authorization_code',
//       redirect_uri: "http://localhost:3000/home",
//     };
//     const { data } = await axios.post('https://www.strava.com/oauth/token', qs.stringify(params));
//     const { access_token } = data;

//     console.log(access_token);
//     res.cookie('access_token', access_token);
//     // Use the access token to make API requests on behalf of the user
//     // ...
//     // res.send('Successfully authenticated!');
//     // Redirect the user back to the frontend URL using the state parameter
//     res.redirect(state);
//   } catch (err) {
//     console.error(err);
//     res.send('Failed to authenticate.');
//   }
// };

export const callback = async (req, res) => {
    const { code } = req.query;
    // console.log(req.query);
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: client_id,
      client_secret: client_secret,
      code,
      grant_type: 'authorization_code',
    });
    const accessToken = response.data.access_token;
    console.log(accessToken);
    res.redirect(`http://localhost:3000/home?access_token=${accessToken}`);
};