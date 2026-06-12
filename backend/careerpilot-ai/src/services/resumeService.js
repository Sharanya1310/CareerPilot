import Resume from "../models/Resume.js";
import AppError from "../utils/AppError.js";
import { deleteFromCloudinary } from "../config/upload.js";

const formatUploadedDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const buildInitialAnalysis = () => ({
  atsScore: 78,
  atsPercentile: 84,
  atsSectionScores: {
    skills: 92,
    projects: 88,
    experience: 70,
    formatting: 85,
  },
  jobMatchScore: 0,
  missingSkills: [],
  matchSummary: "",
  aiOptimizedContent: {
    rewrittenExperience: [],
    skillsEnhancement: [],
  },
});

const buildJobMatchAnalysis = () => ({
  jobMatchScore: 82,
  missingSkills: ["Cloud Security", "Terraform", "GraphQL"],
  matchSummary:
    "High match for Senior roles, but missing specific Cloud Security focus and Infrastructure as Code experience required for this position.",
  aiOptimizedContent: {
    rewrittenExperience: [
      "Spearheaded the development of a React-based micro-frontend architecture, resulting in a 35% improvement in build times and enhanced scalability.",
      "Optimized CI/CD pipelines using GitHub Actions, reducing deployment latency by 22% and ensuring 99.9% uptime.",
    ],
    skillsEnhancement: [
      "Microservices Architecture",
      "System Design",
      "Kubernetes",
      "Cloud Native",
    ],
  },
});

export const formatResumeItem = (resume) => {
  const uploadedAt = formatUploadedDate(resume.createdAt);
  const status = resume.isActive ? `Active • ${uploadedAt}` : uploadedAt;

  return {
    id: resume._id,
    title: resume.title,
    fileName: resume.fileName,
    fileUrl: resume.fileUrl,
    fileType: resume.fileType,
    fileSize: resume.fileSize,
    isActive: resume.isActive,
    uploadedAt: resume.createdAt,
    status,
    atsScore: resume.atsScore,
  };
};

export const formatOptimizationPayload = (resumes, activeResume) => {
  const active = activeResume || resumes[0] || null;

  return {
    activeResumeId: active?._id || null,
    atsScore: active?.atsScore ?? 0,
    atsPercentile: active?.atsPercentile ?? 0,
    atsSectionScores: active?.atsSectionScores ?? {
      skills: 0,
      projects: 0,
      experience: 0,
      formatting: 0,
    },
    jobMatchScore: active?.jobMatchScore ?? 0,
    missingSkills: active?.missingSkills ?? [],
    matchSummary: active?.matchSummary ?? "",
    aiOptimizedContent: active?.aiOptimizedContent ?? {
      rewrittenExperience: [],
      skillsEnhancement: [],
    },
    resumes: resumes.map(formatResumeItem),
    uploadConstraints: {
      maxFileSizeBytes: 5 * 1024 * 1024,
      maxFileSizeLabel: "5MB",
      allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      allowedExtensions: [".pdf", ".doc", ".docx"],
    },
  };
};

export const getUserResumes = async (userId) => {
  return Resume.find({ user: userId }).sort({ isActive: -1, createdAt: -1 });
};

export const getActiveResume = async (userId) => {
  return Resume.findOne({ user: userId, isActive: true });
};

export const getResumeById = async (userId, resumeId) => {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }
  return resume;
};

export const createResume = async (userId, file) => {
  if (!file) {
    throw new AppError("Resume file is required.", 400);
  }

  const existingCount = await Resume.countDocuments({ user: userId });
  const shouldActivate = existingCount === 0;

  if (shouldActivate) {
    await Resume.updateMany({ user: userId }, { $set: { isActive: false } });
  }

  const analysis = buildInitialAnalysis();

  const resume = await Resume.create({
    user: userId,
    title: file.originalname,
    fileName: file.originalname,
    fileUrl: file.path,
    fileType: file.mimetype,
    fileSize: file.size,
    cloudinaryPublicId: file.filename || "",
    isActive: shouldActivate,
    ...analysis,
  });

  return resume;
};

export const setActiveResume = async (userId, resumeId) => {
  const resume = await getResumeById(userId, resumeId);

  await Resume.updateMany({ user: userId }, { $set: { isActive: false } });
  resume.isActive = true;
  await resume.save();

  return resume;
};

export const analyzeResumeForJob = async (userId, jobDescription) => {
  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length < 20) {
    throw new AppError("A job description of at least 20 characters is required.", 400);
  }

  const activeResume = await getActiveResume(userId);
  if (!activeResume) {
    throw new AppError("Upload a resume before analyzing a job description.", 404);
  }

  const analysis = buildJobMatchAnalysis();

  activeResume.jobMatchScore = analysis.jobMatchScore;
  activeResume.missingSkills = analysis.missingSkills;
  activeResume.matchSummary = analysis.matchSummary;
  activeResume.aiOptimizedContent = analysis.aiOptimizedContent;
  await activeResume.save();

  return activeResume;
};

export const deleteResume = async (userId, resumeId) => {
  const resume = await getResumeById(userId, resumeId);
  const wasActive = resume.isActive;

  if (resume.cloudinaryPublicId) {
    await deleteFromCloudinary(resume.cloudinaryPublicId);
  }

  await resume.deleteOne();

  if (wasActive) {
    const nextResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
    if (nextResume) {
      nextResume.isActive = true;
      await nextResume.save();
    }
  }

  return resume;
};
