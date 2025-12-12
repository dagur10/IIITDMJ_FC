"use client";
import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Fetch all matches sorted by date
    fetchAPI('/api/matches?sort=matchDate:desc').then(res => {
        // Strapi returns data inside a 'data' object usually
        setMatches(res.data || []);
    });
  }, []);

  // Extract unique seasons for the dropdown
  const seasons = ['All', ...new Set(matches.map(m => m.attributes.season))];
  
  const filteredMatches = filter === 'All' 
    ? matches 
    : matches.filter(m => m.attributes.season === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Match Results</h1>
        <select 
          className="p-2 border rounded" 
          onChange={(e) => setFilter(e.target.value)}
        >
          {seasons.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {filteredMatches.map(match => {
           const m = match.attributes;
           return (
             <div key={match.id} className="flex justify-between items-center bg-white p-4 rounded shadow border-l-4 border-blue-600">
               <div className="w-1/3 text-right font-bold text-lg">{m.homeTeam}</div>
               <div className="w-1/3 text-center bg-gray-100 py-1 rounded font-mono text-xl">
                 {m.homeScore} - {m.awayScore}
               </div>
               <div className="w-1/3 text-left font-bold text-lg">{m.awayTeam}</div>
             </div>
           );
        })}
      </div>
    </div>
  );
}