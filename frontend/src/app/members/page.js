import { fetchAPI, getStrapiMedia } from '../../lib/api';
import { cookies } from 'next/headers';

const rolePriority = {
  'Coordinator': 1,
  'Co_Coordinator': 2,
  'Member': 3
};

async function getMembers(token) {
  if (!token) return [];

  try {
    // UPDATED: Added '&populate=profilePicture' to get the image data
    const data = await fetchAPI('/api/users?filters[membershipStatus][$eq]=Approved&populate=profilePicture', token);
    
    if(data) {
      return data.sort((a, b) => {
        const roleA = rolePriority[a.clubRole] || 4;
        const roleB = rolePriority[b.clubRole] || 4;
        return roleA - roleB;
      });
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch members:", error.message);
    return [];
  }
}

export default async function MembersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  const members = await getMembers(token);

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Club Members</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Meet the team behind the success. Only approved members are listed here.
        </p>
      </div>
      
      {members.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-xl text-gray-500 font-medium">
            {token ? "No active members found." : "Please login to view members."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map(member => {
             // Handle Image URL
             const imageUrl = member.profilePicture 
                ? getStrapiMedia(member.profilePicture.url) 
                : null;

             return (
              <div key={member.id} className={`relative flex flex-col items-center p-6 rounded-xl shadow-md transition hover:shadow-xl border-t-4 ${
                  member.clubRole === 'Coordinator' ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-blue-900'
              }`}>
                
                {/* Profile Picture Circle */}
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={member.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Default Placeholder Icon
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <h2 className="text-lg font-bold text-gray-800 text-center mb-1">
                    {member.fullName || member.username}
                </h2>
                
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${
                    member.clubRole === 'Coordinator' ? 'bg-yellow-200 text-yellow-800' : 
                    member.clubRole === 'Co_Coordinator' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                }`}>
                  {member.clubRole}
                </span>

                {/* Details */}
                <div className="w-full space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                        <span className="font-semibold">Branch:</span>
                        <span>{member.branch || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Position:</span>
                        <span>{member.playingPosition || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Batch:</span>
                        <span>{member.yearOfJoining || '-'}</span>
                    </div>
                </div>

              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}