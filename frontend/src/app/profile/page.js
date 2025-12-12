"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the token from COOKIES (not URL)
    const token = Cookies.get('jwt');
    const savedUserData = Cookies.get('userData');

    if (!token) {
      // If no cookie, they aren't logged in -> Send to Home
      router.push('/');
      return;
    }

    // 2. If we have user data in cookies, load it immediately
    if (savedUserData) {
      setUser(JSON.parse(savedUserData));
      setLoading(false);
    }

    // 3. (Optional) Fetch fresh data to ensure token is still valid
    const fetchFreshProfile = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from cookie
          },
        });

        if (!res.ok) throw new Error("Token invalid");
        
        const freshData = await res.json();
        setUser(freshData); // Update UI with latest data
        setLoading(false);
      } catch (error) {
        console.error("Session expired:", error);
        Cookies.remove('jwt');
        Cookies.remove('userData');
        router.push('/');
      }
    };

    fetchFreshProfile();
  }, [router]);

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">User Profile</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <label className="block text-sm font-bold text-gray-500">Username</label>
            <div className="text-lg text-gray-900">{user.username}</div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded">
            <label className="block text-sm font-bold text-gray-500">Email</label>
            <div className="text-lg text-gray-900">{user.email}</div>
          </div>

          <button 
            onClick={() => {
              Cookies.remove('jwt');
              Cookies.remove('userData');
              router.push('/');
            }}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}