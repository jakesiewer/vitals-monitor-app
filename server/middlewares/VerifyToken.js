// VerifyToken.js

import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  console.log(req.headers.authorization.split(" ")[1])
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      console.log(req.user)
      return next();
    }
  } catch (e) {
    return res.json({ message: "Internal Error" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;

  try {
    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;
      console.log(socket.user)
      return next();
    }
  } catch (e) {
    return next(new Error("Internal Error"));
  }
};