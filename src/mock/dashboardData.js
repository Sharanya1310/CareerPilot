export const statsData = {
  totalApplications: {
    count: 142,
    growth: "+12.4%",
    timeline: "vs last month"
  },
  activeStatus: {
    applied: 64,
    oa: 18,
    interview: 8
  },
  offersReceived: {
    count: 3,
    target: 5,
    percentage: 60
  }
};

export const applicationStatusData = [
  { label: "Applied", count: 64, total: 90, color: "bg-blue-500" },
  { label: "Online Assessment", count: 18, total: 90, color: "bg-amber-500" },
  { label: "Interviewing", count: 8, total: 90, color: "bg-indigo-500" },
  { label: "Offers", count: 3, total: 90, color: "bg-emerald-500" }
];

export const monthlyChartData = [
  { name: "Jan", applications: 12 },
  { name: "Feb", applications: 19 },
  { name: "Mar", applications: 32 },
  { name: "Apr", applications: 26 },
  { name: "May", applications: 45 },
  { name: "Jun", applications: 58 }
];

export const atsData = {
  score: 84,
  trend: "+4 points dynamic adjustment"
};

export const missingSkills = ["Docker", "AWS Lambda", "Redis", "GraphQL", "Kubernetes"];

export const recommendedJobs = [
  { id: 1, title: "Full Stack Engineer", company: "Vercel", salary: "$140k - $180k", match: 96 },
  { id: 2, title: "Backend Developer", company: "Linear", salary: "$150k - $190k", match: 92 },
  { id: 3, title: "Frontend Platform Engineer", company: "Stripe", salary: "$160k - $210k", match: 89 }
];

export const recentApplications = [
  { id: 1, company: "Google", role: "Software Engineer III", status: "Interview", date: "Jun 08, 2026", color: "text-indigo-400 bg-indigo-500/10" },
  { id: 2, company: "Supabase", role: "Full Stack Engineer", status: "OA Completed", date: "Jun 06, 2026", color: "text-amber-400 bg-amber-500/10" },
  { id: 3, company: "Figma", role: "Product Engineer", status: "Applied", date: "Jun 04, 2026", color: "text-blue-400 bg-blue-500/10" },
  { id: 4, company: "Netflix", role: "Senior Distributed Systems", status: "Rejected", date: "May 28, 2026", color: "text-zinc-500 bg-zinc-500/10" }
];

export const upcomingInterviews = [
  { id: 1, company: "Google", type: "Technical Round 2", date: "Jun 12, 2026", time: "10:00 AM" },
  { id: 2, company: "Stripe", type: "System Design", date: "Jun 15, 2026", time: "2:30 PM" }
];

export const trackedCompanies = [
  { name: "Google", status: "Actively Hiring", openings: 14, domain: "google.com" },
  { name: "Microsoft", status: "Hiring Paused", openings: 0, domain: "microsoft.com" },
  { name: "Amazon", status: "Actively Hiring", openings: 32, domain: "amazon.com" }
];