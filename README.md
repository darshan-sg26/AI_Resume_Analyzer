# Generative AI Job Preparation Platform

A full-stack application leveraging the MERN stack and Google's Gemini AI to provide an intelligent, automated interview preparation tool.

## Features
- **Resume Upload & Parsing:** Extract text directly from PDF resumes.
- **Job Description Analysis:** Identifies matching skills and detects specific skill gaps.
- **AI Interview Prep:** Generates tailored technical and behavioral interview questions based on the candidate's background and the job.
- **ATS-Optimized Resume Generation:** Uses Gemini AI to rewrite the resume and Puppeteer to convert the generated HTML directly into a downloadable, ATS-friendly PDF.
- **Modern UI:** Built with React, Vite, Framer Motion, and a premium Vanilla CSS design system.
- **Secure Authentication:** JWT-based user authentication with server-side token blacklisting.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API Key

### Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file from the template provided or add these keys:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Run the server: `npm run dev`

### Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file from the template provided or add:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the frontend: `npm run dev`
