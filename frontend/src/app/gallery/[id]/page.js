export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { fetchAPI, getStrapiMedia } from '../../../lib/api';

export default async function AlbumPage({ params }) {
  // FIX: Await params before using them (Next.js 15 requirement)
  const { id } = await params;

  let album = null;
  try {
    // Strapi v5 finds by documentId automatically
    const response = await fetchAPI(`/api/albums/${id}?populate=galleryImages`);
    album = response?.data || response;
  } catch (error) {
    console.error("Album Load Error:", error);
  }

  if (!album) return <div className="text-center py-20 font-bold text-gray-500">Album not found.</div>;

  // Handle nested or flat structure
  const data = album.attributes || album;
  
  // Handle Gallery Images Array
  const galleryArray = Array.isArray(data.galleryImages) 
    ? data.galleryImages 
    : (data.galleryImages?.data || []);

  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <Link href="/gallery" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Gallery</Link>
      
      <h1 className="text-4xl font-bold mb-2 text-blue-900">{data.title}</h1>
      <p className="text-gray-500 mb-8 border-b pb-4">
        {data.eventDate ? new Date(data.eventDate).toDateString() : 'Date N/A'}
      </p>

      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryArray.map((img, index) => {
          const imgAttr = img.attributes || img;
          const imgUrl = imgAttr.url ? getStrapiMedia(imgAttr.url) : null;
          if (!imgUrl) return null;

          return (
            <div key={index} className="break-inside-avoid mb-4">
              <img src={imgUrl} alt="Gallery" className="w-full rounded-lg shadow" />
            </div>
          );
        })}
      </div>
    </div>
  );
}