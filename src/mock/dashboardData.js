// Mock data for CareerPilot AI Dashboard cleared of mock items
export const statsData = {
  totalApplications: {
    count: 0,
    growth: "+0%",
    timeline: "this month"
  },
  activeStatus: {
    applied: 0,
    oa: 0,
    interview: 0,
    offer: 0
  },
  offersReceived: {
    count: "00",
    target: 5,
    percentage: 0,
    status: "0 offer(s) received"
  }
};

export const monthlyChartData = [];

export const applicationStatusData = [
  { label: "Applied", count: 0, total: 0, color: "bg-indigo-500" },
  { label: "OA", count: 0, total: 0, color: "bg-[#2e3545]" },
  { label: "Interview", count: 0, total: 0, color: "bg-[#3f2f6a]" },
  { label: "Offer", count: 0, total: 0, color: "bg-emerald-500" },
];

export const atsData = {
  score: 0,
  trend: "No data"
};

export const missingSkills = [];

export const recommendedJobs = [];
export const recentApplications = [];
export const trackedCompanies = [];
export const upcomingInterviews = [];

// Specific mock data for Resume Optimization page
export const resumeOptimizationData = {
  compatibilityScore: 0,
  percentile: 0,
  sectionScores: [
    { label: "Skills", score: 0, color: "bg-indigo-500" },
    { label: "Projects", score: 0, color: "bg-indigo-500" },
    { label: "Experience", score: 0, color: "bg-amber-500" },
    { label: "Formatting", score: 0, color: "bg-indigo-500" },
  ],
  myResumes: [],
  jobMatch: {
    matchPercentage: 0,
    missingSkills: [],
    summary: ""
  },
  optimizerResults: {
    rewrittenExperience: [],
    skillsEnhancement: []
  }
};

export const jobDiscoveryData = { topMatches: [], premiumListings: [], savedRoles: [] };