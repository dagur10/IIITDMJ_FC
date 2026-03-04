"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState(null);

  // This runs immediately after the page loads to check for a logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Clear the storage to "log out"
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // Refresh the page to reset the app state
  };

  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <div className="font-bold">IIITDMJ FC</div>
      
      <div>
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="text-green-700">Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in with Google
          </Link>
        )}
      </div>
    </nav>
  );
}