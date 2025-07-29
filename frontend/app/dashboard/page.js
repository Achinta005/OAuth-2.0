"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/userInfo`,{credentials:'include'})
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
