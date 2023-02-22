// import axios from "axios";
import auth from "../config/firebase";
// import { io } from "socket.io-client";
import { ref, set, push, serverTimestamp } from "firebase/database"

import { getDB } from "../config/firebase";

const baseURL = "http://localhost:3001/journal";

const getUserToken = async () => {
    const user = auth.currentUser;
    const token = user && (await user.getIdToken());
    return token;
};

// export const initiateSocketConnection = async () => {
//     const token = await getUserToken();

//     const socket = io("http://localhost:3001", {
//         auth: {
//             token,
//         },
//     });

//     return socket;
// };

// const createHeader = async () => {
//     const token = await getUserToken();

//     const payloadHeader = {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     return payloadHeader;
// };

// InsertData();

export const InsertData = async (journal) => {
    let db = await getDB();
    const newJournalRef = push(ref(db, `${auth.currentUser.uid}/journals`));
    const data = { ...journal, timestamp: serverTimestamp() };

    set(newJournalRef, data)
        .then(() => {
            console.log(newJournalRef)
            alert("Insert Successful");
        })
        .catch((error) => {
            console.log(error);
            alert("Unsuccessful, error");
        });
};

// export const InsertData = async (data) => {
//     const journal = { ...data, timestamp: serverTimestamp() };
//     const response = await fetch(`${ baseURL }/insert`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ journal })
//     });
  
//     const result = await response.text();
//     console.log(result);
//   };
  