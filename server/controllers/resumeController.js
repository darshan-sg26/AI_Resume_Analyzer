import puppeteer from 'puppeteer';
import AnalysisHistory from '../models/AnalysisHistory.js';
import { generateATSResumeData } from '../utils/aiService.js';

const renderResumeHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Resume</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background-color: #fff;
        }
        h1 {
            font-size: 24px;
            text-transform: uppercase;
            text-align: center;
            margin-bottom: 5px;
            color: #2c3e50;
        }
        .contact-info {
            text-align: center;
            font-size: 14px;
            margin-bottom: 20px;
            color: #555;
        }
        h2 {
            font-size: 18px;
            text-transform: uppercase;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 3px;
            margin-top: 25px;
            margin-bottom: 15px;
            color: #2c3e50;
        }
        .summary {
            font-size: 14px;
            margin-bottom: 20px;
            text-align: justify;
        }
        .skills-list {
            font-size: 14px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 0;
            list-style: none;
        }
        .skills-list li {
            background-color: #f4f6f7;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #d5dbdb;
        }
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items:baseline;
            margin-bottom: 5px;
        }
        .job-title {
            font-size: 16px;
            font-weight: bold;
        }
        .job-company {
            font-size: 14px;
            font-weight: bold;
            color: #555;
        }
        .job-duration {
            font-size: 14px;
            font-style: italic;
            color: #777;
        }
        .achievements {
            margin-top: 5px;
            padding-left: 20px;
            font-size: 14px;
        }
        .achievements li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>${data.name}</h1>
    <div class="contact-info">${data.contactInfo}</div>

    <h2>Professional Summary</h2>
    <div class="summary">${data.professionalSummary}</div>

    <h2>Skills</h2>
    <ul class="skills-list">
        ${data.skills.map((skill) => `<li>${skill}</li>`).join('')}
    </ul>

    <h2>Experience</h2>
    ${data.experience
      .map(
        (exp) => `
        <div class="experience-item">
            <div class="job-header">
                <div>
                    <span class="job-title">${exp.title}</span> | 
                    <span class="job-company">${exp.company}</span>
                </div>
                <span class="job-duration">${exp.duration}</span>
            </div>
            <ul class="achievements">
                ${exp.achievements.map((ach) => `<li>${ach}</li>`).join('')}
            </ul>
        </div>
    `
      )
      .join('')}

    <h2>Education</h2>
    ${data.education
      .map(
        (edu) => `
        <div class="education-item">
            <div class="job-header">
                <div>
                    <span class="job-title">${edu.degree}</span> | 
                    <span class="job-company">${edu.institution}</span>
                </div>
                <span class="job-duration">${edu.year}</span>
            </div>
        </div>
    `
      )
      .join('')}
</body>
</html>
`;

// @desc    Generate ATS-optimized Resume PDF
// @route   POST /api/resume/generate/:historyId
// @access  Private
export const generateResumePdf = async (req, res) => {
  try {
    const history = await AnalysisHistory.findById(req.params.historyId);
    
    if (!history) {
      return res.status(404).json({ message: 'Analysis history not found' });
    }

    if (history.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Generate tailored resume data using AI
    const resumeData = await generateATSResumeData(
      history.resumeText,
      history.jobDescription
    );

    // Create HTML from data
    const htmlContent = renderResumeHtml(resumeData);

    // Launch Puppeteer to convert HTML to PDF
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px',
      },
    });

    await browser.close();

    // Optionally save HTML to history
    history.generatedResumeHtml = htmlContent;
    await history.save();

    // Send PDF buffer to client
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ATS_Resume.pdf',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error generating resume PDF' });
  }
};
