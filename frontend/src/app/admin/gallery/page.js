"use client";
import { useState, useEffect } from 'react';
import { fetchAPI, createAPI, uploadImage } from '../../../lib/api';

export default function AdminGalleryPage() {
  const [albumsList, setAlbumsList] = useState([]);
  const [albumData, setAlbumData] = useState({ title: '', eventDate: '' });
  const [coverFile, setCoverFile] = useState(null); 
  const [galleryFiles, setGalleryFiles] = useState([]); 
  const [uploading, setUploading] = useState(false);

  const loadAlbums = async () => {
    try {
      // CHANGED: Added token to the fetch request
      const token = localStorage.getItem('jwt');
      const res = await fetchAPI('/api/albums?sort=eventDate:desc', token);
      const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setAlbumsList(data);
    } catch (error) { console.error("Albums Load Error", error); }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if(!coverFile) { alert("Please select a cover image."); return; }
    setUploading(true);
    const token = localStorage.getItem('jwt');
    try {
      const coverImgResponse = await uploadImage(coverFile, token);
      const coverId = Array.isArray(coverImgResponse) ? coverImgResponse[0].id : coverImgResponse.id;

      let galleryIds = [];
      if (galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
            const imgRes = await uploadImage(galleryFiles[i], token);
            const imgId = Array.isArray(imgRes) ? imgRes[0].id : imgRes.id;
            galleryIds.push(imgId);
        }
      }
      const payload = {
        title: albumData.title, eventDate: albumData.eventDate,
        coverImage: coverId, galleryImages: galleryIds   
      };
      await createAPI('/api/albums', payload, token);
      alert("Album Created Successfully!");
      setAlbumData({ title: '', eventDate: '' });
      setCoverFile(null); setGalleryFiles([]);
      loadAlbums();
    } catch (error) { 
        console.error(error);
        alert("Gallery upload failed."); 
    } finally { setUploading(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <form onSubmit={handleGallerySubmit} className="bg-white p-8 rounded-xl shadow-md border-2 border-transparent">
                <h2 className="text-xl font-bold text-gray-700 mb-6">Create New Album</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Album Title</label><input type="text" required placeholder="e.g. Freshers Party" value={albumData.title} onChange={(e) => setAlbumData({...albumData, title: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Date</label><input type="date" required value={albumData.eventDate} onChange={(e) => setAlbumData({...albumData, eventDate: e.target.value})} className="w-full border-gray-300 rounded p-2" /></div></div>
                <div className="space-y-4 mb-6"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image (Required)</label><input type="file" required accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Images (Multiple)</label><input type="file" multiple accept="image/*" onChange={(e) => setGalleryFiles(e.target.files)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" /></div></div>
                <button type="submit" disabled={uploading} className="w-full bg-blue-900 text-white font-bold py-3 rounded hover:bg-blue-800 transition disabled:opacity-50">{uploading ? 'Uploading Images...' : 'Create Album'}</button>
            </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-fit max-h-[600px] overflow-y-auto"><h3 className="font-bold text-gray-500 uppercase text-xs mb-4 sticky top-0 bg-white pb-2 border-b">Existing Albums</h3><div className="space-y-3">{albumsList.map((album) => {const a = album.attributes || album; const key = album.documentId || album.id; return (<div key={key} className="p-3 rounded border bg-gray-50 border-gray-200"><div className="font-bold text-sm text-blue-900">{a.title}</div><div className="text-xs text-gray-500">{new Date(a.eventDate).toDateString()}</div></div>)})}</div></div>
    </div>
  );
}