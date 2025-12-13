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
        const res = await fetchAPI('/api/matches?sort=matchDate:desc');
        setMatches(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to load matches", error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  // Universal Helper for Strapi v4/v5
  const getMatchData = (match) => match?.attributes || match;

  // Filter Logic
  const validMatches = matches.filter(m => getMatchData(m));
  const seasons = ['All', ...new Set(validMatches.map(m => getMatchData(m).season).filter(Boolean))];
  const filteredMatches = filter === 'All' ? validMatches : validMatches.filter(m => getMatchData(m).season === filter);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading Matches...</div>;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-blue-900">Match Results</h1>
        <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Season:</span>
            <select className="p-2 border rounded shadow-sm outline-none" onChange={(e) => setFilter(e.target.value)} value={filter}>
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
                <div key={match.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    
                    {/* NEW: Event Header (Date | Event Name | Season) */}
                    <div className="bg-gray-50 px-6 py-2 border-b flex justify-between items-center text-xs md:text-sm text-gray-500 uppercase font-semibold tracking-wider">
                        <span>{m.matchDate ? new Date(m.matchDate).toDateString() : 'Date TBA'}</span>
                        <span className="text-blue-600 font-bold">{m.event || 'Match Day'}</span>
                        <span>{m.season} Season</span>
                    </div>

                    {/* Match Body */}
                    <div className="p-6 flex flex-col md:flex-row justify-between items-center">
                        {/* Home Team */}
                        <div className="flex-1 text-center md:text-right font-bold text-xl text-gray-800 mb-2 md:mb-0">
                            {m.homeTeam || 'Unknown'}
                        </div>
                        
                        {/* Score Badge */}
                        <div className="mx-8 px-5 py-2 bg-blue-900 text-white rounded-lg font-mono text-2xl font-bold shadow-lg">
                            {m.homeScore} - {m.awayScore}
                        </div>
                        
                        {/* Away Team */}
                        <div className="flex-1 text-center md:text-left font-bold text-xl text-gray-800 mt-2 md:mt-0">
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