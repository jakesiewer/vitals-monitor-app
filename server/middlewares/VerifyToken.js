// VerifyToken.js

import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {

  let token;
  
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.json({ message: "Authorization header not present" });
  }


  try {
    const decodeValue = await auth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      console.log(req.user);
      res.status(200).json({ message: "Authenticated" });
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Access token invalid" });  }
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