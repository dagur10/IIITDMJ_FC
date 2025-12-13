export const dynamic = 'force-dynamic'; 
import { fetchAPI } from '../../lib/api';

export default async function FutsalPage() {
  let teams = [];
  try {
    const response = await fetchAPI('/api/futsal-teams');
    teams = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
  } catch (err) { console.error("Failed to fetch teams:", err); }

  const getTeamData = (item) => item?.attributes || item;

  // 1. Filter Valid Teams
  const validTeams = teams
    .map(getTeamData)
    .filter(t => t && t.teamName);

  // 2. Group Teams by "group" Field
  const groupedTeams = validTeams.reduce((acc, team) => {
    const groupName = team.group || 'Unassigned'; // Default if empty
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(team);
    return acc;
  }, {});

  // 3. Sort Groups Alphabetically
  const sortedGroupKeys = Object.keys(groupedTeams).sort();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-900">Futsal Tournament Tables</h1>

      {sortedGroupKeys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500">No teams found.</p>
        </div>
      ) : (
        sortedGroupKeys.map((groupName) => {
          // Sort teams inside the group
          const teamsInGroup = groupedTeams[groupName].sort((a, b) => {
             const pointsA = a.points || 0;
             const pointsB = b.points || 0;
             if (pointsB !== pointsA) return pointsB - pointsA;
             const gdA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
             const gdB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
             return gdB - gdA;
          });

          return (
            <div key={groupName} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2 border-l-4 border-yellow-500">
                {groupName}
              </h2>
              <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-blue-900 text-white text-sm uppercase">
                    <tr>
                      <th className="py-3 px-4 text-left w-12">#</th>
                      <th className="py-3 px-4 text-left">Team</th>
                      <th className="py-3 px-4 text-center">P</th>
                      <th className="py-3 px-4 text-center">W</th>
                      <th className="py-3 px-4 text-center">D</th>
                      <th className="py-3 px-4 text-center">L</th>
                      <th className="py-3 px-4 text-center">GF</th>
                      <th className="py-3 px-4 text-center">GA</th>
                      <th className="py-3 px-4 text-center">GD</th>
                      <th className="py-3 px-4 text-center font-bold bg-blue-800">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm">
                    {teamsInGroup.map((t, index) => {
                      const gd = (t.goalsFor || 0) - (t.goalsAgainst || 0);
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-bold text-gray-400">{index + 1}</td>
                          <td className="py-3 px-4 font-bold text-base">{t.teamName}</td>
                          <td className="py-3 px-4 text-center">{t.played || 0}</td>
                          <td className="py-3 px-4 text-center text-green-600 font-bold">{t.won || 0}</td>
                          <td className="py-3 px-4 text-center text-gray-500">{t.drawn || 0}</td>
                          <td className="py-3 px-4 text-center text-red-500">{t.lost || 0}</td>
                          <td className="py-3 px-4 text-center text-gray-400">{t.goalsFor || 0}</td>
                          <td className="py-3 px-4 text-center text-gray-400">{t.goalsAgainst || 0}</td>
                          <td className="py-3 px-4 text-center font-medium">{gd > 0 ? `+${gd}` : gd}</td>
                          <td className="py-3 px-4 text-center font-bold text-lg text-blue-900 bg-gray-100">{t.points || 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}