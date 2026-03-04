"use client";
import { useState, useEffect } from 'react';
// Removed: import Cookies from 'js-cookie';
import { fetchAPI, createAPI, updateAPI } from '../../../lib/api';

export default function AdminMatchesPage() {
  const [matchesList, setMatchesList] = useState([]); 
  const [editingMatchId, setEditingMatchId] = useState(null); 
  const [matchData, setMatchData] = useState({
    homeTeam: 'IIITDMJ', awayTeam: '', homeScore: 0, awayScore: 0,
    matchDate: '', season: '2025', event: ''
  });

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
  };

  const loadMatches = async () => {
    try {
      const res = await fetchAPI('/api/matches?sort=matchDate:desc');
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setMatchesList(data);
    } catch (error) { console.error("Matches Load Error", error); }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleEditMatch = (match) => {
    const m = match.attributes || match;
    setEditingMatchId(match.documentId || match.id);
    setMatchData({
      homeTeam: m.homeTeam, awayTeam: m.awayTeam, homeScore: m.homeScore, awayScore: m.awayScore,
      matchDate: formatDateForInput(m.matchDate), season: m.season, event: m.event || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleCancelMatchEdit = () => {
    setEditingMatchId(null);
    setMatchData({ homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0, matchDate: '', season: '2025', event: '' });
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    
    // CHANGED: Pull the token from Local Storage instead of Cookies
    const token = localStorage.getItem('jwt');
    
    const payload = { ...matchData, homeScore: parseInt(matchData.homeScore), awayScore: parseInt(matchData.awayScore) };
    
    try {
      if (editingMatchId) {
        await updateAPI(`/api/matches/${editingMatchId}`, payload, token);
        alert("Match Updated!");
      } else {
        await createAPI('/api/matches', payload, token);
        alert("Match Created!");
      }
      handleCancelMatchEdit();
      loadMatches();
    } catch (error) { 
        console.error(error);
        alert("Match Operation failed."); 
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <form onSubmit={handleMatchSubmit} className={`p-8 rounded-xl shadow-md border-2 transition ${editingMatchId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-700">{editingMatchId ? `Editing Match` : 'Upload New Result'}</h2>{editingMatchId && <button type="button" onClick={handleCancelMatchEdit} className="text-sm text-red-600 underline">Cancel Edit</button>}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Season</label><input type="text" required value={matchData.season} onChange={(e) => setMatchData({...matchData, season: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label><input type="date" required value={matchData.matchDate} onChange={(e) => setMatchData({...matchData, matchDate: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event</label><input type="text" placeholder="Semi-Final" required value={matchData.event} onChange={(e) => setMatchData({...matchData, event: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div>
                </div>
                <div className="p-4 bg-white/50 rounded-lg border border-gray-200 grid grid-cols-3 gap-2 items-center">
                    <div className="text-center"><label className="block font-bold text-blue-900 mb-1">Home Team</label><input type="text" required value={matchData.homeTeam} onChange={(e) => setMatchData({...matchData, homeTeam: e.target.value})} className="w-full text-center font-bold text-lg border-gray-300 rounded p-2" /><input type="number" min="0" required value={matchData.homeScore} onChange={(e) => setMatchData({...matchData, homeScore: e.target.value})} className="w-20 mx-auto block text-center font-mono text-2xl border-gray-300 rounded p-2 mt-2" /></div>
                    <div className="text-center font-bold text-gray-400 text-xl">VS</div>
                    <div className="text-center"><label className="block font-bold text-red-900 mb-1">Away Team</label><input type="text" required value={matchData.awayTeam} onChange={(e) => setMatchData({...matchData, awayTeam: e.target.value})} className="w-full text-center font-bold text-lg border-gray-300 rounded p-2" /><input type="number" min="0" required value={matchData.awayScore} onChange={(e) => setMatchData({...matchData, awayScore: e.target.value})} className="w-20 mx-auto block text-center font-mono text-2xl border-gray-300 rounded p-2 mt-2" /></div>
                </div>
                <button type="submit" className={`mt-6 w-full font-bold py-3 rounded transition text-white ${editingMatchId ? 'bg-yellow-600' : 'bg-green-600'}`}>{editingMatchId ? 'Update Result' : 'Publish Result'}</button>
            </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-fit max-h-[600px] overflow-y-auto">
            <h3 className="font-bold text-gray-500 uppercase text-xs mb-4 sticky top-0 bg-white pb-2 border-b">Recent Uploads</h3>
            <div className="space-y-3">
                {matchesList.map((match) => {
                    const m = match.attributes || match;
                    const key = match.documentId || match.id;
                    return (<div key={key} onClick={() => handleEditMatch(match)} className={`p-3 rounded border cursor-pointer hover:shadow-md transition ${editingMatchId === key ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-50 border-gray-200'}`}><div className="text-xs text-gray-500 flex justify-between"><span>{formatDateForInput(m.matchDate)}</span><span className="font-bold text-blue-600">{m.event}</span></div><div className="font-bold text-sm mt-1 text-center">{m.homeTeam} vs {m.awayTeam}</div><div className="text-center font-mono font-bold bg-white border rounded mt-2 py-1">{m.homeScore} - {m.awayScore}</div></div>)
                })}
            </div>
        </div>
    </div>
  );
}