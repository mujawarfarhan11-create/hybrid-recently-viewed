import { NextResponse } from "next/server";

let processed = new Set();

export async function POST(req) {
  const body = await req.json();

  const id = body.transactionId;

  // ❗ duplicate check
  if (processed.has(id)) {
    return NextResponse.json({ message: "Duplicate ignored" });
  }

  processed.add(id);

  // simulate saving transaction
  console.log("Saved transaction:", id);

  return NextResponse.json({ message: "Transaction stored" });
}