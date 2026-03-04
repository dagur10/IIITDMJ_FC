"use client";
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // CHANGED: Grab the token from Local Storage and pass it to the API
        const token = localStorage.getItem('jwt');
        const res = await fetchAPI('/api/matches?sort=matchDate:desc', token);
        
        setMatches(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load matches", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  const getMatchData = (match) => match?.attributes || match;

  const validMatches = matches.filter(m => getMatchData(m));
  const seasons = ['All', ...new Set(validMatches.map(m => getMatchData(m).season).filter(Boolean))];
  const filteredMatches = filter === 'All' ? validMatches : validMatches.filter(m => getMatchData(m).season === filter);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Matches...</div>;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900">Match Results</h1>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Season:</span>
            {/* Changed from focus:ring-indigo-500 to focus:ring-green-600 */}
            <select className="p-2 border rounded shadow-sm outline-none focus:ring-2 focus:ring-green-600" onChange={(e) => setFilter(e.target.value)} value={filter}>
              {seasons.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredMatches.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No matches found.</p>
        ) : (
            filteredMatches.map(match => {
            const m = getMatchData(match);
            
            return (
                <div key={match.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
                    {/* Smoothed out the border-gray-400 to border-gray-100 to match the homepage cards */}
                    
                    {/* Changed bg-gray-50 to bg-green-50, and border-gray-400 to border-green-100 */}
                    <div className="bg-green-50 px-6 py-2 border-b border-green-100 flex justify-between items-center text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wider">
                        <span>{m.matchDate ? new Date(m.matchDate).toDateString() : 'Date TBA'}</span>
                        {/* Changed from text-indigo-600 to text-green-600 */}
                        <span className="text-green-600 font-bold">{m.event || 'Match Day'}</span>
                        <span>{m.season} Season</span>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex-1 text-center md:text-right font-bold text-xl text-gray-900 mb-2 md:mb-0">
                            {m.homeTeam || 'Unknown'}
                        </div>
                        
                        {/* Changed from bg-indigo-600 to bg-green-600 */}
                        <div className="mx-8 px-5 py-2 bg-green-600 text-white rounded-lg font-mono text-2xl font-bold shadow-lg">
                            {m.homeScore} - {m.awayScore}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left font-bold text-xl text-gray-900 mt-2 md:mt-0">
                            {m.awayTeam || 'Unknown'}
                        </div>
                    </div>
                </div>
            );
            })
        )}
      </div>
    </div>
  );
}