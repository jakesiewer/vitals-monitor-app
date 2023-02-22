// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase  } from "firebase/database"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// gives us an auth instance
const auth = getAuth(app);

export const getDB = () => {

  return getDatabase(app);
}

// const newUserName = "user1122"
// const userRef = ref(db, `users/${newUserName}`)
 
// InsertData();

// function InsertData() {
//   set(userRef, {name: newUserName, age: 11})
// }

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

// in order to use this auth instance elsewhere
export default auth;