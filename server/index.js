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
  origin:'http://localhost:3000', 
  // methods: ['GET', 'PUT', 'POST'],
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

// // app.use("/api/journal", chatRoomRoutes);



const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.use(VerifySocketToken);

global.onlineUsers = new Map();

const getKey = (map, val) => {
  for (let [key, value] of map.entries()) {
    if (value === val) return key;
  }
};

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit("getUsers", Array.from(onlineUsers));
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const sendUserSocket = onlineUsers.get(receiverId);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("getMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(getKey(onlineUsers, socket.id));
    socket.emit("getUsers", Array.from(onlineUsers));
  });
});

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

// import listEndpoints from "express-list-endpoints";
// console.log(listEndpoints(app))

// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });