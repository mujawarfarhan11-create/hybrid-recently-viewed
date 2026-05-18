import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Cart from "../../lib/Cart";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect("mongodb://127.0.0.1:27017/cartDB");
};

const products = [
  { id: "p1", name: "Shoes", price: 1000, stock: 5 },
  { id: "p2", name: "T-Shirt", price: 500, stock: 5 },
];

export async function GET() {
  await connectDB();

  let cart = await Cart.findOne({ userId: "user1" });

  if (!cart) {
    cart = await Cart.create({
      userId: "user1",
      items: [],
      version: 0,
    });
  }

  const total = cart.items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return NextResponse.json({
    items: cart.items,
    version: cart.version,
    total,
  });
}

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  let cart = await Cart.findOne({ userId: "user1" });

  if (!cart) {
    cart = await Cart.create({
      userId: "user1",
      items: [],
      version: 0,
    });
  }

  if (body.version !== cart.version) {
    return NextResponse.json({ error: "Cart outdated, refresh" });
  }

  const product = products.find((p) => p.id === body.id);

  if (!product) {
    return NextResponse.json({ error: "Product discontinued" });
  }

  const existing = cart.items.find((i) => i.id === product.id);

  if (existing) {
    if (existing.qty >= product.stock) {
      return NextResponse.json({ error: "Max stock reached" });
    }
    existing.qty += 1;
  } else {
    if (product.stock <= 0) {
      return NextResponse.json({ error: "Out of stock" });
    }

    cart.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }

  cart.items = cart.items.map((item) => {
    const latest = products.find((p) => p.id === item.id);

    if (!latest) {
      return { ...item, discontinued: true };
    }

    return {
      ...item,
      priceChanged: item.price !== latest.price,
      price: latest.price,
    };
  });

  cart.version += 1;
  await cart.save();

  const total = cart.items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return NextResponse.json({
    items: cart.items,
    version: cart.version,
    total,
  });
}