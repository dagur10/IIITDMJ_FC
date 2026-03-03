"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { fetchAPI } from '../../lib/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Used to highlight the active tab
  const [authorized, setAuthorized] = useState(false);

  // 1. Centralized Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('jwt');
      if (!token) { router.push('/'); return; }
      try {
        const user = await fetchAPI('/api/users/me', token);
        if (!['Coordinator', 'Co_Coordinator'].includes(user.clubRole)) {
          alert("Access Denied");
          router.push('/');
          return;
        }
        setAuthorized(true);
      } catch (err) { router.push('/'); }
    };
    checkAuth();
  }, [router]);

  if (!authorized) return <div className="text-center py-20 font-bold">Verifying Permissions...</div>;

  // 2. Navigation Tabs Array (Add the Members tab here!)
  const tabs = [
    { name: 'Matches', path: '/admin/matches' },
    { name: 'Futsal Teams', path: '/admin/futsal' },
    { name: 'Gallery Albums', path: '/admin/gallery' },
    { name: 'Manage Members', path: '/admin/members' }, // <-- NEW
    { name: 'Edit About Page', path: '/admin/about' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b pb-4">Coordinator Dashboard</h1>
      
      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.path);
          return (
            <Link 
              key={tab.path} 
              href={tab.path} 
              className={`px-6 py-2 rounded-full font-bold transition ${
                isActive ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Render the specific page content (matches, futsal, etc.) */}
      <div>{children}</div>
    </div>
  );
}