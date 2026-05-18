import { create } from 'zustand';
import * as analysisService from '../services/analysisService';

const useAnalysisStore = create((set) => ({
  analysisResult: null,
  historyId: null,
  isLoading: false,
  error: null,
  isGeneratingPdf: false,
  userStats: null,
  isFetchingStats: false,

  analyzeResume: async (formData) => {
    set({ isLoading: true, error: null, analysisResult: null, historyId: null });
    try {
      const data = await analysisService.analyzeResume(formData);
      set({ 
        analysisResult: data.analysisResult, 
        historyId: data.historyId,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Analysis failed', 
        isLoading: false 
      });
      throw error;
    }
  },

  downloadResumePdf: async (historyId) => {
    set({ isGeneratingPdf: true, error: null });
    try {
      const blob = await analysisService.generateResumePdf(historyId);
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ATS_Optimized_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      set({ isGeneratingPdf: false });
    } catch (error) {
      set({ 
        error: 'Failed to generate PDF', 
        isGeneratingPdf: false 
      });
      throw error;
    }
  },

  fetchUserStats: async () => {
    set({ isFetchingStats: true, error: null });
    try {
      const stats = await analysisService.getUserStats();
      set({ userStats: stats, isFetchingStats: false });
    } catch (error) {
      set({ error: 'Failed to fetch user statistics', isFetchingStats: false });
      console.error(error);
    }
  },
  
  clearAnalysis: () => set({ analysisResult: null, historyId: null, error: null })
}));

export default useAnalysisStore;
