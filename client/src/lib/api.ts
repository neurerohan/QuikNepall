import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.kalimatirate.nyure.com.np/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCalendar = async (year: string, month: string) => {
  const response = await api.get(`/calendar/${year}/${month}`);
  return response.data;
};

export const convertDate = async (params: { from: string; date: string }) => {
  const response = await api.get(`/calendar/convert`, { params });
  return response.data;
};

export const getVegetables = async () => {
  const response = await api.get('/vegetables/');
  return response.data;
};

export const getMetals = async () => {
  const response = await api.get('/metals/');
  return response.data;
};

export const getRashifal = async () => {
  const response = await api.get('/rashifal/');
  return response.data;
};

export const getForex = async (params: { from?: string; to?: string; page?: number; per_page?: number }) => {
  const response = await api.get('/forex', { params });
  return response.data;
};

export default api;
