// Mock data for CareerPilot AI Dashboard (exactly matching mockup design)
export const statsData = {
  totalApplications: {
    count: 42,
    growth: "+12%",
    timeline: "this month"
  },
  activeStatus: {
    applied: 42,
    oa: 26,
    interview: 15,
    offer: 5
  },
  offersReceived: {
    count: "02",
    target: 5,
    percentage: 40,
    status: "1 negotiation in progress"
  }
};

export const monthlyChartData = [
  { name: "JUL", applications: 12 },
  { name: "AUG", applications: 28 },
  { name: "SEP", applications: 35 },
  { name: "OCT", applications: 42 },
];

export const applicationStatusData = [
  { label: "Applied", count: 42, total: 42, color: "bg-indigo-500" },
  { label: "OA", count: 26, total: 42, color: "bg-[#2e3545]" },
  { label: "Interview", count: 15, total: 42, color: "bg-[#3f2f6a]" },
  { label: "Offer", count: 5, total: 42, color: "bg-emerald-500" },
];

export const atsData = {
  score: 84,
  trend: "+8 points since last update"
};

export const missingSkills = [
  "Docker",
  "AWS (Lambda/S3)",
  "Redix"
];

export const recommendedJobs = [
  { 
    id: 101, 
    title: "Full Stack Engineer", 
    company: "Stripe", 
    location: "Remote", 
    salary: "$180k - $240k", 
    match: 91, 
    tags: ["React", "Node.js", "Go"] 
  },
  { 
    id: 102, 
    title: "Backend Developer (Python)", 
    company: "Airbnb", 
    location: "San Francisco", 
    salary: "Hybrid", 
    match: 85, 
    tags: ["Python", "Django", "PostgreSQL"] 
  },
];

export const recentApplications = [
  { 
    id: 1, 
    company: "Accenture", 
    role: "Advanced Systems Engineer", 
    status: "Interview", 
    color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20", 
    date: "Oct 25" 
  },
  { 
    id: 2, 
    company: "Infosys", 
    role: "System Engineer", 
    status: "Applied", 
    color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20", 
    date: "Oct 24" 
  },
];

export const trackedCompanies = [
  { name: "Google", domain: "google.com", openings: 2 },
  { name: "Microsoft", domain: "microsoft.com", openings: 1 },
  { name: "Amazon", domain: "amazon.com", openings: 0 },
];

export const upcomingInterviews = [
  { id: 1, company: "Google", role: "L3 Backend", date: "Oct 27", time: "2:00 PM" },
  { id: 2, company: "Meta", role: "System Design", date: "Oct 29", time: "10:00 AM" },
];

// Specific mock data for Resume Optimization page
export const resumeOptimizationData = {
  compatibilityScore: 78,
  percentile: 84,
  sectionScores: [
    { label: "Skills", score: 92, color: "bg-indigo-500" },
    { label: "Projects", score: 88, color: "bg-indigo-500" },
    { label: "Experience", score: 70, color: "bg-amber-500" },
    { label: "Formatting", score: 85, color: "bg-indigo-500" },
  ],
  myResumes: [
    { name: "Senior_Dev_V2.pdf", status: "Active • Oct 24", score: 78 },
    { name: "Senior_Dev_V1.pdf", status: "Oct 12, 2026", score: 64 },
  ],
  jobMatch: {
    matchPercentage: 82,
    missingSkills: ["Cloud Security", "Terraform", "GraphQL"],
    summary: "High match for Senior roles, but missing specific Cloud Security focus and Infrastructure as Code experience required for this position."
  },
  optimizerResults: {
    rewrittenExperience: [
      "Spearheaded the development of a React-based micro-frontend architecture, resulting in a 35% improvement in build times and enhanced scalability.",
      "Optimized CI/CD pipelines using GitHub Actions, reducing deployment latency by 22% and ensuring 99.9% uptime."
    ],
    skillsEnhancement: [
      "Microservices Architecture",
      "System Design",
      "Kubernetes",
      "Cloud Native"
    ]
  }
};

// Specific mock data for Job Discovery page
export const jobDiscoveryData = {
  totalJobs: 1247,
  profileCompletion: "Complete",
  topMatches: [
    { id: 201, title: "Staff Software Engineer", company: "Google", location: "Mountain View", match: 94, logo: "bg-white text-zinc-900" },
    { id: 202, title: "Senior React Developer", company: "Microsoft", location: "Remote", match: 88, logo: "bg-blue-600 text-white" }
  ],
  premiumListings: [
    {
      id: 301,
      title: "Senior Full Stack Developer",
      company: "Google",
      team: "Cloud Platform Team",
      logo: "bg-white text-zinc-900",
      location: "Mountain View, CA (Hybrid)",
      experience: "5+ Years Exp",
      salary: "$160k - $210k",
      posted: "15h ago",
      match: 91,
      jobType: "Full Time",
      description: "Google Cloud Platform is seeking a Senior Full Stack Developer to build and maintain the next generation of developer productivity tools. You will work across the stack using React, Node.js, and Google's internal distributed systems...",
      missingSkills: ["Rust", "gRPC"],
      requirements: [
        "Expert proficiency in TypeScript and React",
        "Experience with high-performance Node.js backends",
        "Understanding of distributed system architectures"
      ]
    },
    {
      id: 302,
      title: "Software Engineer II (React/Node)",
      company: "Microsoft",
      team: "Xbox Design Team",
      logo: "bg-blue-600 text-white",
      location: "Redmond, WA (Remote)",
      experience: "3-5 Years Exp",
      salary: "$140k - $180k",
      posted: "1d ago",
      match: 88,
      jobType: "Full Time",
      description: "Microsoft's Xbox Design Team is looking for a Software Engineer II to build next-generation web platforms. You will design, develop, and test web components using React, Node.js, and Azure services...",
      missingSkills: ["Docker", "GraphQL"],
      requirements: [
        "Strong experience with React and TypeScript",
        "Proficiency in Node.js backend development",
        "Experience with Azure cloud databases and APIs"
      ]
    }
  ],
  savedRoles: [
    { name: "Cloud Architect", company: "Amazon Web Services", logo: "A", logoBg: "bg-amber-600 text-white" },
    { name: "iOS Developer", company: "Apple", logo: "Ap", logoBg: "bg-white text-zinc-900" }
  ]
};
