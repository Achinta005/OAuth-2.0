"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const searchParams=useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl); // store for later
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/userInfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  return (
    <div>
      {user ? <h2>Welcome {user.name}!</h2> : <p>Loading user info...</p>}
    </div>
  );
}
