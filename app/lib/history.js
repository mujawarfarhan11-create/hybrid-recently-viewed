import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  userId: String,
  viewed: [String],
  updatedAt: {
    type: Date,
    default: Date.now,
    expires: 86400, 
  },
});

export default mongoose.models.History || mongoose.model("History", HistorySchema);