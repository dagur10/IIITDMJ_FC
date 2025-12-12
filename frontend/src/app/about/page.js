import { fetchAPI, getStrapiMedia } from '../../lib/api';
import ReactMarkdown from 'react-markdown'; // Run: npm install react-markdown

export default async function AboutPage() {
  const response = await fetchAPI('/api/abouts?populate=*');
  const about = response?.data?.attributes;

  if (!about) return <div className="text-center mt-10">Content coming soon!</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-4xl font-bold mb-6 text-blue-900 border-b pb-4">{about.title}</h1>
      
      {about.teamPhoto?.data && (
        <img 
          src={getStrapiMedia(about.teamPhoto.data.attributes.url)} 
          alt="Club Team" 
          className="w-full h-96 object-cover rounded-lg mb-8 shadow-md"
        />
      )}

      <div className="prose lg:prose-xl text-gray-700">
        {/* React Markdown renders the Strapi Rich Text nicely */}
        <ReactMarkdown>{about.description}</ReactMarkdown>
      </div>
    </div>
  );
}