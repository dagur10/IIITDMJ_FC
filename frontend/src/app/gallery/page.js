export const dynamic = 'force-dynamic'; 
import { fetchAPI, getStrapiMedia } from '../../lib/api';
import ImageCard from '../../components/ImageCard'; // Import the new component

export default async function GalleryPage() {
  let albums = [];
  try {
    const response = await fetchAPI('/api/albums?populate=*&sort=eventDate:desc');
    albums = Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []);
  } catch (error) {
    console.error("Gallery Load Error:", error);
  }

  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Photo Gallery</h1>
      
      {albums.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No albums found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album) => {
            // FIX: Handle both v4 and v5 structure
            const data = album.attributes || album;
            const linkId = album.documentId || album.id;

            // Robust Image Extraction
            let imageUrl = '/placeholder.jpg';
            if (data.coverImage) {
                const imgObj = Array.isArray(data.coverImage) ? data.coverImage[0] : data.coverImage;
                if (imgObj?.url) imageUrl = getStrapiMedia(imgObj.url);
                else if (imgObj?.data?.attributes?.url) imageUrl = getStrapiMedia(imgObj.data.attributes.url);
            }

            return (
              <ImageCard 
                key={linkId}
                linkId={linkId}
                title={data.title}
                date={data.eventDate ? new Date(data.eventDate).toDateString() : ''}
                initialImageUrl={imageUrl}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}