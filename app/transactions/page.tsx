"use client";
import { useEffect, useState } from "react";

export default function Transactions() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetch(`/api/transactions?page=${page}&status=${status}`)
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data.data); // IMPORTANT
            });
    }, [page, status]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>My Transactions</h1>

            {transactions.map((t, i) => (
                <div key={i} style={{ border: "none", 
                padding: "10px", 
                marginTop: "10px",
                color: "white",
                background: "linear-gradient(45deg, #10b981, #3b82f6)",
                borderRadius: "10px",
                lineHeight: "1.5",
                }}>

                    <p>Amount: ₹{t.amount}</p>
                    <p>Status: {t.status}</p>
                    <p>Mode: {t.mode}</p>
                    <p>Date: {t.date}</p>

                    <button onClick={() => window.open("/api/transactions/pdf")}>
                        Download Receipt
                    </button>

                    <button
                        onClick={async () => {
                            await fetch("/api/audit", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    event: "VIEWED_TRANSACTION",
                                    amount: t.amount, // ✔ ab yaha work karega
                                }),
                            });

                            alert("Logged!");
                        }}
                        style={{ marginLeft: "10px",
                            padding: "1px 1px",
                            cursor: "pointer",
                            color: "black",
                            borderRadius: "10px",
                            border: "none",
                            background: "#f59e0b",
                            lineHeight: "1.5",
                         }}
                    >
                        Log Event
                    </button>

                </div>
            ))}

            <button
                onClick={() => {
                    window.open("/api/transactions/export");
                }}
                style={{
                    marginBottom: "10px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: "white",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(45deg, #10b981, #3b82f6)",
                    lineHeight: "1.5",
                }}
            >
                Download Receipt
            </button>

            <select
                onChange={(e) => setStatus(e.target.value)}
                style={{ marginBottom: "20px", padding: "5px" }}
            >
                <option value="">All</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
            </select>

            {transactions.map((t, i) => (
                <div
                    key={i}
                    style={{
                        border: "1px solid #1e293b",
                        padding: "10px",
                        marginTop: "10px",
                        background: "#020617",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <p>Amount: ₹{t.amount}</p>
                    <p>Status: {t.status}</p>
                    <p>Mode: {t.mode}</p>
                    <p>Date: {t.date}</p>
                </div>
            ))}

            <div style={{ marginTop: "20px" }}>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>Page {page}</span>

                <button onClick={() => setPage(page + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
}