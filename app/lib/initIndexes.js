import mongoose from "mongoose";

export const initIndexes = async () => {
  const db = mongoose.connection;

  await db.collection("products").createIndex({ category: 1 });
  await db.collection("products").createIndex({ views: -1 });
  await db.collection("histories").createIndex({ userId: 1 });
  await db.collection("wishlists").createIndex({ userId: 1 });

  console.log("Indexes created ");
};