import { NextResponse } from "next/server";

export async function GET() {
  // same dummy data (50 records)
  let data = Array.from({ length: 50 }, (_, i) => ({
    amount: 100 + i * 10,
    status: i % 2 === 0 ? "Success" : "Failed",
    mode: i % 2 === 0 ? "UPI" : "Card",
    date: new Date(Date.now() - i * 10000000).toISOString(),
  }));

  let csv = "Amount,Status,Mode,Date\n";

  data.forEach((t) => {
    csv += `${t.amount},${t.status},${t.mode},${t.date}\n`;
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=transactions.csv",
    },
  });
}