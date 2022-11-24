// index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

// app.use("/api/journal", chatRoomRoutes);

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



// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });