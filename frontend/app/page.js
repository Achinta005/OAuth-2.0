/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React from "react";
import Image from "next/image";
import Router, { useRouter } from "next/navigation";

const page = () => {
  const router=useRouter();
  
  const handleLogin=async()=>{
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth_check`,{
      credentials:'include'
    });
    const data=await res.json();
    if(data.isAuthenticated){
      //User is already logged in
      router.push(`/dashboard`);
    }
    else{
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    }
  };

const handleLogout = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // sends the cookie
    });

    const data = await res.json();

    if (data.success) {
      console.log('Logged out successfully');
    } else {
      console.error('Logout failed:', data.message);
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-l from-green-600 to-gray-300">
      <p className="absolute top-20 font-extrabold text-3xl text-purple-700">Implementaion of OAuth 2.0</p>
      <button className="flex border border-b-gray-950 p-3 rounded-lg bg bg-gradient-to-r from-yellow-400 to-red-600 transition-transform  duration-300 ease-in-out hover:scale-110 cursor-pointer" onClick={handleLogin}>
        <Image
          src="/icons8-google-144.png"
          alt="Next.js logo"
          width={30}
          height={38}
          priority
        />
        Login With Google
      </button>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default page;
