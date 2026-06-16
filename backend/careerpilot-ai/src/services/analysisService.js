import Analysis from "../models/Analysis.js";
import Resume from "../models/Resume.js";
import AppError from "../utils/AppError.js";
import { calculateJobMatch } from "../utils/atsScoring.js";

const sectionColor = (score) =>
  score >= 75 ? "bg-indigo-500" : score >= 55 ? "bg-amber-500" : "bg-red-500";

export const createAnalysis = async (userId, resumeId, jobDescription, jobTitle = "", company = "") => {
  // Fetch resume with extracted text
  const resume = await Resume.findOne({ _id: resumeId, user: userId }).select("+extractedText");
  if (!resume) throw new AppError("Resume not found.", 404);

  const text = resume.extractedText || "";
  const { matchPercentage, missingKeywords, matchedKeywords, recommendations, summary } =
    calculateJobMatch(text, jobDescription);

  const ss = resume.atsSectionScores || {};
  const sectionScores = [
    { label: "Skills",      score: ss.skills      ?? 60, color: sectionColor(ss.skills ?? 60) },
    { label: "Experience",  score: ss.experience  ?? 60, color: sectionColor(ss.experience ?? 60) },
    { label: "Projects",    score: ss.projects    ?? 60, color: sectionColor(ss.projects ?? 60) },
    { label: "Formatting",  score: ss.formatting  ?? 85, color: sectionColor(ss.formatting ?? 85) },
  ];

  // Persist job-match scores back to the Resume — deliberately NOT touching atsScore
  // so the upload-time ATS scan result is preserved on the dashboard widget.
  await Resume.findByIdAndUpdate(resumeId, {
    jobMatchScore: matchPercentage,
    missingSkills: missingKeywords.slice(0, 10),
    matchSummary:  summary,
    aiOptimizedContent: {
      skillsEnhancement: missingKeywords,
      rewrittenExperience: recommendations,
    },
  });

  const analysis = await Analysis.create({
    user:    userId,
    resume:  resumeId,
    resumeName:     resume.title,
    jobTitle:       jobTitle,
    company:        company,
    jobDescription: jobDescription,
    matchPercentage,
    atsScore:       matchPercentage,
    missingKeywords,
    matchedKeywords,
    recommendations,
    sectionScores,
    summary,
  });

  return formatAnalysis(analysis);
};

export const getAnalysisHistory = async (userId) => {
  const list = await Analysis.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
  return list.map(formatAnalysis);
};

export const deleteAnalysis = async (userId, analysisId) => {
  const entry = await Analysis.findOne({ _id: analysisId, user: userId });
  if (!entry) throw new AppError("Analysis entry not found.", 404);
  await entry.deleteOne();
};

export const formatAnalysis = (a) => ({
  id:              a._id,
  resumeId:        a.resume,
  resumeName:      a.resumeName,
  jobTitle:        a.jobTitle,
  company:         a.company,
  jobDescription:  a.jobDescription,
  matchPercentage: a.matchPercentage,
  atsScore:        a.atsScore,
  missingKeywords: a.missingKeywords,
  matchedKeywords: a.matchedKeywords,
  recommendations: a.recommendations,
  sectionScores:   a.sectionScores,
  summary:         a.summary,
  timestamp:       a.createdAt,
});
