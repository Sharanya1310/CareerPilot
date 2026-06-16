import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';
import {
  statsData, atsData, missingSkills as fallbackMissingSkills,
  resumeOptimizationData as fallbackResumeData,
  mockTrendingCompanies, mockExperiences
} from '../mock/dashboardData';

const JOB_CATALOG = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Vercel",
    location: "Remote (US/Europe)",
    salary: "$110k - $140k",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "HTML", "CSS"],
    posted: "1 day ago"
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "Stripe",
    location: "Remote (Worldwide)",
    salary: "$130k - $160k",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Go", "Python", "Docker", "API"],
    posted: "2 days ago"
  },
  {
    id: "job-3",
    title: "Full Stack Engineer",
    company: "Linear",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL", "Next.js", "Tailwind CSS"],
    posted: "3 days ago"
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "HashiCorp",
    location: "Remote (US)",
    salary: "$125k - $155k",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions", "Terraform", "Linux"],
    posted: "5 days ago"
  },
  {
    id: "job-5",
    title: "Product Designer",
    company: "Figma",
    location: "Remote (UK/US)",
    salary: "$115k - $145k",
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems", "HTML", "CSS"],
    posted: "1 week ago"
  },
  {
    id: "job-6",
    title: "AI Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    salary: "$180k - $240k",
    skills: ["Python", "PyTorch", "TensorFlow", "Node.js", "Docker", "API", "TypeScript"],
    posted: "Recently"
  }
];

const DataContext = createContext(null);


const fallbackProfile = {
  name: "",
  email: "",
  frontendSkills: [],
  backendSkills: [],
  toolsSkills: [],
  keywords: [],
  desiredRoles: [],
  preferredLocations: [],
  workTypes: {
    remote: false,
    hybrid: false,
    onsite: false
  },
  resumeFilename: "",
  resumeScore: 0,
  resumeUpdated: ""
};

export function DataProvider({ children }) {
  const [stats, setStats] = useState(statsData);
  const [atsScore, setAtsScore] = useState(atsData);
  const [missingSkills, setMissingSkills] = useState(fallbackMissingSkills);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [apiRecsLoaded, setApiRecsLoaded] = useState(false);
  const [recentApplications, setRecentApplications] = useState([]);
  const [trackedCompanies, setTrackedCompanies] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(fallbackProfile);
  const [resumeOptimization, setResumeOptimization] = useState(fallbackResumeData);
  const [resumes, setResumes] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [experiences, setExperiences] = useState(mockExperiences);
  const [trendingCompanies, setTrendingCompanies] = useState(mockTrendingCompanies);
  
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
        const jobsList = await api.getJobs({ location: 'india' });
        setJobs(jobsList);
        const savedList = await api.getSavedJobs();
        setSavedJobs(savedList);
      } catch (jobErr) {
        console.warn("Could not sync jobs discovery data.", jobErr);
      }

      try {
        const recsData = await api.getRecommendedJobs();
        const recsList = recsData.jobs || recsData;
        if (recsList && recsList.length > 0) {
          setRecommendedJobs(recsList);
          setApiRecsLoaded(true);
        }
      } catch (recsErr) {
        console.warn("Could not sync recommended jobs. Using client-side fallback.", recsErr);
      }

      try {
        const expList = await api.getExperiences();
        setExperiences(expList);
        const trendingList = await api.getTrendingCompanies();
        setTrendingCompanies(trendingList);
      } catch (expErr) {
        console.warn("Could not sync interview experiences.", expErr);
      }

      try {
        const notifs = await api.getNotifications();
        setNotifications(notifs);
      } catch (notifErr) {
        console.warn("Could not sync notifications.", notifErr);
      }
    } catch (err) {
      console.warn("Could not sync with local API. Keeping mock UI data.", err);
    } finally {
      setLoading(false);
    }
  };

  const resetAllData = () => {
    setStats(statsData);
    setAtsScore(atsData);
    setMissingSkills(fallbackMissingSkills);
    setRecommendedJobs([]);
    setApiRecsLoaded(false);
    setRecentApplications([]);
    setTrackedCompanies([]);
    setUpcomingInterviews([]);
    setApplications([]);
    setProfile(fallbackProfile);
    setResumeOptimization(fallbackResumeData);
    setResumes([]);
    setAnalysisHistory([]);
    setNotifications([]);
    setPendingAction(null);
    setJobs([]);
    setSavedJobs([]);
    setExperiences(mockExperiences);
    setTrendingCompanies(mockTrendingCompanies);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    // Only use catalog fallback when the API hasn't returned real recommendations
    if (apiRecsLoaded) return;

    const userKeywords = (profile.keywords || []).map(s => s.toLowerCase());
    const userRoles = profile.desiredRoles || [];

    // Only recommend when the user has provided keywords or desired roles
    if (userKeywords.length === 0 && userRoles.length === 0) {
      setRecommendedJobs([]);
      return;
    }

    // All profile skills contribute to match score, but keywords are also checked
    const userSkills = [
      ...(profile.skills || []),
      ...(profile.toolsSkills || []),
      ...(profile.keywords || [])
    ].map(s => s.toLowerCase());

    const computed = JOB_CATALOG.map(job => {
      const matching = job.skills.filter(s => userSkills.includes(s.toLowerCase()));
      const calculatedMatch = job.skills.length > 0 ? Math.round((matching.length / job.skills.length) * 100) : 0;
      const titleLower = job.title.toLowerCase();
      const roleBonus = userRoles.some(r => titleLower.includes(r.toLowerCase())) ? 20 : 0;
      const match = Math.min(calculatedMatch + roleBonus, 100);
      const missingSkills = job.skills.filter(s => !userSkills.includes(s.toLowerCase()));
      return {
        ...job,
        match,
        missingSkills,
        description: `Looking for a talented ${job.title} to join our growing team. You will build and scale high-impact systems using modern technologies like ${job.skills.slice(0, 3).join(', ')}.`,
        requirements: job.skills.map(s => `Proficiency with ${s} and related technologies`),
        companyHighlights: {
          rating: "4.8",
          size: "50 - 200 people",
          industry: "Technology",
          culture: "High autonomy, design-driven",
          benefits: ["Remote OK", "Health/Dental", "Flexible Hours"]
        }
      };
    });

    const filtered = computed.filter(j => j.match > 0);
    filtered.sort((a, b) => b.match - a.match);
    setRecommendedJobs(filtered);
  }, [profile, apiRecsLoaded]);

  // Recompute dashboard stats and recent applications whenever the applications list changes
  useEffect(() => {
    if (applications.length === 0) return;

    const applied   = applications.filter(a => a.stage === 'Applied').length;
    const oa        = applications.filter(a => a.stage === 'Assessment' || a.stage === 'OA').length;
    const interview = applications.filter(a => a.stage === 'Interview').length;
    const offer     = applications.filter(a => a.stage === 'Offer').length;
    const total     = applications.length;

    setStats(prev => ({
      ...prev,
      totalApplications: {
        ...prev.totalApplications,
        count: total,
        growth: total > 0 ? '+12%' : '+0%',
      },
      activeStatus: { applied, oa, interview, offer },
      offersReceived: {
        count: offer < 10 ? `0${offer}` : `${offer}`,
        target: 5,
        percentage: Math.min(Math.round((offer / 5) * 100), 100),
        status: `${offer} offer(s) received`,
      },
    }));

    const stageColor = (stage) => {
      if (stage === 'Interview') return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      if (stage === 'Assessment' || stage === 'OA') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      if (stage === 'Offer') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    };

    const recent = [...applications]
      .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
      .slice(0, 2)
      .map(app => ({
        id: app.id || app._id,
        company: app.company,
        role: app.role,
        status: app.stage,
        color: stageColor(app.stage),
        date: app.date || (app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'),
      }));

    setRecentApplications(recent);
  }, [applications]);

  const addApplication = async (newApp) => {
    try {
      const added = await api.addApplication(newApp);
      setApplications(prev => [...prev, added]);
      return added;
    } catch (err) {
      const localAdded = {
        ...newApp,
        id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1
      };
      setApplications(prev => [...prev, localAdded]);
      return localAdded;
    }
  };

  const updateApplicationStage = async (id, newStage) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, stage: newStage } : a));
    try {
      await api.updateApplication(id, { stage: newStage });
    } catch (err) {
      // already updated optimistically — leave as-is
    }
  };

  const deleteApplication = async (id) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    try {
      await api.deleteApplication(id);
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const trackCompany = async (name) => {
    if (!trackedCompanies.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      setTrackedCompanies(prev => [...prev, { name, domain: `${name.toLowerCase()}.com`, openings: 1 }]);
    }
    try {
      await api.addCompany(name);
    } catch (err) {
      console.error("Failed to track company:", err);
    }
  };

  const untrackCompany = async (name) => {
    setTrackedCompanies(prev => prev.filter(c => c.name.toLowerCase() !== name.toLowerCase()));
    try {
      await api.deleteCompany(name);
    } catch (err) {
      console.error("Failed to untrack company:", err);
    }
  };

  const scheduleInterview = async (intv) => {
    try {
      const added = await api.addInterview(intv);
      setUpcomingInterviews(prev => [...prev, added]);
      return added;
    } catch (err) {
      const localAdded = {
        ...intv,
        id: upcomingInterviews.length > 0 ? Math.max(...upcomingInterviews.map(i => i.id)) + 1 : 1
      };
      setUpcomingInterviews(prev => [...prev, localAdded]);
      return localAdded;
    }
  };

  const deleteInterview = async (id) => {
    setUpcomingInterviews(prev => prev.filter(i => i.id !== id));
    try {
      await api.deleteInterview(id);
    } catch (err) {
      console.error("Failed to delete interview:", err);
    }
  };

  const updateProfile = async (newProfileFields) => {
    setProfile(prev => ({ ...prev, ...newProfileFields }));
    try {
      const updated = await api.updateProfile(newProfileFields);
      setProfile(updated);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
    // Reset so catalog immediately re-filters with new skills
    setApiRecsLoaded(false);
    // Then fetch fresh recommendations from the API with updated skills
    try {
      const recsData = await api.getRecommendedJobs();
      const recsList = recsData.jobs || recsData;
      if (recsList && recsList.length > 0) {
        setRecommendedJobs(recsList);
        setApiRecsLoaded(true);
      }
    } catch (recsErr) {
      console.warn("Could not refresh recommended jobs after profile update.", recsErr);
    }
  };

  const optimizeResume = async (resumeName, jobDescription) => {
    try {
      const results = await api.optimizeResume(resumeName, jobDescription);
      setResumeOptimization(results);
      return results;
    } catch (err) {
      console.error("Resume optimization failed:", err);
    }
  };

  const runAnalysis = async (payload) => {
    try {
      const result = await api.runAnalysis(payload);
      setAnalysisHistory(prev => [result, ...prev]);
      // Sync missing skills from dashboard in background.
      // Skip setAtsScore and setResumeOptimization — both would overwrite the upload-time
      // ATS circle score with the job match score from the dashboard response.
      api.getDashboard().then(dashboard => {
        if (Array.isArray(dashboard.missingSkills)) setMissingSkills(dashboard.missingSkills);
      }).catch(() => {});
      return result;
    } catch (err) {
      console.error("Analysis failed:", err);
      throw err;
    }
  };

  const deleteAnalysis = async (id) => {
    setAnalysisHistory(prev => prev.filter(e => e.id !== id));
    try {
      await api.deleteAnalysisHistory(id);
    } catch (err) {
      console.error("Failed to delete analysis entry:", err);
    }
  };

  const loadAnalysis = (entry) => {
    if (!entry) return;
    const score = entry.matchPercentage || entry.atsScore || 0;
    const missing = entry.missingKeywords || [];

    setMissingSkills(missing.slice(0, 10));

    // Only update analysis-specific fields — never touch compatibilityScore or sectionScores
    // so the ATS circle (which reflects the upload-time scan) is unaffected.
    setResumeOptimization(prev => ({
      ...prev,
      suggestions: entry.recommendations || [],
      jobMatch: {
        matchPercentage: score,
        missingSkills: missing,
        summary: entry.summary,
      },
      optimizerResults: {
        rewrittenExperience: entry.recommendations || [],
        skillsEnhancement: missing,
      },
    }));
  };

  const uploadResume = async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const uploaded = await api.uploadResume(formData);
      setResumes(prev => [uploaded, ...prev.map(r => uploaded.isActive ? { ...r, isActive: false } : r)]);
      // Always update ATS score display with the newly uploaded resume's score
      const score = uploaded.atsScore || uploaded.score || 0;
      if (score > 0) {
        setAtsScore(prev => ({ ...prev, score, trend: 'From latest resume scan' }));
        setResumeOptimization(prev => ({
          ...prev,
          compatibilityScore: score,
          percentile: uploaded.atsPercentile || Math.min(99, Math.round(score * 1.03)),
          sectionScores: uploaded.atsSectionScores ? [
            { label: 'Skills',      score: uploaded.atsSectionScores.skills      ?? 60, color: 'bg-indigo-500' },
            { label: 'Experience',  score: uploaded.atsSectionScores.experience  ?? 60, color: 'bg-amber-500'  },
            { label: 'Projects',    score: uploaded.atsSectionScores.projects    ?? 60, color: 'bg-indigo-500' },
            { label: 'Formatting',  score: uploaded.atsSectionScores.formatting  ?? 85, color: 'bg-indigo-500' },
          ] : prev.sectionScores,
        }));
      }
      return uploaded;
    } catch (err) {
      console.error("Failed to upload resume:", err);
      const localResume = {
        id: Date.now().toString(),
        name: file.name,
        uploadedAt: new Date().toISOString(),
        score: 75,
        isActive: resumes.length === 0,
        size: file.size
      };
      setResumes(prev => [localResume, ...prev.map(r => ({ ...r, isActive: false }))]);
      return localResume;
    }
  };

  const activateResume = async (id) => {
    setResumes(prev => prev.map(r => ({ ...r, isActive: r.id === id })));
    // Update atsScore and resumeOptimization from the newly activated resume immediately
    const target = resumes.find(r => String(r.id) === String(id));
    if (target) {
      const score = target.atsScore || target.score || 0;
      if (score > 0) {
        setAtsScore(prev => ({ ...prev, score, trend: 'From active resume' }));
        setResumeOptimization(prev => ({
          ...prev,
          compatibilityScore: score,
          percentile: target.atsPercentile || Math.min(99, Math.round(score * 1.03)),
          sectionScores: target.atsSectionScores ? [
            { label: 'Skills',      score: target.atsSectionScores.skills      ?? 60, color: 'bg-indigo-500' },
            { label: 'Experience',  score: target.atsSectionScores.experience  ?? 60, color: 'bg-amber-500'  },
            { label: 'Projects',    score: target.atsSectionScores.projects    ?? 60, color: 'bg-indigo-500' },
            { label: 'Formatting',  score: target.atsSectionScores.formatting  ?? 85, color: 'bg-indigo-500' },
          ] : prev.sectionScores,
        }));
      }
    }
    try {
      await api.activateResume(id);
    } catch (err) {
      console.error("Failed to activate resume:", err);
    }
  };

  const deleteResume = async (id) => {
    setResumes(prev => prev.filter(r => r.id !== id));
    try {
      await api.deleteResume(id);
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  const refreshJobs = async () => {
    try {
      const [jobsList, savedList] = await Promise.all([
        api.getJobs({ location: 'india' }),
        api.getSavedJobs(),
      ]);
      setJobs(jobsList);
      setSavedJobs(savedList);
    } catch (err) {
      console.warn('Could not refresh jobs:', err);
    }
  };

  const saveJob = async (jobId) => {
    setSavedJobs(prev => {
      const job = jobs.find(j => j.id === jobId);
      return job && !prev.some(s => s.id === jobId) ? [...prev, { ...job, isSaved: true }] : prev;
    });
    try {
      await api.saveJob(jobId);
    } catch (err) {
      console.error("Failed to save job:", err);
    }
  };

  const unsaveJob = async (jobId) => {
    setSavedJobs(prev => prev.filter(j => j.id !== jobId));
    try {
      await api.unsaveJob(jobId);
    } catch (err) {
      console.error("Failed to unsave job:", err);
    }
  };

  const addExperience = async (payload) => {
    try {
      const added = await api.createExperience(payload);
      setExperiences(prev => [added, ...prev]);
    } catch (err) {
      console.error("Failed to add experience:", err);
      throw err;
    }
  };

  const upvoteExperience = async (id) => {
    setExperiences(prev => prev.map(e =>
      e.id === id ? { ...e, upvotes: (e.upvotes || 0) + (e.hasUpvoted ? -1 : 1), hasUpvoted: !e.hasUpvoted } : e
    ));
    try {
      await api.toggleExperienceUpvote(id);
    } catch (err) {
      console.error("Failed to upvote experience:", err);
    }
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id || n._id === id ? { ...n, isRead: true } : n));
    try {
      await api.markNotificationRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    try {
      await api.deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
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
      notifications,
      unreadCount: (notifications || []).filter(n => !n.isRead).length,
      loading,
      refreshAll,
      resetAllData,
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
      refreshJobs,
      saveJob,
      unsaveJob,
      experiences,
      trendingCompanies,
      addExperience,
      upvoteExperience,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      pendingAction,
      setPendingAction,
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
