"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchAPI, createAPI, updateAPI, uploadImage } from '../../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('match');

  // --- MATCH STATE ---
  const [matchesList, setMatchesList] = useState([]); 
  const [editingMatchId, setEditingMatchId] = useState(null); 
  const [matchData, setMatchData] = useState({
    homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0,
    matchDate: '', season: '2025', event: ''
  });

  // --- FUTSAL STATE ---
  const [futsalList, setFutsalList] = useState([]);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [futsalData, setFutsalData] = useState({
    teamName: '', group: '',
    played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, points: 0
  });

  // --- GALLERY STATE ---
  const [albumsList, setAlbumsList] = useState([]);
  const [albumData, setAlbumData] = useState({ title: '', eventDate: '' });
  const [coverFile, setCoverFile] = useState(null); 
  const [galleryFiles, setGalleryFiles] = useState([]); 
  const [uploading, setUploading] = useState(false);

  // --- HELPER: Format Date for Input (YYYY-MM-DD) ---
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    return isoString.split('T')[0]; // Splits "2025-12-12T18:30..." and keeps "2025-12-12"
  };

  // 1. Auth Check & Data Loading
  useEffect(() => {
    const init = async () => {
      const token = Cookies.get('jwt');
      if (!token) { router.push('/'); return; }
      try {
        const user = await fetchAPI('/api/users/me', token);
        if (!['Coordinator', 'Co_Coordinator'].includes(user.clubRole)) {
          alert("Access Denied");
          router.push('/');
          return;
        }
        loadMatches();
        loadFutsal();
        loadAlbums(); 
      } catch (err) { router.push('/'); } finally { setLoading(false); }
    };
    init();
  }, [router]);

  // --- LOADERS ---
  const loadMatches = async () => {
    try {
      const res = await fetchAPI('/api/matches?sort=matchDate:desc');
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setMatchesList(data);
    } catch (error) { console.error("Matches Load Error", error); }
  };
  const loadFutsal = async () => {
    try {
      const res = await fetchAPI('/api/futsal-teams?sort=group:asc');
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setFutsalList(data);
    } catch (error) { console.error("Futsal Load Error", error); }
  };
  const loadAlbums = async () => {
    try {
      const res = await fetchAPI('/api/albums?sort=eventDate:desc');
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setAlbumsList(data);
    } catch (error) { console.error("Albums Load Error", error); }
  };

  // --- MATCH HANDLERS ---
  const handleEditMatch = (match) => {
    const m = match.attributes || match;
    // Use documentId (Strapi v5) or id (v4)
    setEditingMatchId(match.documentId || match.id);
    setMatchData({
      homeTeam: m.homeTeam, 
      awayTeam: m.awayTeam, 
      homeScore: m.homeScore, 
      awayScore: m.awayScore,
      matchDate: formatDateForInput(m.matchDate), // FIX: Applied Date Formatter here
      season: m.season, 
      event: m.event || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleCancelMatchEdit = () => {
    setEditingMatchId(null);
    setMatchData({ homeTeam: '', awayTeam: '', homeScore: 0, awayScore: 0, matchDate: '', season: '2025', event: '' });
  };

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('jwt');
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

  // --- FUTSAL HANDLERS ---
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
    const token = Cookies.get('jwt');
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
    } catch (error) { alert("Futsal Operation failed."); }
  };

  // --- GALLERY HANDLERS ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if(!coverFile) { alert("Please select a cover image."); return; }
    
    setUploading(true);
    const token = Cookies.get('jwt');

    try {
      // 1. Upload Cover Image
      const coverImgResponse = await uploadImage(coverFile, token);
      const coverId = coverImgResponse.id;

      // 2. Upload Gallery Images (Loop)
      let galleryIds = [];
      if (galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
            const imgRes = await uploadImage(galleryFiles[i], token);
            galleryIds.push(imgRes.id);
        }
      }

      // 3. Create Album Entry
      const payload = {
        title: albumData.title,
        eventDate: albumData.eventDate,
        coverImage: coverId,        
        galleryImages: galleryIds   
      };

      await createAPI('/api/albums', payload, token);
      alert("Album Created Successfully!");

      // Reset
      setAlbumData({ title: '', eventDate: '' });
      setCoverFile(null);
      setGalleryFiles([]);
      loadAlbums();

    } catch (error) {
        console.error(error);
        alert("Gallery upload failed. See console.");
    } finally {
        setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Verifying Permissions...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 border-b pb-4">Coordinator Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('match')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'match' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600'}`}>Matches</button>
        <button onClick={() => setActiveTab('futsal')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'futsal' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600'}`}>Futsal Teams</button>
        <button onClick={() => setActiveTab('gallery')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'gallery' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-600'}`}>Gallery Albums</button>
      </div>

      {/* --- MATCHES TAB --- */}
      {activeTab === 'match' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <form onSubmit={handleMatchSubmit} className={`p-8 rounded-xl shadow-md border-2 transition ${editingMatchId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">{editingMatchId ? `Editing Match` : 'Upload New Result'}</h2>
                        {editingMatchId && <button type="button" onClick={handleCancelMatchEdit} className="text-sm text-red-600 underline">Cancel Edit</button>}
                    </div>
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
                        return (
                            <div key={key} onClick={() => handleEditMatch(match)} className={`p-3 rounded border cursor-pointer hover:shadow-md transition ${editingMatchId === key ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="text-xs text-gray-500 flex justify-between"><span>{formatDateForInput(m.matchDate)}</span><span className="font-bold text-blue-600">{m.event}</span></div>
                                <div className="font-bold text-sm mt-1 text-center">{m.homeTeam} vs {m.awayTeam}</div>
                                <div className="text-center font-mono font-bold bg-white border rounded mt-2 py-1">{m.homeScore} - {m.awayScore}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )}

      {/* --- FUTSAL TAB --- */}
      {activeTab === 'futsal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <form onSubmit={handleTeamSubmit} className={`p-8 rounded-xl shadow-md border-2 transition ${editingTeamId ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-transparent'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">{editingTeamId ? `Editing Team Stats` : 'Create New Team'}</h2>
                        {editingTeamId && <button type="button" onClick={handleCancelTeamEdit} className="text-sm text-red-600 underline">Cancel Edit</button>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group</label><input type="text" required placeholder="Group A" value={futsalData.group} onChange={(e) => setFutsalData({...futsalData, group: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Team Name</label><input type="text" required placeholder="Dream Team" value={futsalData.teamName} onChange={(e) => setFutsalData({...futsalData, teamName: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div>
                    </div>
                    <h3 className="text-sm font-bold text-blue-900 border-b pb-2 mb-4">Tournament Statistics</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Played</label><input type="number" value={futsalData.played} onChange={(e) => setFutsalData({...futsalData, played: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div>
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Won</label><input type="number" value={futsalData.won} onChange={(e) => setFutsalData({...futsalData, won: e.target.value})} className="w-full text-center border-gray-300 rounded p-2 text-green-600 font-bold" /></div>
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Drawn</label><input type="number" value={futsalData.drawn} onChange={(e) => setFutsalData({...futsalData, drawn: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div>
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Lost</label><input type="number" value={futsalData.lost} onChange={(e) => setFutsalData({...futsalData, lost: e.target.value})} className="w-full text-center border-gray-300 rounded p-2 text-red-500" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4 bg-gray-50 p-3 rounded">
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Goals For</label><input type="number" value={futsalData.goalsFor} onChange={(e) => setFutsalData({...futsalData, goalsFor: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div>
                        <div><label className="block text-xs text-gray-500 text-center mb-1">Goals Against</label><input type="number" value={futsalData.goalsAgainst} onChange={(e) => setFutsalData({...futsalData, goalsAgainst: e.target.value})} className="w-full text-center border-gray-300 rounded p-2" /></div>
                        <div><label className="block text-xs text-blue-900 font-bold text-center mb-1">POINTS</label><input type="number" value={futsalData.points} onChange={(e) => setFutsalData({...futsalData, points: e.target.value})} className="w-full text-center border-blue-300 bg-blue-50 rounded p-2 font-black text-lg text-blue-900" /></div>
                    </div>
                    <button type="submit" className={`w-full font-bold py-3 rounded transition text-white ${editingTeamId ? 'bg-yellow-600' : 'bg-green-600'}`}>{editingTeamId ? 'Update Stats' : 'Create Team'}</button>
                </form>
            </div>
            <div className="bg-white p-6 rounded-xl shadow h-fit max-h-[600px] overflow-y-auto">
                <h3 className="font-bold text-gray-500 uppercase text-xs mb-4 sticky top-0 bg-white pb-2 border-b">Select Team to Edit</h3>
                <div className="space-y-3">
                    {futsalList.map((team) => {
                        const t = team.attributes || team;
                        const key = team.documentId || team.id;
                        return (
                            <div key={key} onClick={() => handleEditTeam(team)} className={`p-3 rounded border cursor-pointer hover:shadow-md transition flex justify-between items-center ${editingTeamId === key ? 'bg-yellow-100 border-yellow-500' : 'bg-gray-50 border-gray-200'}`}>
                                <div><div className="font-bold text-sm">{t.teamName}</div><div className="text-xs text-gray-500">{t.group || 'No Group'}</div></div>
                                <div className="text-center"><span className="block font-black text-blue-900 text-lg">{t.points || 0}</span><span className="text-[10px] uppercase text-gray-400">Pts</span></div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )}

      {/* --- GALLERY TAB --- */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <form onSubmit={handleGallerySubmit} className="bg-white p-8 rounded-xl shadow-md border-2 border-transparent">
                    <h2 className="text-xl font-bold text-gray-700 mb-6">Create New Album</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Album Title</label>
                            <input type="text" required placeholder="e.g. Freshers Party" value={albumData.title} onChange={(e) => setAlbumData({...albumData, title: e.target.value})} className="w-full border-gray-300 rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Date</label>
                            <input type="date" required value={albumData.eventDate} onChange={(e) => setAlbumData({...albumData, eventDate: e.target.value})} className="w-full border-gray-300 rounded p-2" />
                        </div>
                    </div>
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image (Required)</label>
                            <input type="file" required accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Images (Multiple)</label>
                            <input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>
                    <button type="submit" disabled={uploading} className="w-full bg-blue-900 text-white font-bold py-3 rounded hover:bg-blue-800 transition disabled:opacity-50">
                        {uploading ? 'Uploading Images...' : 'Create Album'}
                    </button>
                </form>
            </div>
            
            {/* Gallery List */}
            <div className="bg-white p-6 rounded-xl shadow h-fit max-h-[600px] overflow-y-auto">
                <h3 className="font-bold text-gray-500 uppercase text-xs mb-4 sticky top-0 bg-white pb-2 border-b">Existing Albums</h3>
                <div className="space-y-3">
                    {albumsList.map((album) => {
                        const a = album.attributes || album;
                        const key = album.documentId || album.id;
                        return (
                            <div key={key} className="p-3 rounded border bg-gray-50 border-gray-200">
                                <div className="font-bold text-sm text-blue-900">{a.title}</div>
                                <div className="text-xs text-gray-500">{new Date(a.eventDate).toDateString()}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}