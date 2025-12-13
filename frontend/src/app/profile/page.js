"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios'; 
import { fetchAPI, uploadImage, getStrapiMedia } from '../../lib/api';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Image State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [user, setUser] = useState({
    id: null,
    documentId: null, 
    username: '',
    email: '',
    fullName: '',
    branch: '',
    yearOfJoining: '',
    playingPosition: '',
    membershipStatus: 'None',
    clubRole: 'User',
    profilePicture: null
  });

  // 1. Fetch User Data
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) { router.push('/'); return; }

    const getUserData = async () => {
      try {
        const userData = await fetchAPI('/api/users/me?populate=profilePicture', token);
        setUser(prev => ({ ...prev, ...userData }));
        if (userData.profilePicture) {
            setPreviewUrl(getStrapiMedia(userData.profilePicture.url));
        }
      } catch (error) { console.error("Failed to fetch user:", error); } 
      finally { setLoading(false); }
    };
    getUserData();
  }, [router]);

  const handleChange = (e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- SPECIAL USER UPDATE HELPER ---
  const updateUser = async (userId, payload, token) => {
    // Strapi Users API typically expects FLAT JSON
    const url = `${STRAPI_URL}/api/users/${userId}`;
    const headers = { Authorization: `Bearer ${token}` };
    console.log(`Attempting Update to: ${url}`, payload); // Debug Log
    
    const { data } = await axios.put(url, payload, { headers });
    return data;
  };

  // 2. Main Save Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = Cookies.get('jwt');

    try {
      let imageId = user.profilePicture?.id;

      if (selectedFile) {
        const uploadedImage = await uploadImage(selectedFile, token);
        // Handle array vs object response
        const imgObj = Array.isArray(uploadedImage) ? uploadedImage[0] : uploadedImage;
        imageId = imgObj.id; 
      }

      const updateData = {
        fullName: user.fullName,
        branch: user.branch,
        yearOfJoining: user.yearOfJoining,
        playingPosition: user.playingPosition,
        profilePicture: imageId 
      };

      // Try ID first (Integer), fallback to documentId
      const targetId = user.id || user.documentId;
      const updatedUser = await updateUser(targetId, updateData, token);

      Cookies.set('userData', JSON.stringify(updatedUser), { expires: 7 });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // 3. FIX: Membership Request Logic
  const handleMembershipRequest = async () => {
    const token = Cookies.get('jwt');
    // Strapi Users Permissions plugin usually uses Integer ID
    const targetId = user.id; 

    if (confirm("Request official Club Membership?")) {
      try {
        // Step A: Send the Request
        // We assume the field is named 'membershipStatus' in Strapi
        const response = await updateUser(targetId, { membershipStatus: 'Pending' }, token);
        
        console.log("Server Response:", response); // Check Console!

        // Step B: Verify if server actually updated it
        if (response.membershipStatus === 'Pending') {
            setUser(prev => ({ ...prev, membershipStatus: 'Pending' }));
            
            // Update Cookie
            const currentCookie = Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : {};
            Cookies.set('userData', JSON.stringify({ ...currentCookie, membershipStatus: 'Pending' }), { expires: 7 });
            
            alert("Request sent successfully!");
        } else {
            alert("Server ignored the update. Check Strapi Permissions.");
        }
      } catch (error) {
        console.error("Membership Request Failed:", error);
        alert("Failed to send request.");
      }
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-blue-900">Loading Profile...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
            <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
            <p className="text-gray-500">Manage your player details</p>
        </div>
        <div className="text-right">
            <span className="text-xs uppercase text-gray-500 font-bold tracking-wider">Club Role</span>
            <div className={`text-xl font-bold ${user.clubRole === 'Coordinator' ? 'text-yellow-600' : user.clubRole === 'Member' ? 'text-blue-600' : 'text-gray-600'}`}>
                {user.clubRole || 'User'}
            </div>
        </div>
      </div>

      {/* Membership Status Card */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-blue-900">Membership Status</h2>
          <p className="text-sm text-gray-600">
            Current Status: 
            <span className={`ml-2 font-bold ${
              user.membershipStatus === 'Approved' ? 'text-green-600' : 
              user.membershipStatus === 'Pending' ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {user.membershipStatus || 'None'}
            </span>
          </p>
        </div>
        {(!user.membershipStatus || user.membershipStatus === 'None' || user.membershipStatus === 'Rejected') ? (
          <button onClick={handleMembershipRequest} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg">
            Request Membership
          </button>
        ) : (
          <button disabled className="bg-gray-200 text-gray-500 px-6 py-2 rounded-lg font-bold cursor-not-allowed">
            {user.membershipStatus === 'Pending' ? 'Waiting for Approval...' : 'Membership Active'}
          </button>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Player Information</h2>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Picture */}
            <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner bg-gray-100 relative">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                           {/* SVG Placeholder */}
                           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                    )}
                </div>
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition">
                    Change Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            {/* Inputs */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label><input type="text" value={user.username} disabled className="w-full bg-gray-100 border-transparent rounded p-2 text-gray-600" /></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label><input type="text" value={user.email} disabled className="w-full bg-gray-100 border-transparent rounded p-2 text-gray-600" /></div>

                <div className="md:col-span-2"><label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label><input required type="text" name="fullName" value={user.fullName || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Branch</label><input required type="text" name="branch" value={user.branch || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Year of Joining</label><input required type="text" name="yearOfJoining" value={user.yearOfJoining || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500" /></div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Playing Position</label>
                    <select name="playingPosition" value={user.playingPosition || ''} onChange={handleChange} className="w-full border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Select Position --</option>
                        <option value="Forward">Forward / Striker</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Defender">Defender</option>
                        <option value="Goalkeeper">Goalkeeper</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="pt-6 flex justify-end border-t mt-6">
          <button type="submit" disabled={saving} className="bg-yellow-500 text-blue-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition shadow-md">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}