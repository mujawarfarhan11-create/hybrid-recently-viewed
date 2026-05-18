import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "desc";

    // Dummy data (baad me DB se aayega)
    let data = Array.from({ length: 50 }, (_, i) => ({
        amount: 100 + i * 10,
        status: i % 2 === 0 ? "Success" : "Failed",
        mode: i % 2 === 0 ? "UPI" : "Card",
        date: new Date(Date.now() - i * 10000000).toISOString(),
    }));

    if (status) {
        data = data.filter((t) => t.status === status);
    }

    // ↕ Sort
    data.sort((a, b) =>
        sort === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
    );

    const start = (page - 1) * limit;
    const paginated = data.slice(start, start + limit);
    return NextResponse.json({
        data: paginated,
        total: data.length,
    });
}
