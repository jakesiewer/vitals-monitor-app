//firebase-config.js

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// import { serviceAccountKey } from './serviceAccountKey.json' assert { type: 'json' };

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccountKey = require('./serviceAccountKey.json');

const app = initializeApp({
  credential: cert(serviceAccountKey),
});

const auth = getAuth(app);
export default auth;