import axios from 'axios';
import qs from 'qs';
import dotenv from "dotenv";

dotenv.config();

const client_id = process.env.FITBIT_CLIENT_ID;
const client_secret = process.env.FITBIT_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3001/api/fitbit-callback';
const frontendUri = 'http://localhost:3000/home';

export const fitbitLogin = (req, res) => {
  const scope = 'activity heartrate location profile';
  const state = frontendUri;
  res.redirect('https://www.fitbit.com/oauth2/authorize?' +
    qs.stringify({
      client_id: client_id,
      redirect_uri: redirect_uri,
      response_type: 'code',
      scope: scope,
      state: state
    }));
};

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