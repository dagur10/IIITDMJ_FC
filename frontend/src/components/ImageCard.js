"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function ImageCard({ linkId, title, date, initialImageUrl }) {
  const [src, setSrc] = useState(initialImageUrl);

  return (
    <Link href={`/gallery/${linkId}`} className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition">
      <div className="relative h-64 w-full bg-gray-200">
        
        {/* 1. The Image */}
        <img 
          src={src} 
          alt={title || 'Album Cover'} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
          onError={() => setSrc('/placeholder.jpg')} 
        />

        {/* 2. THE FIX: Changed 'bg-opacity-20' to 'bg-black/20' */}
        {/* If this still covers the image, try removing this div entirely to test */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition z-10"></div>
        
      </div>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">{title}</h2>
        <p className="text-gray-500 text-sm">{date}</p>
      </div>
    </Link>
  );
}