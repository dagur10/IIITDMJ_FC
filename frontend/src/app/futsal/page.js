import { fetchAPI } from '../../lib/api';

export default async function FutsalPage() {
  // 1. Fetch data
  const response = await fetchAPI('/api/futsal-teams');
  const teams = response?.data || [];

  // 2. Sort Logic (Points > Goal Diff > Goals For)
  const sortedTeams = teams.sort((a, b) => {
    const teamA = a.attributes;
    const teamB = b.attributes;
    
    if (teamB.points !== teamA.points) return teamB.points - teamA.points;
    const gdA = teamA.goalsFor - teamA.goalsAgainst;
    const gdB = teamB.goalsFor - teamB.goalsAgainst;
    return gdB - gdA;
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Futsal Tournament Table</h1>
      
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Pos</th>
              <th className="py-3 px-6 text-left">Team Name</th>
              <th className="py-3 px-6 text-center">P</th>
              <th className="py-3 px-6 text-center">W</th>
              <th className="py-3 px-6 text-center">D</th>
              <th className="py-3 px-6 text-center">L</th>
              <th className="py-3 px-6 text-center">GD</th>
              <th className="py-3 px-6 text-center font-bold bg-blue-800">Pts</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {sortedTeams.map((team, index) => {
              const t = team.attributes;
              const gd = t.goalsFor - t.goalsAgainst;
              return (
                <tr key={team.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-6 font-bold">{index + 1}</td>
                  <td className="py-3 px-6 font-semibold">{t.teamName}</td>
                  <td className="py-3 px-6 text-center">{t.played}</td>
                  <td className="py-3 px-6 text-center text-green-600">{t.won}</td>
                  <td className="py-3 px-6 text-center text-gray-500">{t.drawn}</td>
                  <td className="py-3 px-6 text-center text-red-500">{t.lost}</td>
                  <td className="py-3 px-6 text-center">{gd > 0 ? `+${gd}` : gd}</td>
                  <td className="py-3 px-6 text-center font-bold text-lg text-blue-900 bg-gray-100">{t.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}