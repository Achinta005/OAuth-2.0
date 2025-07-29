'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import

export default function Page() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen bg-gradient-to-l from-green-600 to-gray-300">
      <p className="absolute top-20 font-extrabold text-3xl text-purple-700">
        Implementation of OAuth 2.0
      </p>

      {isAuthenticated ? (
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:scale-105 transition"
        >
          Go to Dashboard
        </button>
      ) : (
        <button
          className="flex items-center gap-2 border border-gray-800 p-3 rounded-lg bg-gradient-to-r from-yellow-400 to-red-600 transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer"
          onClick={handleLogin}
        >
          <Image
            src="/icons8-google-144.png"
            alt="Google logo"
            width={30}
            height={30}
            priority
          />
          Sign in with Google
        </button>
      )}
    </div>
  );
}
