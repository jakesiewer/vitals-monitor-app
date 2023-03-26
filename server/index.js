// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import stravaAuthRoutes from "./routes/stravaAuthRoutes.js";
import stravaActivityRoutes from "./routes/stravaActivityRoutes.js";
import fitbitActivityRoutes from "./routes/fitbitActivityRoutes.js";
import fitbitAuthRoutes from "./routes/fitbitAuthRoutes.js";

import insertJournalRoute from './routes/journalRoutes.js'

const app = express();

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// const stravaRoutes = require("./routes/stravaRoutes");
const axios = require("axios");
const strava = require('strava-v3');

dotenv.config();

const corsOptions = {
  // Access-Control-Allow-Headers: true,
  origin: 'http://localhost:3000',
  // methods: ['GET', 'PUT', 'POST'],
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", VerifyToken);

const PORT = process.env.PORT || 8080;

// // app.use("/api/journal", chatRoomRoutes);



const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// io.use(VerifySocketToken);

// global.onlineUsers = new Map();

// const getKey = (map, val) => {
//   for (let [key, value] of map.entries()) {
//     if (value === val) return key;
//   }
// };

// io.on("connection", (socket) => {
//   global.chatSocket = socket;

//   socket.on("addUser", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     socket.emit("getUsers", Array.from(onlineUsers));
//   });

//   socket.on("sendMessage", ({ senderId, receiverId, message }) => {
//     const sendUserSocket = onlineUsers.get(receiverId);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("getMessage", {
//         senderId,
//         message,
//       });
//     }
//   });

//   socket.on("disconnect", () => {
//     onlineUsers.delete(getKey(onlineUsers, socket.id));
//     socket.emit("getUsers", Array.from(onlineUsers));
//   });
// });

// app.use(VerifyToken);

// server.use(VerifyToken);

// io.use(VerifySocketToken);

app.get("/", (req, res) => {
  res.send("working fine");
});

app.use(cookieParser());
app.use("/api", stravaAuthRoutes);
// app.options('/api', cors(corsOptions))
app.use("/api", stravaActivityRoutes);

app.use("/api", fitbitAuthRoutes);
app.use("/api", fitbitActivityRoutes);

app.use("/journal", insertJournalRoute);


// import admin from "firebase-admin";
// app.get('/test', async (req, res) => {
//   const db = admin.database();
//   const dataId = req.query.uid;

//   const dataRef = db.ref('journals');
//   // const dataId = "-NOpIA_15iTG_co6W3-3";

//   try {
//     const snapshot = await dataRef.child(dataId).once('value');
//     const message = snapshot.val();

//     if (!message) {
//       console.log("Not Found")
//       return res.status(404).json({ error: 'Message not found' });
//     }

//     const userId = message;
//     // const userId = "nxeSe83GCLaBSqK0XkE7c0CjLCx1";

//     console.log(userId);
//     console.log(req.query.uid);


//     if (userId !== req.query.uid) {
//       // if (userId !== userId) {
//       console.log("Unauthorized");
//       return res.status(403).json({ error: 'Unauthorized' });
//     }

//     res.json(message);
//   } catch (error) {
//     console.error(error);
//     console.log(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// import listEndpoints from "express-list-endpoints";
// console.log(listEndpoints(app))

// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });