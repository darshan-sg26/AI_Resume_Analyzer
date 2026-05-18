import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key
// We create it dynamically so it picks up the env var correctly when called
const getGenAI = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResumeVsJob = async (resumeText, jobDescription) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          skillGaps: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Skills mentioned in the job description but missing in the resume',
          },
          matchingSkills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Skills matching both the job description and the resume',
          },
          technicalQuestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Technical interview questions based on the job requirements and resume',
          },
          behavioralQuestions: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: 'Behavioral interview questions tailored to the candidate',
          },
          prepPlan: {
            type: SchemaType.STRING,
            description: 'A brief study and preparation plan for the candidate',
          },
          matchPercentage: {
            type: SchemaType.NUMBER,
            description: 'A percentage estimate of how well the candidate matches the job',
          },
        },
        required: [
          'skillGaps',
          'matchingSkills',
          'technicalQuestions',
          'behavioralQuestions',
          'prepPlan',
          'matchPercentage',
        ],
      },
    },
  });

  const prompt = `
    You are an expert technical recruiter and interview coach.
    Analyze the provided Resume Text against the provided Job Description.
    Identify skill gaps, matching skills, and generate tailored technical and behavioral interview questions.
    Provide a brief preparation plan and an estimated match percentage (0-100).
    
    Resume Text:
    ${resumeText}

    Job Description:
    ${jobDescription}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  }
};

export const generateATSResumeData = async (resumeText, jobDescription) => {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          contactInfo: { type: SchemaType.STRING },
          professionalSummary: { type: SchemaType.STRING },
          skills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          experience: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                company: { type: SchemaType.STRING },
                duration: { type: SchemaType.STRING },
                achievements: {
                  type: SchemaType.ARRAY,
                  items: { type: SchemaType.STRING },
                },
              },
            },
          },
          education: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                degree: { type: SchemaType.STRING },
                institution: { type: SchemaType.STRING },
                year: { type: SchemaType.STRING },
              },
            },
          },
        },
        required: ['name', 'contactInfo', 'professionalSummary', 'skills', 'experience', 'education'],
      },
    },
  });

  const prompt = `
    You are an expert resume writer.
    Rewrite the following Resume Text to be ATS-optimized specifically for the given Job Description.
    Ensure keywords from the job description are naturally integrated into the professional summary, skills, and experience achievements.
    Focus on measurable results and clear formatting.
    
    Resume Text:
    ${resumeText}

    Job Description:
    ${jobDescription}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  }
};
