import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer for PDF/DOCX file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'resume-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Dashboard aggregates endpoint
app.get('/api/dashboard', (req, res) => {
  res.json({
    stats: db.get('stats'),
    atsScore: db.get('atsScore'),
    missingSkills: db.get('missingSkills'),
    recommendedJobs: db.get('recommendedJobs'),
    recentApplications: db.get('recentApplications'),
    trackedCompanies: db.get('trackedCompanies'),
    upcomingInterviews: db.get('upcomingInterviews'),
    resumeOptimizationData: db.get('resumeOptimizationData')
  });
});

// Applications routes
app.get('/api/applications', (req, res) => {
  res.json(db.get('applications') || []);
});

app.post('/api/applications', (req, res) => {
  const apps = db.get('applications') || [];
  const newApp = {
    id: apps.length > 0 ? Math.max(...apps.map(a => a.id)) + 1 : 1,
    company: req.body.company || 'Unknown',
    role: req.body.role || 'Software Engineer',
    stage: req.body.stage || 'Applied',
    category: req.body.category || 'Engineering',
    date: req.body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    deadline: req.body.deadline || 'No deadline',
    interviewer: req.body.interviewer || '',
    link: req.body.link || '',
    timeline: req.body.timeline || `Applied on ${new Date().toLocaleDateString()}`
  };
  
  apps.push(newApp);
  db.set('applications', apps);
  db.syncStats();
  
  res.status(201).json(newApp);
});

app.put('/api/applications/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const apps = db.get('applications') || [];
  const index = apps.findIndex(a => a.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  const updatedApp = {
    ...apps[index],
    ...req.body,
    id // ensure ID is not changed
  };
  
  apps[index] = updatedApp;
  db.set('applications', apps);
  db.syncStats();
  
  res.json(updatedApp);
});

app.delete('/api/applications/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const apps = db.get('applications') || [];
  const filtered = apps.filter(a => a.id !== id);
  
  if (filtered.length === apps.length) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  db.set('applications', filtered);
  db.syncStats();
  
  res.json({ success: true, message: `Application ${id} deleted` });
});

// Companies routes
app.get('/api/companies', (req, res) => {
  res.json(db.get('trackedCompanies') || []);
});

app.post('/api/companies', (req, res) => {
  const comps = db.get('trackedCompanies') || [];
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ error: 'Company name is required' });
  }
  
  // Prevent duplicates
  if (comps.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    return res.status(499).json({ error: 'Company already tracked' });
  }
  
  const newComp = {
    name,
    domain: req.body.domain || `${name.toLowerCase().replace(/\s+/g, '')}.com`,
    openings: req.body.openings !== undefined ? req.body.openings : Math.floor(Math.random() * 5)
  };
  
  comps.push(newComp);
  db.set('trackedCompanies', comps);
  
  res.status(201).json(newComp);
});

app.delete('/api/companies/:name', (req, res) => {
  const comps = db.get('trackedCompanies') || [];
  const name = req.params.name;
  const filtered = comps.filter(c => c.name.toLowerCase() !== name.toLowerCase());
  
  db.set('trackedCompanies', filtered);
  res.json({ success: true, message: `Company ${name} untracked` });
});

// Interviews routes
app.get('/api/interviews', (req, res) => {
  res.json(db.get('upcomingInterviews') || []);
});

app.post('/api/interviews', (req, res) => {
  const interviews = db.get('upcomingInterviews') || [];
  const newIntv = {
    id: interviews.length > 0 ? Math.max(...interviews.map(i => i.id)) + 1 : 1,
    company: req.body.company || 'Unknown',
    role: req.body.role || 'Interview',
    date: req.body.date || 'Soon',
    time: req.body.time || '12:00 PM'
  };
  
  interviews.push(newIntv);
  db.set('upcomingInterviews', interviews);
  res.status(201).json(newIntv);
});

app.delete('/api/interviews/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const interviews = db.get('upcomingInterviews') || [];
  const filtered = interviews.filter(i => i.id !== id);
  
  db.set('upcomingInterviews', filtered);
  res.json({ success: true, message: `Interview ${id} deleted` });
});

// Profile routes
app.get('/api/profile', (req, res) => {
  res.json(db.get('profile'));
});

app.put('/api/profile', (req, res) => {
  const currentProfile = db.get('profile') || {};
  const updatedProfile = {
    ...currentProfile,
    ...req.body
  };
  
  db.set('profile', updatedProfile);
  res.json(updatedProfile);
});

// Resume Optimization route
// Resume Optimization and ATS Analysis Engine route
app.post('/api/analysis', (req, res) => {
  const { resumeId, jobDescription, jobTitle, company } = req.body;
  if (!jobDescription) {
    return res.status(400).json({ error: 'Job description is required' });
  }

  const descLower = jobDescription.toLowerCase();
  
  // 1. Retrieve Candidate Profile and Resume Details
  const profile = db.get('profile') || {};
  const resumes = db.get('resumes') || [];
  
  // Find selected resume or fallback to active
  let targetResume = null;
  if (resumeId) {
    targetResume = resumes.find(r => r.id === parseInt(resumeId));
  } else {
    targetResume = resumes.find(r => r.isActive);
  }
  if (!targetResume && resumes.length > 0) {
    targetResume = resumes[0];
  }
  
  const resumeName = targetResume ? targetResume.name : "Senior_Dev_V2.pdf";
  const baseScore = targetResume ? targetResume.score : 75;

  const allSkills = [
    ...(profile.frontendSkills || []),
    ...(profile.backendSkills || []),
    ...(profile.toolsSkills || [])
  ];

  // Read the resume file content if it exists on disk
  let resumeText = "";
  if (targetResume && targetResume.filename) {
    const filePath = path.join(__dirname, 'uploads', targetResume.filename);
    if (fs.existsSync(filePath)) {
      try {
        resumeText = fs.readFileSync(filePath, 'utf8');
      } catch (err) {
        console.error("Failed to read resume file:", err);
      }
    }
  }

  // 2. Run Keyword Matching Algorithm
  const matchedSet = new Set();
  const missingSet = new Set();

  // Define a comprehensive set of potential technical keywords to search in Job Description
  const technicalKeywords = [
    // Languages
    'javascript', 'typescript', 'python', 'java', 'go', 'golang', 'rust', 'c#', '.net', 'c++', 'ruby', 'php', 'swift', 'kotlin',
    // Frontend
    'react', 'angular', 'vue', 'svelte', 'next.js', 'nextjs', 'tailwind', 'sass', 'css', 'html', 'webpack', 'vite', 'redux',
    // Backend
    'node.js', 'node', 'express.js', 'express', 'nestjs', 'django', 'flask', 'fastapi', 'spring boot', 'laravel',
    // Databases / Cache
    'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'dynamodb', 'cassandra',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'github actions', 'jenkins',
    // Architecture & Concepts
    'microservices', 'system design', 'graphql', 'grpc', 'rest api', 'oauth', 'jwt', 'security', 'agile', 'scrum', 'git'
  ];

  const friendlyNameMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'go': 'Go',
    'golang': 'Go',
    'rust': 'Rust',
    'c#': 'C#',
    '.net': '.NET',
    'c++': 'C++',
    'ruby': 'Ruby',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'react': 'React',
    'angular': 'Angular',
    'vue': 'Vue.js',
    'svelte': 'Svelte',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'tailwind': 'Tailwind CSS',
    'sass': 'Sass',
    'css': 'CSS',
    'html': 'HTML',
    'webpack': 'Webpack',
    'vite': 'Vite',
    'redux': 'Redux',
    'node.js': 'Node.js',
    'node': 'Node.js',
    'express.js': 'Express.js',
    'express': 'Express.js',
    'nestjs': 'NestJS',
    'django': 'Django',
    'flask': 'Flask',
    'fastapi': 'FastAPI',
    'spring boot': 'Spring Boot',
    'laravel': 'Laravel',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'sqlite': 'SQLite',
    'redis': 'Redis',
    'elasticsearch': 'Elasticsearch',
    'dynamodb': 'DynamoDB',
    'cassandra': 'Cassandra',
    'aws': 'AWS',
    'azure': 'Azure',
    'gcp': 'GCP',
    'google cloud': 'Google Cloud',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'terraform': 'Terraform',
    'ci/cd': 'CI/CD',
    'github actions': 'GitHub Actions',
    'jenkins': 'Jenkins',
    'microservices': 'Microservices',
    'system design': 'System Design',
    'graphql': 'GraphQL',
    'grpc': 'gRPC',
    'rest api': 'REST API',
    'oauth': 'OAuth',
    'jwt': 'JWT',
    'security': 'Security',
    'agile': 'Agile',
    'scrum': 'Scrum',
    'git': 'Git'
  };

  const hasInText = (text, keyword) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    if (lowerKeyword === 'go' || lowerKeyword === 'git' || lowerKeyword === 'aws') {
      const regex = new RegExp(`\\b${lowerKeyword}\\b`, 'i');
      return regex.test(text);
    }
    return lowerText.includes(lowerKeyword);
  };

  technicalKeywords.forEach(keyword => {
    if (descLower.includes(keyword)) {
      const hasSkill = allSkills.some(s => s.toLowerCase() === keyword || (keyword === 'node' && s.toLowerCase().includes('node'))) || hasInText(resumeText, keyword);
      const friendlyName = friendlyNameMap[keyword] || (keyword.charAt(0).toUpperCase() + keyword.slice(1));
      if (hasSkill) {
        matchedSet.add(friendlyName);
      } else {
        missingSet.add(friendlyName);
      }
    }
  });

  const matchedKeywords = Array.from(matchedSet);
  const missingKeywords = Array.from(missingSet).filter(s => !matchedSet.has(s));

  const totalRelevantKeywords = matchedKeywords.length + missingKeywords.length;
  let matchPercentage = 60;
  if (totalRelevantKeywords > 0) {
    matchPercentage = Math.round((matchedKeywords.length / totalRelevantKeywords) * 100);
  }
  matchPercentage = Math.min(Math.max(matchPercentage, 45), 98);
  
  const atsCompatibilityScore = Math.min(Math.max(Math.round(baseScore * 0.4 + matchPercentage * 0.6), 50), 98);
  const percentile = Math.round(atsCompatibilityScore * 1.02);

  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Integrate key target technologies like **${missingKeywords.slice(0, 3).join(', ')}** into your skills header to satisfy core keyword screening filters.`);
  } else {
    suggestions.push("Your resume skills completely cover all technical keywords parsed in this job description. Focus on optimizing formatting next.");
  }
  suggestions.push(`Flesh out your project bullet points to explicitly describe how you leveraged **${matchedKeywords.slice(0, 2).join(' or ') || 'React'}** to solve product engineering requirements.`);
  suggestions.push("Ensure your experience section headers use standard, scan-friendly naming patterns (e.g. 'Work Experience' instead of 'My Tech Journey') to avoid parser confusion.");

  const rewrittenExperience = [
    `Spearheaded modular frontend features using **${matchedKeywords[0] || 'React'}** and **${matchedKeywords[1] || 'TypeScript'}**, increasing page responsiveness and developer delivery velocity.`,
    `Refactored release deployment telemetry utilizing CI/CD pipelines, improving code delivery reliability.`
  ];

  const optimizationResult = {
    compatibilityScore: atsCompatibilityScore,
    percentile: Math.min(percentile, 99),
    sectionScores: [
      { label: "Skills", score: Math.min(atsCompatibilityScore + 6, 100), color: "bg-indigo-500" },
      { label: "Projects", score: Math.min(atsCompatibilityScore + 4, 100), color: "bg-indigo-500" },
      { label: "Experience", score: Math.max(atsCompatibilityScore - 8, 45), color: atsCompatibilityScore - 8 > 75 ? "bg-indigo-500" : "bg-amber-500" },
      { label: "Formatting", score: 85, color: "bg-indigo-500" }
    ],
    myResumes: resumes.map(r => ({
      name: r.name,
      status: r.isActive ? `Active • ${new Date(r.uploadedAt).toLocaleDateString()}` : new Date(r.uploadedAt).toLocaleDateString(),
      score: r.score
    })),
    jobMatch: {
      matchPercentage: matchPercentage,
      missingSkills: missingKeywords.length > 0 ? missingKeywords : ["Docker", "AWS (Lambda/S3)", "Redix"],
      summary: `Analyzed compatibility against target parameters. ATS compatibility is ${atsCompatibilityScore}%, with a direct keyword match density of ${matchPercentage}%. Matched ${matchedKeywords.length} of ${totalRelevantKeywords} technical descriptors.`
    },
    optimizerResults: {
      rewrittenExperience,
      skillsEnhancement: matchedKeywords.concat(missingKeywords).slice(0, 4)
    }
  };

  const history = db.get('analysisHistory') || [];
  const newHistoryEntry = {
    id: history.length > 0 ? Math.max(...history.map(h => h.id)) + 1 : 1,
    resumeId: targetResume ? targetResume.id : 1,
    resumeName,
    timestamp: new Date().toISOString(),
    atsScore: atsCompatibilityScore,
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    jobTitle: jobTitle || 'Software Engineer',
    company: company || 'Target Company',
    jobDescription,
    summary: optimizationResult.jobMatch.summary,
    rewrittenExperience,
    suggestions,
    sectionScores: optimizationResult.sectionScores,
    skillsEnhancement: optimizationResult.optimizerResults.skillsEnhancement
  };

  history.unshift(newHistoryEntry);
  db.set('analysisHistory', history);

  db.set('resumeOptimizationData', {
    ...optimizationResult,
    suggestions 
  });

  if (targetResume && targetResume.isActive) {
    profile.resumeScore = atsCompatibilityScore;
    profile.resumeUpdated = `Optimized Just Now`;
    db.set('profile', profile);
    
    const updatedResumes = resumes.map(r => r.id === targetResume.id ? { ...r, score: atsCompatibilityScore } : r);
    db.set('resumes', updatedResumes);
    db.syncActiveResume();
  }

  db.save();
  res.status(201).json(newHistoryEntry);
});

// Legacy optimize route mapping
app.post('/api/resume/optimize', (req, res) => {
  req.url = '/api/analysis';
  app.handle(req, res);
});

// GET Analysis History list
app.get('/api/analysis/history', (req, res) => {
  res.json(db.get('analysisHistory') || []);
});

// GET specific analysis report
app.get('/api/analysis/history/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const history = db.get('analysisHistory') || [];
  const entry = history.find(h => h.id === id);
  if (!entry) {
    return res.status(404).json({ error: 'History record not found' });
  }
  res.json(entry);
});

// DELETE analysis history log
app.delete('/api/analysis/history/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const history = db.get('analysisHistory') || [];
  const filtered = history.filter(h => h.id !== id);
  db.set('analysisHistory', filtered);
  db.save();
  res.json({ success: true, message: `History entry ${id} deleted` });
});

// ==========================================
// RESUME VERSION MANAGEMENT API ROUTES
// ==========================================

// 1. Get all resumes
app.get('/api/resumes', (req, res) => {
  res.json(db.get('resumes') || []);
});

// 2. Upload a new resume version
app.post('/api/resumes', upload.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const resumes = db.get('resumes') || [];
  const profile = db.get('profile') || {};
  
  // Dynamic score generation based on matching name/skills
  const allSkills = [
    ...(profile.frontendSkills || []),
    ...(profile.backendSkills || []),
    ...(profile.toolsSkills || [])
  ];
  const filename = req.file.originalname.toLowerCase();
  let matches = 0;
  allSkills.forEach(s => {
    if (filename.includes(s.toLowerCase())) matches++;
  });
  const score = Math.min(Math.max(65 + matches * 5, 60), 96);

  const newResume = {
    id: resumes.length > 0 ? Math.max(...resumes.map(r => r.id)) + 1 : 1,
    name: req.file.originalname,
    filename: req.file.filename,
    uploadedAt: new Date().toISOString(),
    score: score,
    isActive: true, // Automatically set new uploads as active
    size: req.file.size
  };

  // Mark all other resumes as inactive
  const updatedResumes = resumes.map(r => ({ ...r, isActive: false }));
  updatedResumes.unshift(newResume); // Store on top

  db.set('resumes', updatedResumes);
  db.syncActiveResume();

  res.status(201).json(newResume);
});

// 3. View/stream a specific resume inline
app.get('/api/resumes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const resumes = db.get('resumes') || [];
  const resume = resumes.find(r => r.id === id);

  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const filepath = path.join(__dirname, 'uploads', resume.filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Resume file not found on disk' });
  }

  const ext = path.extname(resume.filename).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.pdf') {
    contentType = 'application/pdf';
  } else if (ext === '.docx') {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${resume.name}"`);
  
  const stream = fs.createReadStream(filepath);
  stream.pipe(res);
});

// 4. Download a resume file binary
app.get('/api/resumes/:id/download', (req, res) => {
  const id = parseInt(req.params.id);
  const resumes = db.get('resumes') || [];
  const resume = resumes.find(r => r.id === id);

  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const filepath = path.join(__dirname, 'uploads', resume.filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'Resume file not found on disk' });
  }

  res.download(filepath, resume.name);
});

// 5. Activate a resume version
app.post('/api/resumes/:id/activate', (req, res) => {
  const id = parseInt(req.params.id);
  const resumes = db.get('resumes') || [];
  const hasResume = resumes.some(r => r.id === id);

  if (!hasResume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const updatedResumes = resumes.map(r => ({
    ...r,
    isActive: r.id === id
  }));

  db.set('resumes', updatedResumes);
  db.syncActiveResume();

  res.json({ success: true, message: `Resume ${id} activated` });
});

// 6. Delete a resume version
app.delete('/api/resumes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const resumes = db.get('resumes') || [];
  const index = resumes.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const resume = resumes[index];
  const filepath = path.join(__dirname, 'uploads', resume.filename);

  // Remove local file
  if (fs.existsSync(filepath)) {
    try {
      fs.unlinkSync(filepath);
    } catch (err) {
      console.error(`Failed to delete file ${filepath}:`, err);
    }
  }

  // Remove database row
  const filtered = resumes.filter(r => r.id !== id);

  // Set previous active if active deleted
  if (resume.isActive && filtered.length > 0) {
    filtered[0].isActive = true;
  }

  db.set('resumes', filtered);
  db.syncActiveResume();

  res.json({ success: true, message: `Resume ${id} deleted` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
