import { fetchAPI, getStrapiMedia } from '../../../lib/api';

export default async function AlbumPage({ params }) {
  const { id } = params;
  // Fetch specific album and populate ALL images inside it
  const response = await fetchAPI(`/api/albums/${id}?populate=galleryImages`);
  const album = response?.data?.attributes;

  if (!album) return <div>Album not found</div>;

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold mb-4">{album.title}</h1>
      <p className="text-gray-500 mb-8">{new Date(album.eventDate).toDateString()}</p>

      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {album.galleryImages?.data?.map((img) => (
          <div key={img.id} className="break-inside-avoid">
            <img 
              src={getStrapiMedia(img.attributes.url)} 
              alt="Club Event" 
              className="w-full rounded-lg shadow hover:opacity-90 transition cursor-pointer" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}