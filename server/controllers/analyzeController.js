import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { analyzeResumeVsJob } from '../utils/aiService.js';
import AnalysisHistory from '../models/AnalysisHistory.js';

// @desc    Analyze resume against job description
// @route   POST /api/analyze
// @access  Private
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume PDF' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Please provide a job description' });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    // Analyze using Gemini
    const analysisResult = await analyzeResumeVsJob(resumeText, jobDescription);

    // Save history
    const history = await AnalysisHistory.create({
      user: req.user._id,
      jobDescription,
      resumeText,
      analysisResult,
    });

    res.json({
      historyId: history._id,
      analysisResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error analyzing resume' });
  }
};

// @desc    Get user analysis statistics
// @route   GET /api/analyze/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const histories = await AnalysisHistory.find({ user: req.user._id });
    
    const totalAnalyses = histories.length;
    let averageMatchScore = 0;

    if (totalAnalyses > 0) {
      const totalScore = histories.reduce((sum, history) => sum + (history.analysisResult?.matchPercentage || 0), 0);
      averageMatchScore = Math.round(totalScore / totalAnalyses);
    }

    res.json({
      totalAnalyses,
      averageMatchScore
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
};
