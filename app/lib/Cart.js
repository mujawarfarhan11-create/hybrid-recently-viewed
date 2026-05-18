import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  savedItems: {
    type: Array,
    default: [],
  },
  version: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);