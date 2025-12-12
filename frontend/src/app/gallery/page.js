import Link from 'next/link';
import { fetchAPI, getStrapiMedia } from '../../lib/api';

export default async function GalleryPage() {
  // Populate coverImage to get the image URL
  const response = await fetchAPI('/api/albums?populate=*');
  const albums = response?.data || [];

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Photo Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album) => {
          const attr = album.attributes;
          // Safety check for image
          const imageUrl = attr.coverImage?.data 
            ? getStrapiMedia(attr.coverImage.data.attributes.url) 
            : '/placeholder.jpg'; 

          return (
            <Link href={`/gallery/${album.id}`} key={album.id} className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={attr.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition"></div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{attr.title}</h2>
                <p className="text-gray-500 text-sm">{new Date(attr.eventDate).toDateString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}