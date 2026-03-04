"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { fetchAPI, getStrapiMedia } from '../../../lib/api';

export default function AlbumPage({ params }) {
  // Await params using React.use() for Next.js 15 compatibility
  const { id } = use(params);
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbumDetails = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await fetchAPI(`/api/albums/${id}?populate=galleryImages`, token);
        setAlbum(response?.data || response);
      } catch (error) {
        console.error("Album Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAlbumDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading Album...</div>;
  if (!album) return <div className="text-center py-20 font-bold text-gray-500">Album not found.</div>;

  const data = album.attributes || album;
  
  const galleryArray = Array.isArray(data.galleryImages) 
    ? data.galleryImages 
    : (data.galleryImages?.data || []);

  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <Link href="/gallery" className="text-green-600 hover:underline mb-4 inline-block">&larr; Back to Gallery</Link>
      
      <h1 className="text-4xl font-bold mb-2 text-gray-900">{data.title}</h1>
      <p className="text-gray-500 mb-8 border-b pb-4">
        {data.eventDate ? new Date(data.eventDate).toDateString() : 'Date N/A'}
      </p>

      {/* Masonry-style columns logic maintained */}
      <div className="columns-1 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryArray.map((img, index) => {
          const imgAttr = img.attributes || img;
          const imgUrl = imgAttr.url ? getStrapiMedia(imgAttr.url) : null;
          if (!imgUrl) return null;

          return (
            <div key={index} className="break-inside-avoid mb-4">
              <img src={imgUrl} alt="Gallery" className="w-full rounded-lg shadow hover:opacity-90 transition cursor-zoom-in" />
            </div>
          );
        })}
      </div>
    </div>
  );
}