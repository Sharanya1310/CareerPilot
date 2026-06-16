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

export const mockTrendingCompanies = [
  { name: "Google", count: 18, bg: "bg-[#ea4335]/15 text-[#ea4335]", dotColor: "bg-[#ea4335]", logo: "G" },
  { name: "Amazon", count: 14, bg: "bg-[#ff9900]/15 text-[#ff9900]", dotColor: "bg-[#ff9900]", logo: "A" },
  { name: "Microsoft", count: 12, bg: "bg-[#00a4ef]/15 text-[#00a4ef]", dotColor: "bg-[#00a4ef]", logo: "M" },
  { name: "Stripe", count: 9, bg: "bg-[#635bff]/15 text-[#635bff]", dotColor: "bg-[#635bff]", logo: "S" },
  { name: "Meta", count: 11, bg: "bg-[#0668e1]/15 text-[#0668e1]", dotColor: "bg-[#0668e1]", logo: "M" }
];

export const mockExperiences = [
  {
    id: "exp-1",
    company: "Google",
    role: "Software Engineer Intern",
    outcome: "Selected",
    difficulty: "Hard",
    tags: ["#Algorithms", "#DataStructures", "#Internship"],
    description: "The interview process was very structured. There were 2 technical phone screens focusing on trees and dynamic programming.",
    rounds: [
      { title: "Round 1: Technical Screening", focus: "Binary trees traversal and tree coloring algorithms." },
      { title: "Round 2: Technical Deep Dive", focus: "Dynamic programming optimization on a grid path finding problem." }
    ],
    prepTips: [
      "Review dynamic programming thoroughly on LeetCode",
      "Focus on explaining your thought process out loud",
      "Practise write-ups with time complexity analysis"
    ]
  },
  {
    id: "exp-2",
    company: "Amazon",
    role: "Front-End Engineer (FEE)",
    outcome: "Selected",
    difficulty: "Medium",
    tags: ["#React", "#JavaScript", "#SystemDesign"],
    description: "A 4-round loop consisting of 1 CSS/HTML deep dive, 2 coding rounds in JavaScript/React, and 1 frontend system design round.",
    rounds: [
      { title: "Round 1: JavaScript Coding", focus: "Implement custom array functions and bounce/throttle behavior." },
      { title: "Round 2: React Framework", focus: "Build a highly responsive search dropdown component on-the-fly." },
      { title: "Round 3: Frontend System Design", focus: "Architect a large scale real-time chat application layout." },
      { title: "Round 4: Leadership Principles", focus: "Deep dive behavioral questions based on Amazon's 16 Leadership Principles." }
    ],
    prepTips: [
      "Deeply understand JavaScript event loop and closures",
      "Prepare STAR-format stories for Amazon's 16 Leadership Principles",
      "Practise clean React component design under time constraints"
    ]
  },
  {
    id: "exp-3",
    company: "Microsoft",
    role: "Cloud Support Engineer",
    outcome: "Selected",
    difficulty: "Medium",
    tags: ["#Azure", "#Networking", "#Troubleshooting"],
    description: "Technical assessments focused on operating systems, networking fundamentals (TCP/IP, DNS), and Azure cloud services.",
    rounds: [
      { title: "Round 1: Troubleshooting Scenario", focus: "Diagnose a connection failure between a VM and an SQL Database in Azure." },
      { title: "Round 2: Networking & OS Foundations", focus: "Deep dive on HTTP codes, DNS resolution steps, and Linux permissions." }
    ],
    prepTips: [
      "Understand cloud security groups and subnets",
      "Be confident in command-line network debugging tools",
      "Practise active listening during customer-scenario roleplay"
    ]
  }
];

