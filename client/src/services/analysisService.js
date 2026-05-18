import api from './api';

export const analyzeResume = async (formData) => {
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generateResumePdf = async (historyId) => {
  const response = await api.post(`/resume/generate/${historyId}`, {}, {
    responseType: 'blob', // Important for handling binary PDF data
  });
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/analyze/stats');
  return response.data;
};
