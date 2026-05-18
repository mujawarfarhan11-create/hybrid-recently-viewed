import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  id: String,
  name: String,
  category: String,
  price: Number,
  views: { type: Number, default: 0 },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);