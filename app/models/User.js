import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: String,
  recentlyViewed: [
    {
      productId: String,
      viewedAt: Date
    }
  ]
});

export default mongoose.models.User || mongoose.model("User", userSchema);