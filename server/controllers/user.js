import auth from "../config/firebase-config.js";

export const getAllUsers = async (req, res) => {
//   const maxResults = 10;
//   let users = [];

//   try {
//     const userRecords = await auth.listUsers(maxResults);

//     userRecords.users.forEach((user) => {
//       const { uid, email, displayName, photoURL } = user;
//       users.push({ uid, email, displayName, photoURL });
//     });
//     res.status(200).json(users);
//   } catch (error) {
//     console.log(error);
//   }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);

    // const { uid, email, displayName, photoURL } = userRecord;
    const { uid, email } = userRecord;

    res.status(200).json({ uid, email });
  } catch (error) {
    console.log(error);
  }
};