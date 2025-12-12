import { fetchAPI } from '../../lib/api';
import { cookies } from 'next/headers';

const rolePriority = {
  'Coordinator': 1,
  'Co_Coordinator': 2,
  'Member': 3
};

async function getMembers(token) {
  // NEW: If there is no token, don't even try to fetch. Return empty immediately.
  if (!token) {
    return [];
  }

  try {
    const data = await fetchAPI('/api/users?filters[membershipStatus][$eq]=Approved', token);
    
    if(data) {
      return data.sort((a, b) => {
        const roleA = rolePriority[a.clubRole] || 4;
        const roleB = rolePriority[b.clubRole] || 4;
        return roleA - roleB;
      });
    }
    return [];
  } catch (error) {
    // This logs the error if the token was invalid or permissions are still wrong
    console.error("Failed to fetch members:", error.message);
    return [];
  }
}

export default async function MembersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  const members = await getMembers(token);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Club Members</h1>
      
      {/* Show a message if they aren't logged in / no members found */}
      {members.length === 0 ? (
        <p className="text-center text-gray-500">
          {token ? "No members found." : "Please login to view members."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map(member => (
            <div key={member.id} className={`p-6 rounded shadow border ${member.clubRole === 'Coordinator' ? 'bg-yellow-50 border-yellow-400' : 'bg-white'}`}>
              <h2 className="text-xl font-bold">{member.fullName || member.username}</h2>
              <p className="text-gray-600">{member.clubRole}</p>
              <p className="text-sm mt-2"><strong>Branch:</strong> {member.branch}</p>
              <p className="text-sm"><strong>Position:</strong> {member.playingPosition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}