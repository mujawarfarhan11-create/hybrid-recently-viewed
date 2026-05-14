"use client";
import { useState, useEffect } from "react";
import { themes } from "./theme/theme";

export default function Home() {
  const [theme, setTheme] = useState(themes.light);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("recent") || "[]");
    setRecent(items);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      setTheme(themes[savedTheme]);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? themes.dark : themes.light);
    }
  }, []);

  const handleView = async (productId: string) => {
    let items = JSON.parse(localStorage.getItem("recent") || "[]");

    items = items.filter((i: any) => i.productId !== productId);
    items.unshift({ productId, viewedAt: Date.now() });

    if (items.length > 20) items.pop();

    localStorage.setItem("recent", JSON.stringify(items));

    const res = await fetch("/api/recent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    setRecent(data);
  };

  const toggleTheme = () => {
    const newTheme = theme === themes.light ? "dark" : "light";
    setTheme(themes[newTheme]);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogin = async () => {
    alert("Login Clicked");

    let localData = JSON.parse(localStorage.getItem("recent") || "[]");

    const res = await fetch("/api/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localData }),
    });

    const data = await res.json();

    setRecent(data);
    localStorage.setItem("recent", JSON.stringify(data));
  };

  const products = [
    { id: "p1", name: "Nike Shoes" },
    { id: "p2", name: "T-Shirt" },
    { id: "p3", name: "Watch" },
  ];

  return (
    
    <div style={{ padding: "20px", background: theme.background, minHeight: "100vh", color: theme.text }}>
      <button
        onClick={toggleTheme}
        style={{
          marginBottom: "15px",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        Toggle Theme
      </button>
      <h1>Products</h1>
      <div style={{ display: "flex", gap: "15px" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #1e293b",
              padding: "15px",
              borderRadius: "12px",
              width: "140px",
              textAlign: "center",
              background: theme.card,
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
            }}
          >
            <h3>{p.name}</h3>

            <button
              onClick={() => handleView(p.id)}
              style={{
                marginTop: "10px",
                padding: "8px",
                background: "linear-gradient(45deg, #3b82f6, #06b6d4)",
                border: "none",
                cursor: "pointer",
                color: "white",
                borderRadius: "5px",
              }}
            >
              View
            </button>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: "30px" }}>Recently Viewed</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        {recent.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #334155",
              background: theme.card,
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {item.productId}
          </div>
        ))}
      </div>

      {/* LOGIN BUTTON */}
      <button
        onClick={handleLogin}
        style={{
          marginTop: "20px",
          padding: "10px",
          background: theme.button,
          color: theme.text,
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
        }}
      >
        Login (Merge Data)
      </button>
    </div>
  );
}