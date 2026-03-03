"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchAPI, createAPI, updateAPI } from '../../../lib/api';

export default function AdminAboutPage() {
  const [aboutId, setAboutId] = useState(null); 
  const [aboutData, setAboutData] = useState({
      title: '', trophies: '', coordinators: '',
      socialHandle: '', websiteCredits: ''
  });
  const [uploading, setUploading] = useState(false);

  const blocksToString = (blocks) => {
    if (!blocks) return '';
    if (typeof blocks === 'string') return blocks;
    if (Array.isArray(blocks)) {
        return blocks.map(block => block.children?.map(c => c.text).join('')).join('\n\n');
    }
    return '';
  };

  const stringToBlocks = (text) => {
    if (!text) return [];
    return text.split(/\n+/).map(paragraph => ({
        type: 'paragraph',
        children: [{ type: 'text', text: paragraph }]
    }));
  };

  const loadAbout = async () => {
    try {
        const res = await fetchAPI('/api/abouts'); 
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data) {
            setAboutId(data.documentId || data.id); 
            const attr = data.attributes || data;
            setAboutData({
                title: attr.title || '',
                trophies: blocksToString(attr.trophies),
                coordinators: blocksToString(attr.coordinators),
                socialHandle: attr.socialHandle || '',
                websiteCredits: attr.websiteCredits || ''
            });
        }
    } catch (error) { console.error("About Load Error", error); }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = Cookies.get('jwt');
    try {
        const payload = {
            title: aboutData.title,
            socialHandle: aboutData.socialHandle,
            websiteCredits: aboutData.websiteCredits,
            trophies: stringToBlocks(aboutData.trophies),
            coordinators: stringToBlocks(aboutData.coordinators)
        };
        if (aboutId) {
            await updateAPI(`/api/abouts/${aboutId}`, payload, token);
            alert("About Page Updated!");
        } else {
            await createAPI('/api/abouts', payload, token);
            alert("About Page Created!");
            loadAbout(); 
        }
    } catch (error) {
        console.error("About Update Error:", error);
        alert("Failed to save About page. Check Admin console.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <form onSubmit={handleAboutSubmit} className="bg-white p-8 rounded-xl shadow-md border-2 border-transparent max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-700 mb-6">Edit Club Information</h2>
        
        <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Club Title</label>
            <input type="text" required value={aboutData.title} onChange={(e) => setAboutData({...aboutData, title: e.target.value})} className="w-full border-gray-300 rounded p-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-xs font-bold text-yellow-600 uppercase mb-1">🏆 Trophy Cabinet (Paragraphs)</label>
                <textarea rows="5" placeholder="Enter achievements separated by new lines" value={aboutData.trophies} onChange={(e) => setAboutData({...aboutData, trophies: e.target.value})} className="w-full border-yellow-300 bg-yellow-50 rounded p-2" />
            </div>
            <div>
                <label className="block text-xs font-bold text-blue-600 uppercase mb-1">👔 Coordinators (Paragraphs)</label>
                <textarea rows="5" placeholder="Enter names separated by new lines" value={aboutData.coordinators} onChange={(e) => setAboutData({...aboutData, coordinators: e.target.value})} className="w-full border-blue-300 bg-blue-50 rounded p-2" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Social Media Handle</label>
                <input type="text" placeholder="@iiitdmj_fc" value={aboutData.socialHandle} onChange={(e) => setAboutData({...aboutData, socialHandle: e.target.value})} className="w-full border-gray-300 rounded p-2" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Website Credits</label>
                <input type="text" placeholder="Created by..." value={aboutData.websiteCredits} onChange={(e) => setAboutData({...aboutData, websiteCredits: e.target.value})} className="w-full border-gray-300 rounded p-2" />
            </div>
        </div>

        <button type="submit" disabled={uploading} className="w-full bg-blue-900 text-white font-bold py-3 rounded hover:bg-blue-800 transition disabled:opacity-50">
            {uploading ? 'Saving Changes...' : 'Update About Page'}
        </button>
    </form>
  );
}