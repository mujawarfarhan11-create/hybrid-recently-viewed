import { NextResponse } from "next/server";
import mongoose from "mongoose";
import History from "@/app/lib/history";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect("mongodb://127.0.0.1:27017/shop");
};

export async function POST(req) {
  await connectDB();

  const { productId } = await req.json();

  let history = await History.findOne({ userId: "user1" });

  if (!history) {
    history = await History.create({ userId: "user1", viewed: [] });
  }

  history.viewed = [
    productId,
    ...history.viewed.filter((id) => id !== productId),
  ].slice(0, 50);

  await history.save();

  return NextResponse.json({ success: true });
}