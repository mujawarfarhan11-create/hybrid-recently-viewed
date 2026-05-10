import { NextResponse } from "next/server";

let serverData = [];

export async function POST(req) {
  const { productId } = await req.json();

  serverData = serverData.filter(i => i.productId !== productId);

  serverData.unshift({
    productId,
    viewedAt: Date.now(),
  });

  if (serverData.length > 20) serverData.pop();

  return NextResponse.json(serverData);
}