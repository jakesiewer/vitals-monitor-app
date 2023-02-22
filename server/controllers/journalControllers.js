import User from "../models/JournalEntry.js";
import admin from 'firebase-admin';

// export const insertJournal = async (req, res) => {
//     const newJournal = new JournalEntry(req.body);

//     try {
//         await newJournal.save();
//         res.status(201).json(newJournal);
//     } catch (error) {
//         res.status(409).json({
//             message: error.message,
//         });
//     }
// };

export const insertJournal = async (req, res) => {
    const data = req.body;
    console.log(data);
    const dbRef = admin.database().ref('data');
    dbRef.push(data)
      .then(() => {
        res.send('Data inserted successfully!');
      })
      .catch((error) => {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
      });
};

export const getJournal = async (req, res) => {
    try {
        const journal = await JournalEntry.find({
            journalId: req.params.journalId,
        });
        res.status(200).json(journal);
    } catch (error) {
        res.status(409).json({
            message: error.message,
        });
    }
};