import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ats-six-theta.vercel.app/', 
  headers: {
    'Content-Type': 'application/json',
  },
  
});