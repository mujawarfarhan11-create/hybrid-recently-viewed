import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/lib/product";
import History from "@/app/lib/history";
import Wishlist from "@/app/lib/wishlist";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect("mongodb://127.0.0.1:27017/shop");
};

export async function GET() {
  await connectDB();
  await initIndexes();

  const userId = "user1";

  const history = await History.findOne({ userId });
  const wishlist = await Wishlist.findOne({ userId });

  const viewedIds = history?.viewed || [];
  const wishlistIds = wishlist?.items || [];

  const viewedProducts = await Product.find({
    id: { $in: viewedIds },
  });

  const categories = [...new Set(viewedProducts.map((p) => p.category))];

  let recommended = await Product.find({
    category: { $in: categories },
    id: { $nin: viewedIds },
  }).limit(10);

  const wishlistProducts = await Product.find({
    id: { $in: wishlistIds },
  });

  recommended = [...wishlistProducts, ...recommended];

  if (recommended.length === 0) {
    recommended = await Product.find()
      .sort({ views: -1 })
      .limit(10);
  }

  return NextResponse.json(recommended);
}