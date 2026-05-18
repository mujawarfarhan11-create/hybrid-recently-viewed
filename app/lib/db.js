import mongoose from "mongoose";
import { initIndexes } from "./initIndexes";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect("mongodb://127.0.0.1:27017/shop");

  await initIndexes(); 
};