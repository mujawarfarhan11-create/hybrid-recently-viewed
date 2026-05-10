import { NextResponse } from "next/server";

let serverData = [
  { productId: "p2", viewedAt: 1000 },
  { productId: "p3", viewedAt: 2000 },
]; // dummy server data

export async function POST(req) {
  const { localData } = await req.json();

  let combined = [...serverData, ...localData];

  let map = new Map();

  combined.forEach(item => {
    if (
      !map.has(item.productId) ||
      map.get(item.productId).viewedAt < item.viewedAt
    ) {
      map.set(item.productId, item);
    }
  });

  let result = Array.from(map.values());

  // latest first
  result.sort((a, b) => b.viewedAt - a.viewedAt);

  // max 20
  result = result.slice(0, 20);

  serverData = result; // update server

  return NextResponse.json(result);
}