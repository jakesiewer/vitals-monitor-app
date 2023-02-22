import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  activities: [String],
  comments: [String],
  journal: [String],
  mood: [String],
  negative: [String],
  positive: [String],
  timestamp: Number,
});

const userSchema = new mongoose.Schema({
  journals: {
    type: Map,
    of: journalEntrySchema,
  },
});

const User = mongoose.model('User', userSchema);

export default User;