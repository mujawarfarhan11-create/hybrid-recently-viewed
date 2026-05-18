import { NextResponse } from "next/server";

let log = [];

export async function POST(req) {
    const body = await req.json();

    const log = {
        event: body.event,
        amount: body.amount,
        time: new Date().toISOString(),
    };

    log.push(log);

    return NextResponse.json({ success: true });
}

export async function GET() {
    return NextResponse.json(log);
}
