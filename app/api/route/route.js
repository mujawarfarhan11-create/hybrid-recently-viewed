import { NextResponse } from "next/server";

export async function POST(req) {

  const { userId, localData } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  let user = await User.findOne({ userId });

  if (!user) {
    user = new User({ userId, recentlyViewed: [] });
  }

  let serverData = user.recentlyViewed.map(item => ({
    productId: item.productId,
    viewedAt: item.viewedAt.getTime()
  }));

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

  result.sort((a, b) => b.viewedAt - a.viewedAt);

  result = result.slice(0, 20);

  // Update DB
  user.recentlyViewed = result.map(item => ({
    productId: item.productId,
    viewedAt: new Date(item.viewedAt)
  }));

  await user.save();

  return NextResponse.json(result);
}