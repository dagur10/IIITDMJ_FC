"use client";
import { useState, useEffect } from 'react';
// Removed: import Cookies from 'js-cookie';
import axios from 'axios';
import { fetchAPI } from '../../../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export default function AdminMembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  
  // State for filtering the table
  const [statusFilter, setStatusFilter] = useState('All'); 

  const loadUsers = async () => {
    // CHANGED: Pull token from Local Storage
    const token = localStorage.getItem('jwt');
    try {
      const res = await fetchAPI('/api/users', token);
      setUsers(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (userId, payload) => {
    setUpdatingId(userId);
    // CHANGED: Pull token from Local Storage
    const token = localStorage.getItem('jwt');
    try {
      await axios.put(`${API_URL}/api/users/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u.id === userId ? { ...u, ...payload } : u));
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update user. Check console for details.");
    } finally {
      setUpdatingId(null);
    }
  };

  // --- HANDLERS ---
  const handleMembershipChange = (userId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;
    if (confirm(`Change this user's membership status to ${newStatus}?`)) {
        
        const payload = { membershipStatus: newStatus };
        
        // Quality of Life: Auto-assign "Member" role if approved
        if (newStatus === 'Approved') {
            payload.clubRole = 'Member';
        }
        // Quality of Life: Strip "Member" role if rejected or set to None
        if (newStatus === 'Rejected' || newStatus === 'None') {
            payload.clubRole = 'User';
        }

        updateUser(userId, payload);
    }
  };

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;
    if (confirm(`Change this user's role to ${newRole}?`)) {
      updateUser(userId, { clubRole: newRole });
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = users.filter(user => {
    if (statusFilter === 'All') return true;
    const status = user.membershipStatus || 'None';
    return status === statusFilter;
  });

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Members Database...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-900">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">User Directory</h2>
            
            <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Filter by Status:</label>
                <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-2 border-2 border-blue-100 rounded-lg font-bold text-blue-900 bg-blue-50 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="All">All Users</option>
                    <option value="Pending">Pending Requests</option>
                    <option value="Approved">Approved Members</option>
                    <option value="Rejected">Rejected</option>
                    <option value="None">No Status (None)</option>
                </select>
            </div>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-sm text-left border rounded-lg overflow-hidden">
            <thead className="bg-blue-900 text-white uppercase font-bold text-xs">
              <tr>
                <th className="py-3 px-4">Player Profile</th>
                <th className="py-3 px-4">Membership Status</th>
                <th className="py-3 px-4">Club Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  
                  {/* Player Info Column */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-gray-800 text-base">{user.fullName || user.username}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium text-blue-600">{user.email}</span>
                        <span className="mx-2">•</span>
                        {user.branch || 'No Branch'} 
                        <span className="mx-2">•</span>
                        {user.yearOfJoining || 'No Year'}
                    </div>
                  </td>
                  
                  {/* Membership Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={user.membershipStatus || 'None'}
                      onChange={(e) => handleMembershipChange(user.id, user.membershipStatus || 'None', e.target.value)}
                      disabled={updatingId === user.id}
                      className={`w-full max-w-[180px] p-2 rounded border font-bold text-sm focus:ring-2 outline-none disabled:opacity-50 cursor-pointer ${
                        user.membershipStatus === 'Approved' ? 'bg-green-50 border-green-400 text-green-800' :
                        user.membershipStatus === 'Pending' ? 'bg-orange-50 border-orange-400 text-orange-800' :
                        user.membershipStatus === 'Rejected' ? 'bg-red-50 border-red-400 text-red-800' :
                        'bg-gray-50 border-gray-300 text-gray-600'
                      }`}
                    >
                      <option value="None">None</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Club Role Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={user.clubRole || 'User'}
                      onChange={(e) => handleRoleChange(user.id, user.clubRole, e.target.value)}
                      disabled={updatingId === user.id}
                      className={`w-full max-w-[180px] p-2 rounded border font-bold text-sm focus:ring-2 outline-none disabled:opacity-50 cursor-pointer ${
                        user.clubRole === 'Coordinator' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                        user.clubRole === 'Co_Coordinator' ? 'bg-orange-50 border-orange-400 text-orange-800' :
                        user.clubRole === 'Member' ? 'bg-blue-50 border-blue-400 text-blue-800' :
                        'bg-gray-50 border-gray-300 text-gray-600'
                      }`}
                    >
                      <option value="User">Standard User</option>
                      <option value="Member">Club Member</option>
                      <option value="Co_Coordinator">Co-Coordinator</option>
                      <option value="Coordinator">Coordinator</option>
                    </select>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-gray-500 font-medium">
                    No users found matching the "{statusFilter}" status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}