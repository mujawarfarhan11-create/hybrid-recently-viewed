"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        console.log("DATA:", data);
        setCart(data.items || []);
        setTotal(data.total || 0);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cart Page</h1>

      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((i) => (
        <div key={i.id}>
          {i.name} - ₹{i.price} - Qty: {i.qty}
        </div>
      ))}

      <h2>Total: ₹{total}</h2>
    </div>
  );
}