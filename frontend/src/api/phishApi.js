import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const scanUrl = async (url) => {
  const response = await api.post('/scan/url', { url });
  return response.data;
};

export const scanEmail = async (raw_email) => {
  const response = await api.post('/scan/email', { raw_email });
  return response.data;
};

export const getHistory = async (page = 1) => {
  const response = await api.get(`/history?page=${page}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const submitFeedback = async (scan_id, is_false_positive, user_comment) => {
  const response = await api.post('/feedback', { scan_id, is_false_positive, user_comment });
  return response.data;
};
