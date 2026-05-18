import mongoose from 'mongoose';

const analysisHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    analysisResult: {
      skillGaps: [String],
      matchingSkills: [String],
      technicalQuestions: [String],
      behavioralQuestions: [String],
      prepPlan: String,
      matchPercentage: Number,
    },
    generatedResumeHtml: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AnalysisHistory = mongoose.model('AnalysisHistory', analysisHistorySchema);

export default AnalysisHistory;
