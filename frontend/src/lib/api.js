// frontend/src/lib/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const api = axios.create({
  baseURL: API_URL,
});

// Helper to get full image URL from Strapi
export const getStrapiMedia = (url) => {
  if (url == null) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return `${API_URL}${url}`;
};

// Helper to fetch data with Auth header
// CHANGED: Added 'token' parameter (default null)
export const fetchAPI = async (path, token = null) => {
  // Logic: Use passed token (Server) OR try getting from browser cookies (Client)
  const authToken = token || Cookies.get('jwt');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  try {
    const response = await api.get(path, { headers });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error; 
  }
};

// Helper to update data (PUT)
// CHANGED: Added 'token' parameter
export const updateAPI = async (path, data, token = null) => {
  const authToken = token || Cookies.get('jwt');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  try {
    const response = await api.put(path, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Update Error:", error);
    throw error;
  }
};