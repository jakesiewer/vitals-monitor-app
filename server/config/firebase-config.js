//firebase-config.js

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
// import { getDatabase, ref, set, child, update, remove } from "firebase/database"

// import { serviceAccountKey } from './serviceAccountKey.json' assert { type: 'json' };

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccountKey = require('./serviceAccountKey.json');

// var admin = require("firebase-admin");

const app = initializeApp({
  credential: cert(serviceAccountKey),
  databaseURL: 'https://finalyearproject-f8768-default-rtdb.europe-west1.firebasedatabase.app',
});

const auth = getAuth(app);

// const db = getDatabase(app);

// InsertData();

// function InsertData() {
//   set(ref(db, "Person/Student"), {
//     FirstName: "Jake",
//     LastName: "Siewer"
//   })
//   .then(() => {
//     alert("Insert Successful");
//   })
//   .catch((error) => {
//     alert("Unsuccessful, error " + error);
//   });
// }

export default auth;