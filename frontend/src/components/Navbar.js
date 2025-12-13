"use client";
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for user data on load
    const userData = Cookies.get('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // 1. Remove Auth Token and User Data
    Cookies.remove('jwt');
    Cookies.remove('userData');
    
    // 2. Clear State
    setUser(null);
    
    // 3. Redirect to Home
    router.push('/');
    router.refresh(); // Forces a reload to update UI state
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          INSTITUTE <span className="text-yellow-400">FC</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          <Link href="/matches" className="hover:text-yellow-400 transition">Matches</Link>
          <Link href="/futsal" className="hover:text-yellow-400 transition">Futsal</Link>
          <Link href="/gallery" className="hover:text-yellow-400 transition">Gallery</Link>
          <Link href="/members" className="hover:text-yellow-400 transition">Members</Link>
          <Link href="/about" className="hover:text-yellow-400 transition">About</Link>
          {/* NEW: Admin Link - Conditional Rendering */}
          {user && (user.clubRole === 'Coordinator' || user.clubRole === 'Co_Coordinator') && (
            <Link 
              href="/admin" 
              className="text-red-500 hover:text-red-400 font-bold transition border border-red-500 px-3 py-1 rounded-full hover:bg-red-50"
            >
              Admin Panel
            </Link>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 bg-blue-800 px-4 py-2 rounded-full hover:bg-blue-700 transition">
                <span className="text-yellow-400 font-bold">{user.username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                <Link href="/profile" className="block px-4 py-3 hover:bg-gray-50 rounded-t-lg border-b">
                  Edit Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 rounded-b-lg font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              // Pointing to Strapi Google Auth
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/connect/google`}
              className="bg-yellow-500 text-blue-900 px-5 py-2 rounded-full font-bold hover:bg-yellow-400 shadow-lg transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}