"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check Local Storage for the 'user' key we saved during login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // 1. Remove Auth Token and User Data from Local Storage
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    
    // 2. Clear State
    setUser(null);
    
    // 3. Redirect to Home
    router.push('/');
    router.refresh(); // Forces a reload to update UI state
  };

  return (
    <nav className="bg-white text-gray-800 p-4 shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-gray-900">
          IIITDMJ <span className="text-green-600">FC</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          <Link href="/matches" className="text-gray-600 hover:text-green-600 transition">Matches</Link>
          <Link href="/futsal" className="text-gray-600 hover:text-green-600 transition">Futsal</Link>
          <Link href="/gallery" className="text-gray-600 hover:text-green-600 transition">Gallery</Link>
          <Link href="/members" className="text-gray-600 hover:text-green-600 transition">Members</Link>
          <Link href="/about" className="text-gray-600 hover:text-green-600 transition">About</Link>
          
          {/* Admin Link - Conditional Rendering */}
          {user && (user.clubRole === 'Coordinator' || user.clubRole === 'Co_Coordinator') && (
            <Link 
              href="/admin" 
              className="text-green-700 hover:text-green-800 font-bold transition border border-green-300 px-3 py-1 rounded-full hover:bg-green-50"
            >
              Admin Panel
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full hover:bg-green-100 transition border border-green-100">
                <span className="text-green-800 font-bold">{user.username}</span>
                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right border border-gray-100">
                <Link href="/profile" className="block px-4 py-3 hover:bg-green-50 hover:text-green-700 rounded-t-lg border-b border-gray-100 transition">
                  Edit Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-b-lg font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              // Pointing to Strapi Google Auth
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/connect/google`}
              className="bg-green-600 text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}