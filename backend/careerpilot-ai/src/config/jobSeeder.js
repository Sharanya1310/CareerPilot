import Job from "../models/Job.js";

const seedJobs = async () => {
  try {
    const count = await Job.countDocuments();
    if (count > 0) {
      console.log("ℹ️  Jobs collection already seeded. Skipping.");
      return;
    }

    const jobs = [
      {
        title: "Senior Full Stack Developer",
        company: "Google",
        team: "Cloud Platform Team",
        logo: "G",
        logoBg: "bg-white text-zinc-900",
        location: "Mountain View, CA (Hybrid)",
        experience: "5+ Years Exp",
        salary: "$160k - $210k",
        posted: "15h ago",
        jobType: "Full Time",
        workType: "Hybrid",
        description: "Google Cloud Platform is seeking a Senior Full Stack Developer to build and maintain the next generation of developer productivity tools. You will work across the stack using React, Node.js, and Google's internal distributed systems.",
        requirements: [
          "Expert proficiency in TypeScript and React",
          "Experience with high-performance Node.js backends",
          "Understanding of distributed system architectures"
        ],
        skills: ["TypeScript", "React", "Node.js", "Docker", "Rust", "gRPC"],
        companyHighlights: {
          rating: 4.6,
          size: "100,000+ employees",
          industry: "Technology / Cloud",
          culture: "Engineering excellence, high autonomy",
          benefits: ["Unlimited PTO", "Free meals", "Top-tier health insurance", "Generous stock grants"]
        },
        isPremium: true
      },
      {
        title: "Software Engineer II (React/Node)",
        company: "Microsoft",
        team: "Xbox Design Team",
        logo: "M",
        logoBg: "bg-blue-600 text-white",
        location: "Redmond, WA (Remote)",
        experience: "3-5 Years Exp",
        salary: "$140k - $180k",
        posted: "1d ago",
        jobType: "Full Time",
        workType: "Remote",
        description: "Microsoft's Xbox Design Team is looking for a Software Engineer II to build next-generation web platforms. You will design, develop, and test web components using React, Node.js, and Azure services.",
        requirements: [
          "Strong experience with React and TypeScript",
          "Proficiency in Node.js backend development",
          "Experience with Azure cloud databases and APIs"
        ],
        skills: ["TypeScript", "React", "Node.js", "Azure", "Docker", "GraphQL"],
        companyHighlights: {
          rating: 4.4,
          size: "200,000+ employees",
          industry: "Technology / Gaming",
          culture: "Diverse, collaborative, structured growth",
          benefits: ["Health savings account", "Xbox Game Pass ultimate", "Gym allowance", "401k match"]
        },
        isPremium: true
      },
      {
        title: "Staff Software Engineer",
        company: "Google",
        team: "Core Search Group",
        logo: "G",
        logoBg: "bg-white text-zinc-900",
        location: "Mountain View, CA",
        experience: "8+ Years Exp",
        salary: "$220k - $280k",
        posted: "2d ago",
        jobType: "Full Time",
        workType: "On-site",
        description: "Google is seeking a Staff Software Engineer to lead architectural efforts for our core search engineering group, driving high throughput indexing designs.",
        requirements: [
          "8+ years of software design and system architecture",
          "Expertise in distributed systems design",
          "Experience leading technical direction for large developer teams"
        ],
        skills: ["Go", "Distributed Systems", "C++", "Java", "Kubernetes", "AWS"],
        companyHighlights: {
          rating: 4.6,
          size: "100,000+ employees",
          industry: "Technology / Search",
          culture: "Innovation and scale",
          benefits: ["Unlimited PTO", "On-site wellness centers", "Free transport shuttle", "Retirement program"]
        },
        isPremium: false
      },
      {
        title: "Senior React Developer",
        company: "Microsoft",
        team: "Xbox Design Team",
        logo: "M",
        logoBg: "bg-blue-600 text-white",
        location: "Redmond, WA (Remote)",
        experience: "5+ Years Exp",
        salary: "$150k - $190k",
        posted: "2d ago",
        jobType: "Full Time",
        workType: "Remote",
        description: "Microsoft Xbox Design Team is seeking a Senior React Developer to craft experiences for Xbox web portals.",
        requirements: [
          "5+ years React and Frontend architecture",
          "Expertise with Redux/State-management",
          "Modern CSS and layout engineering"
        ],
        skills: ["React", "TypeScript", "Redux", "CSS", "Tailwind", "Node.js"],
        companyHighlights: {
          rating: 4.4,
          size: "200,000+ employees",
          industry: "Technology / Gaming",
          culture: "Diverse and structured",
          benefits: ["Comprehensive medical", "Product discounts", "Flexible spending accounts", "401k match"]
        },
        isPremium: false
      },
      {
        title: "Full Stack Engineer",
        company: "Stripe",
        team: "Billing Infrastructure",
        logo: "S",
        logoBg: "bg-[#635bff] text-white",
        location: "Remote (USA)",
        experience: "3+ Years Exp",
        salary: "$180k - $240k",
        posted: "3d ago",
        jobType: "Full Time",
        workType: "Remote",
        description: "Stripe is building infrastructure for the internet economy. Join us to scale payment interfaces and billing APIs used by millions of SaaS apps.",
        requirements: [
          "Strong software design fundamentals and architecture knowledge",
          "Expertise in React, Node, and Ruby/Go",
          "Experience building scalable cloud APIs"
        ],
        skills: ["React", "Node.js", "Go", "Ruby", "AWS", "Kubernetes"],
        companyHighlights: {
          rating: 4.5,
          size: "8,000+ employees",
          industry: "Fintech",
          culture: "Rigorous engineering, design-centric",
          benefits: ["Remote first culture", "Learning stipend", "Work from home budget", "Top medical & dental"]
        },
        isPremium: false
      },
      {
        title: "Backend Developer (Python)",
        company: "Airbnb",
        team: "Search & Relevancy",
        logo: "A",
        logoBg: "bg-[#ff5a5f] text-white",
        location: "San Francisco, CA (Hybrid)",
        experience: "3+ Years Exp",
        salary: "Competitive",
        posted: "4d ago",
        jobType: "Full Time",
        workType: "Hybrid",
        description: "Airbnb is looking for a backend engineer to optimize search and recommendation algorithms in Python, scaling databases to handle massive request bursts.",
        requirements: [
          "Strong experience with Python and Django/Flask",
          "Experience with PostgreSQL databases",
          "Knowledge of search relevancy systems"
        ],
        skills: ["Python", "Django", "PostgreSQL", "AWS", "Redis"],
        companyHighlights: {
          rating: 4.3,
          size: "6,000+ employees",
          industry: "Travel / Marketplace",
          culture: "Belonging, highly creative",
          benefits: ["Travel credits ($2k/yr)", "Comprehensive wellness", "Paid volunteer time", "Great office food"]
        },
        isPremium: false
      }
    ];

    await Job.insertMany(jobs);
    console.log(`✅ Seeded ${jobs.length} jobs into the database successfully.`);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error.message);
  }
};

export default seedJobs;
