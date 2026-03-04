"use client";
import { useState, useEffect } from 'react';
import { fetchAPI, createAPI, updateAPI } from '../../../lib/api';

export default function AdminFutsalPage() {
  const [futsalList, setFutsalList] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [futsalData, setFutsalData] = useState({
    teamName: '', group: '',
    played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, points: 0
  });

  const loadFutsal = async () => {
    try {
      // CHANGED: Added token to the fetch request
      const token = localStorage.getItem('jwt');
      const res = await fetchAPI('/api/futsal-teams?sort=group:asc', token);
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setFutsalList(data);
    } catch (error) { console.error("Futsal Load Error", error); }
  };

  useEffect(() => {
    loadFutsal();
  }, []);

  const handleEditTeam = (team) => {
    const t = team.attributes || team;
    setEditingTeamId(team.documentId || team.id);
    setFutsalData({
        teamName: t.teamName, group: t.group,
        played: t.played || 0, won: t.won || 0, drawn: t.drawn || 0, lost: t.lost || 0,
        goalsFor: t.goalsFor || 0, goalsAgainst: t.goalsAgainst || 0, points: t.points || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelTeamEdit = () => {
    setEditingTeamId(null);
    setFutsalData({ teamName: '', group: '', played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 });
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
    const payload = {
        teamName: futsalData.teamName, group: futsalData.group,
        played: parseInt(futsalData.played), won: parseInt(futsalData.won), 
        drawn: parseInt(futsalData.drawn), lost: parseInt(futsalData.lost),
        goalsFor: parseInt(futsalData.goalsFor), goalsAgainst: parseInt(futsalData.goalsAgainst), 
        points: parseInt(futsalData.points)
    };
    try {
      if (editingTeamId) {
        await updateAPI(`/api/futsal-teams/${editingTeamId}`, payload, token);
        alert("Team Stats Updated!");
      } else {
        await createAPI('/api/futsal-teams', payload, token);
        alert("Team Created!");
      }
      handleCancelTeamEdit();
      loadFutsal();
    } catch (error) { 
        console.error(error);
        alert("Futsal Operation failed."); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <form onSubmit={handleTeamSubmit} className={`p-8 rounded-xl shadow-md border-2 transition ${editingTeamId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-700">{editingTeamId ? `Editing Team Stats` : 'Create New Team'}</h2>{editingTeamId && <button type="button" onClick={handleCancelTeamEdit} className="text-sm text-red-600 underline">Cancel Edit</button>}</div>
                <div className="grid grid-cols-2 gap-4 mb-6"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label><input type="text" required placeholder="Group A" value={futsalData.group} onChange={(e) => setFutsalData({...futsalData, group: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label><input type="text" required placeholder="Dream Team" value={futsalData.teamName} onChange={(e) => setFutsalData({...futsalData, teamName: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div></div>
                <div className="grid grid-cols-4 gap-4 mb-4"><div><label className="block text-xs text-gray-500 text-center mb-1">Played</label><input type="number" value={futsalData.played} onChange={(e) => setFutsalData({...futsalData, played: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div><div><label className="block text-xs text-gray-500 text-center mb-1">Won</label><input type="number" value={futsalData.won} onChange={(e) => setFutsalData({...futsalData, won: e.target.value})} className="w-full text-center border-gray-300 rounded p-2 text-green-600 font-bold" /></div><div><label className="block text-xs text-gray-500 text-center mb-1">Drawn</label><input type="number" value={futsalData.drawn} onChange={(e) => setFutsalData({...futsalData, drawn: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div><div><label className="block text-xs text-gray-500 text-center mb-1">Lost</label><input type="number" value={futsalData.lost} onChange={(e) => setFutsalData({...futsalData, lost: e.target.value})} className="w-full text-center border-gray-300 rounded p-2 text-red-500" /></div></div>
                <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded"><div><label className="block text-xs text-gray-500 text-center mb-1">Goals For</label><input type="number" value={futsalData.goalsFor} onChange={(e) => setFutsalData({...futsalData, goalsFor: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div><div><label className="block text-xs text-gray-500 text-center mb-1">Goals Against</label><input type="number" value={futsalData.goalsAgainst} onChange={(e) => setFutsalData({...futsalData, goalsAgainst: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div><div><label className="block text-xs text-blue-900 font-bold text-center mb-1">POINTS</label><input type="number" value={futsalData.points} onChange={(e) => setFutsalData({...futsalData, points: e.target.value})} className="w-full text-center border-blue-300 bg-blue-50 rounded p-2 font-black text-lg text-blue-900" /></div></div>
                <button type="submit" className={`w-full font-bold py-3 rounded transition text-white ${editingTeamId ? 'bg-yellow-600' : 'bg-green-600'}`}>{editingTeamId ? 'Update Stats' : 'Create Team'}</button>
            </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-fit max-h-[600px] overflow-y-auto"><h3 className="font-bold text-gray-500 uppercase text-xs mb-4 sticky top-0 bg-white pb-2 border-b">Select Team to Edit</h3><div className="space-y-3">{futsalList.map((team) => { const t = team.attributes || team; const key = team.documentId || team.id; return (<div key={key} onClick={() => handleEditTeam(team)} className={`p-3 rounded border cursor-pointer hover:shadow-md transition flex justify-between items-center ${editingTeamId === key ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-50 border-gray-200'}`}><div><div className="font-bold text-sm">{t.teamName}</div><div className="text-xs text-gray-500">{t.group || 'No Group'}</div></div><div className="text-center"><span className="block font-black text-blue-900 text-lg">{t.points || 0}</span><span className="text-[10px] uppercase text-gray-400">Pts</span></div></div>)})}</div></div>
    </div>
  );
}