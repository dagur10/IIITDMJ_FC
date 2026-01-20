export const dynamic = 'force-dynamic'; 
import { fetchAPI } from '../../lib/api';

// Helper to render Strapi Blocks
const BlockRenderer = ({ content }) => {
  if (!content) return null;
  if (typeof content === 'string') return <p className="whitespace-pre-line">{content}</p>;
  if (Array.isArray(content)) {
    return (
      <div className="space-y-4">
        {content.map((block, index) => {
          if (block.type === 'paragraph') {
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {block.children?.map((child, i) => child.text).join('')}
              </p>
            );
          }
          if (block.type === 'list') {
             return (
                <ul key={index} className="list-disc pl-5 space-y-1">
                    {block.children?.map((item, i) => (
                        <li key={i}>{item.children?.map(c => c.text).join('')}</li>
                    ))}
                </ul>
             )
          }
          return null;
        })}
      </div>
    );
  }
  return null;
};

export default async function AboutPage() {
  let about = null;
  try {
    const response = await fetchAPI('/api/abouts'); 
    
    // FIX: Robust Data Extraction for Strapi v5 (Flat) and v4 (Nested)
    if (response?.data) {
        // 1. Get the specific item (handle array vs single object)
        const item = Array.isArray(response.data) ? response.data[0] : response.data;
        
        // 2. Extract attributes (handle v4 attributes vs v5 flat properties)
        // If 'attributes' exists, use it. Otherwise, use the item itself.
        about = item?.attributes || item;
    }

  } catch (error) {
    console.error("About Page Error:", error);
  }

  // Debugging Helper: Uncomment this to see what Strapi is actually sending in your console
  // console.log("About Data:", about);

  if (!about) return <div className="text-center mt-20 text-xl font-bold text-gray-500">About content coming soon!</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* 1. Header (No Description) */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 border-b-4 border-blue-200 inline-block pb-2">{about.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Trophy Cabinet */}
        <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-md border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                🏆 Trophy Cabinet
            </h2>
            <div className="text-gray-700">
                <BlockRenderer content={about.trophies} />
                {!about.trophies && <p className="text-gray-400 italic">No trophies listed yet.</p>}
            </div>
        </div>

        {/* 3. Coordinators & Leadership */}
        <div className="bg-blue-50 p-8 rounded-2xl shadow-md border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                👔 Coordinators
            </h2>
            <div className="text-gray-700">
                <BlockRenderer content={about.coordinators} />
                {!about.coordinators && <p className="text-gray-400 italic">No coordinators listed yet.</p>}
            </div>
        </div>
      </div>

      {/* 4. Footer Info */}
      <div className="mt-12 text-center border-t pt-8 text-gray-500">
        {about.socialHandle && (
            <div className="mb-2">
                <span className="font-bold text-blue-900">Follow us:</span> {about.socialHandle}
            </div>
        )}
        {about.websiteCredits && (
            <div className="text-sm">
                Website created by <span className="font-semibold text-gray-700">{about.websiteCredits}</span>
            </div>
        )}
      </div>
    </div>
  );
}