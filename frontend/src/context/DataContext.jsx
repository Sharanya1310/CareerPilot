import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';
import { 
  statsData, atsData, missingSkills as fallbackMissingSkills,
  recommendedJobs as fallbackJobs, recentApplications as fallbackRecent,
  trackedCompanies as fallbackCompanies, upcomingInterviews as fallbackInterviews,
  resumeOptimizationData as fallbackResumeData, jobDiscoveryData
} from '../mock/dashboardData';

const DataContext = createContext(null);

const fallbackApplications = [
  {
    id: 1,
    company: "Linear",
    role: "Senior Product Designer",
    stage: "Applied",
    category: "Product Design",
    date: "Oct 12",
    deadline: "2d left",
    timeline: "Applied on Oct 12"
  },
  {
    id: 2,
    company: "Vercel",
    role: "Frontend Engineer",
    stage: "Applied",
    category: "Engineering",
    date: "Oct 14",
    deadline: "5d left",
    timeline: "Applied on Oct 14"
  },
  {
    id: 3,
    company: "Datadog",
    role: "Backend Systems Eng",
    stage: "Assessment",
    category: "Hackerrank",
    date: "Oct 10",
    deadline: "Expires in 18h",
    timeline: "Assessment scheduled"
  },
  {
    id: 4,
    company: "Stripe",
    role: "Full Stack Developer",
    stage: "Interview",
    category: "Technical Round",
    date: "Tomorrow",
    deadline: "Tomorrow",
    interviewer: "Sarah K.",
    link: "#join",
    timeline: "Interview set for Tomorrow"
  }
];

const fallbackProfile = {
  name: "Sharanya Singh",
  email: "sharanya@email.com",
  frontendSkills: ['React', 'TypeScript', 'Tailwind'],
  backendSkills: ['Node.js', 'Express.js', 'MongoDB', 'Java'],
  toolsSkills: ['Git', 'Docker'],
  desiredRoles: ["Full Stack Developer", "Frontend Developer"],
  preferredLocations: ['Bangalore', 'Pune', 'Hyderabad', 'Remote'],
  workTypes: {
    remote: true,
    hybrid: true,
    onsite: false
  },
  resumeFilename: "FullStack_Resume.pdf",
  resumeScore: 84,
  resumeUpdated: "2 days ago"
};

export function DataProvider({ children }) {
  const [stats, setStats] = useState(statsData);
  const [atsScore, setAtsScore] = useState(atsData);
  const [missingSkills, setMissingSkills] = useState(fallbackMissingSkills);
  const [recommendedJobs, setRecommendedJobs] = useState(fallbackJobs);
  const [recentApplications, setRecentApplications] = useState(fallbackRecent);
  const [trackedCompanies, setTrackedCompanies] = useState(fallbackCompanies);
  const [upcomingInterviews, setUpcomingInterviews] = useState(fallbackInterviews);
  const [applications, setApplications] = useState(fallbackApplications);
  const [profile, setProfile] = useState(fallbackProfile);
  const [resumeOptimization, setResumeOptimization] = useState(fallbackResumeData);
  const [resumes, setResumes] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [jobs, setJobs] = useState([
    ...(jobDiscoveryData.topMatches || []),
    ...(jobDiscoveryData.premiumListings || [])
  ]);
  const [savedJobs, setSavedJobs] = useState(
    (jobDiscoveryData.savedRoles || []).map((role, idx) => ({
      id: `saved-${idx}`,
      title: role.name,
      company: role.company,
      logo: role.logo,
      logoBg: role.logoBg,
      match: 85,
      isSaved: true
    }))
  );
  
  const [loading, setLoading] = useState(true);

  const refreshAll = async () => {
    try {
      setLoading(true);
      const dashboard = await api.getDashboard();
      const apps = await api.getApplications();
      const prof = await api.getProfile();
      const resumesList = await api.getResumes();

      setStats(dashboard.stats);
      setAtsScore(dashboard.atsScore);
      setMissingSkills(dashboard.missingSkills);
      setRecommendedJobs(dashboard.recommendedJobs);
      setRecentApplications(dashboard.recentApplications);
      setTrackedCompanies(dashboard.trackedCompanies);
      setUpcomingInterviews(dashboard.upcomingInterviews);
      if (dashboard.resumeOptimizationData) {
        setResumeOptimization(dashboard.resumeOptimizationData);
      }
      
      setApplications(apps);
      setProfile(prof);
      setResumes(resumesList);
      
      try {
        const historyList = await api.getAnalysisHistory();
        setAnalysisHistory(historyList);
      } catch (historyErr) {
        console.warn("Could not sync analysis history.", historyErr);
      }

      try {
        const jobsList = await api.getJobs();
        setJobs(jobsList);
        const savedList = await api.getSavedJobs();
        setSavedJobs(savedList);
      } catch (jobErr) {
        console.warn("Could not sync jobs discovery data.", jobErr);
      }
    } catch (err) {
      console.warn("Could not sync with local API. Keeping mock UI data.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const addApplication = async (newApp) => {
    try {
      const added = await api.addApplication(newApp);
      // Refresh to pull updated stats & recent lists dynamically calculated by the backend!
      await refreshAll();
      return added;
    } catch (err) {
      // Offline fallback mutation
      const localAdded = {
        ...newApp,
        id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1
      };
      setApplications([...applications, localAdded]);
      return localAdded;
    }
  };

  const updateApplicationStage = async (id, newStage) => {
    try {
      const updated = await api.updateApplication(id, { stage: newStage });
      await refreshAll();
      return updated;
    } catch (err) {
      // Offline fallback mutation
      const updatedList = applications.map(a => a.id === id ? { ...a, stage: newStage } : a);
      setApplications(updatedList);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.deleteApplication(id);
      await refreshAll();
    } catch (err) {
      // Offline fallback mutation
      setApplications(applications.filter(a => a.id !== id));
    }
  };

  const trackCompany = async (name) => {
    try {
      await api.addCompany(name);
      await refreshAll();
    } catch (err) {
      // Offline fallback mutation
      if (!trackedCompanies.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        setTrackedCompanies([
          ...trackedCompanies,
          { name, domain: `${name.toLowerCase()}.com`, openings: 1 }
        ]);
      }
    }
  };

  const untrackCompany = async (name) => {
    try {
      await api.deleteCompany(name);
      await refreshAll();
    } catch (err) {
      // Offline fallback mutation
      setTrackedCompanies(trackedCompanies.filter(c => c.name.toLowerCase() !== name.toLowerCase()));
    }
  };

  const scheduleInterview = async (intv) => {
    try {
      const added = await api.addInterview(intv);
      await refreshAll();
      return added;
    } catch (err) {
      // Offline fallback mutation
      const localAdded = {
        ...intv,
        id: upcomingInterviews.length > 0 ? Math.max(...upcomingInterviews.map(i => i.id)) + 1 : 1
      };
      setUpcomingInterviews([...upcomingInterviews, localAdded]);
      return localAdded;
    }
  };

  const deleteInterview = async (id) => {
    try {
      await api.deleteInterview(id);
      await refreshAll();
    } catch (err) {
      // Offline fallback mutation
      setUpcomingInterviews(upcomingInterviews.filter(i => i.id !== id));
    }
  };

  const updateProfile = async (newProfileFields) => {
    try {
      const updated = await api.updateProfile(newProfileFields);
      setProfile(updated);
    } catch (err) {
      // Offline fallback mutation
      setProfile(prev => ({ ...prev, ...newProfileFields }));
    }
  };

  const optimizeResume = async (resumeName, jobDescription) => {
    try {
      const results = await api.optimizeResume(resumeName, jobDescription);
      setResumeOptimization(results);
      await refreshAll(); // update profile scores & dashboard lists
      return results;
    } catch (err) {
      console.error("Resume optimization failed:", err);
    }
  };

  const runAnalysis = async (payload) => {
    try {
      const result = await api.runAnalysis(payload);
      await refreshAll();
      return result;
    } catch (err) {
      console.error("Analysis failed:", err);
      throw err;
    }
  };

  const deleteAnalysis = async (id) => {
    try {
      await api.deleteAnalysisHistory(id);
      await refreshAll();
    } catch (err) {
      console.error("Failed to delete analysis history entry:", err);
    }
  };

  const loadAnalysis = (entry) => {
    if (!entry) return;
    setResumeOptimization({
      compatibilityScore: entry.atsScore,
      percentile: Math.min(Math.round(entry.atsScore * 1.02), 99),
      sectionScores: entry.sectionScores || [
        { label: "Skills", score: Math.min(entry.atsScore + 6, 100), color: "bg-indigo-500" },
        { label: "Projects", score: Math.min(entry.atsScore + 4, 100), color: "bg-indigo-500" },
        { label: "Experience", score: Math.max(entry.atsScore - 8, 45), color: entry.atsScore - 8 > 75 ? "bg-indigo-500" : "bg-amber-500" },
        { label: "Formatting", score: 85, color: "bg-indigo-500" }
      ],
      suggestions: entry.suggestions || [],
      jobMatch: {
        matchPercentage: entry.matchPercentage,
        missingSkills: entry.missingKeywords || [],
        summary: entry.summary
      },
      optimizerResults: {
        rewrittenExperience: entry.rewrittenExperience || [],
        skillsEnhancement: entry.skillsEnhancement || []
      },
      myResumes: resumes.map(r => ({
        name: r.name,
        status: r.isActive ? `Active • ${new Date(r.uploadedAt).toLocaleDateString()}` : new Date(r.uploadedAt).toLocaleDateString(),
        score: r.score
      }))
    });
  };

  const uploadResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const uploaded = await api.uploadResume(formData);
      await refreshAll();
      return uploaded;
    } catch (err) {
      console.error("Failed to upload resume:", err);
      // Offline fallback
      const localResume = {
        id: resumes.length > 0 ? Math.max(...resumes.map(r => r.id)) + 1 : 1,
        name: file.name,
        uploadedAt: new Date().toISOString(),
        score: 75,
        isActive: true,
        size: file.size
      };
      setResumes([localResume, ...resumes.map(r => ({ ...r, isActive: false }))]);
      return localResume;
    }
  };

  const activateResume = async (id) => {
    try {
      await api.activateResume(id);
      await refreshAll();
    } catch (err) {
      console.error("Failed to activate resume:", err);
      // Offline fallback
      setResumes(resumes.map(r => ({ ...r, isActive: r.id === id })));
    }
  };

  const deleteResume = async (id) => {
    try {
      await api.deleteResume(id);
      await refreshAll();
    } catch (err) {
      console.error("Failed to delete resume:", err);
      // Offline fallback
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  const saveJob = async (jobId) => {
    try {
      await api.saveJob(jobId);
      await refreshAll();
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  const unsaveJob = async (jobId) => {
    try {
      await api.unsaveJob(jobId);
      await refreshAll();
    } catch (err) {
      console.error("Failed to unsave job:", err);
    }
  };

  return (
    <DataContext.Provider value={{
      stats,
      atsScore,
      missingSkills,
      recommendedJobs,
      recentApplications,
      trackedCompanies,
      upcomingInterviews,
      applications,
      profile,
      resumeOptimization,
      resumes,
      analysisHistory,
      loading,
      refreshAll,
      addApplication,
      updateApplicationStage,
      deleteApplication,
      trackCompany,
      untrackCompany,
      scheduleInterview,
      deleteInterview,
      updateProfile,
      optimizeResume,
      runAnalysis,
      deleteAnalysis,
      loadAnalysis,
      uploadResume,
      activateResume,
      deleteResume,
      jobs,
      savedJobs,
      saveJob,
      unsaveJob
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
