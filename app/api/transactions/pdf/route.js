import { NextResponse } from "next/server";

export async function GET() {
    const invoiceId = "INV-" + Date.now();

    const content = `
    Transaction Receipt

    Invoice ID: ${invoiceId}
    Amount: ₹500
    Status: Success
    Mode: UPI
    Date: ${new Date().toLocaleString()}
    `;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${invoiceId}.pdf`,
        },
    });
}