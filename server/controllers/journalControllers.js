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
  const uid = req.headers.uid;
  console.log(uid)
  // const newJournalRef = push(ref("data", `${uid}/journals`));
  console.log(data);
  const dbRef = admin.database().ref(`${uid}/journals`);
  dbRef.push(data)
    .then(() => {
      res.send('Data inserted successfully!');
    })
    .catch((error) => {
      console.error('Error inserting data:', error);
      res.status(500).send('Error inserting data');
    });
};

export const getJournalId = async (req, res) => {
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

export const getJournalTimestamp = async (req, res) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  };
}

export const getNearestJournal = async (req, res) => {
  const db = admin.database();
  const dataId = req.query.uid;
  const timestamp = req.query.timestamp;
  const date = dateToDateObj(timestamp);
  const dataRef = db.ref('journals');

  try {
    const snapshot = await dataRef.child(dataId).once('value');
    const message = snapshot.val();
    const userId = snapshot.key;

    if (!message) {
      console.log("Not Found")
      return res.status(404).json({ error: 'Message not found' });
    }
    else if (date == 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid Date' });
    }
    else if (userId !== req.query.uid) {
      console.log("Unauthorized");
      return res.status(403).json({ error: 'Unauthorized' });
    }
    else {
      const unixTimestamp = date.getTime();
      const dbRef = db.ref(`journals/${userId}`);
      // const timestampToFind = 1677006100606;
      const query = dbRef.orderByChild('timestamp').startAt(unixTimestamp).limitToFirst(1);

      query.once('value')
        .then(snapshot => {
          let closestEntry = snapshot.val();
          const key = Object.keys(closestEntry); // extract the key of the first object
          closestEntry = formatJournal(closestEntry[key]);

          res.json(closestEntry);
        })
        .catch(error => {
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function dateToDateObj(timestamp) {
  console.log(timestamp);
  const parts = timestamp.split(/[\/,: ]/); // split string into date and time components
  const [datePart, timePart] = timestamp.split(", ");
  const [day, month, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  const dateObj = new Date(year, month - 1, day, hour, minute, second); // months are zero indexed

  console.log(dateObj)
  return dateObj;
}

function unixDateToDate(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function formatJournal(journal) {
  journal.activities = journal.activities.join(', ');
  journal.negative = journal.negative.join(', ');
  journal.positive = journal.positive.join(', ');
  journal.timestamp = unixDateToDate(journal.timestamp);

  return journal;
}

export const getAllJournals = async (req, res) => {
  const db = admin.database();
  const dataId = req.query.uid;
  const timestamp = req.query.timestamp;
  const date = dateToDateObj(timestamp);
  const dataRef = db.ref('journals');

  try {
    const snapshot = await dataRef.child(dataId).once('value');
    const message = snapshot.val();
    const userId = snapshot.key;

    if (!message) {
      console.log("Not Found");
      return res.status(404).json({ error: 'Message not found' });
    } else if (date == 'Invalid Date') {
      return res.status(400).json({ error: 'Invalid Date' });
    } else if (userId !== req.query.uid) {
      console.log("Unauthorized");
      return res.status(403).json({ error: 'Unauthorized' });
    } else {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const startTimestamp = startDate.getTime();
      const endTimestamp = endDate.getTime();

      const dbRef = db.ref(`journals/${userId}`);
      const query = dbRef.orderByChild('timestamp').startAt(startTimestamp).endAt(endTimestamp);

      query.once('value')
        .then(snapshot => {
          const entries = snapshot.val();
          const formattedEntries = [];
          // console.log(entries)

          // entries.forEach(entry => {
          Object.keys(entries).forEach(key => {
            // console.log(entries[key]);
            let entry = formatJournal(entries[key]);
            formattedEntries.push(entry);
          });
          // });


          res.json(formattedEntries);
        })
        .catch(error => {
          console.error(error);
        });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}