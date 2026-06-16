import Job from "../models/Job.js";

class JobAggregationService {
  /**
   * Aggregate all sources and store normalized jobs in the Job collection.
   * Called once on startup when DB has no external jobs, or manually via /api/jobs/aggregate.
   */
  static async aggregateAllSources() {
    let totalAdded = 0;

    try {
      console.log("🔄 Starting Job Aggregation (all sources)...");

      const [remotiveJobs, adzunaJobs, joobleJobs, theMuseJobs, arbeitnowJobs, remoteOkJobs] = await Promise.all([
        this.fetchRemotiveJobs().catch(e => { console.error("❌ Remotive:", e.message); return []; }),
        this.fetchAdzunaJobs().catch(e => { console.error("❌ Adzuna:", e.message); return []; }),
        this.fetchJoobleJobs().catch(e => { console.error("❌ Jooble:", e.message); return []; }),
        this.fetchTheMuse().catch(e => { console.error("❌ TheMuse:", e.message); return []; }),
        this.fetchArbeitnow().catch(e => { console.error("❌ Arbeitnow:", e.message); return []; }),
        this.fetchRemoteOK().catch(e => { console.error("❌ RemoteOK:", e.message); return []; }),
      ]);

      const allJobs = [
        ...remotiveJobs, ...adzunaJobs, ...joobleJobs,
        ...theMuseJobs, ...arbeitnowJobs, ...remoteOkJobs
      ].filter(this._isIndiaEligible);
      console.log(`ℹ️ Total parsed (India-eligible): ${allJobs.length}. De-duplicating...`);

      for (const jobData of allJobs) {
        if (!jobData.externalId || !jobData.source) continue;
        const exists = await Job.findOne({ source: jobData.source, externalId: jobData.externalId });
        if (!exists) {
          await Job.create(jobData);
          totalAdded++;
        } else if (jobData.url && !exists.url) {
          await Job.updateOne({ _id: exists._id }, { url: jobData.url });
        }
      }

      console.log(`✅ Aggregation done. Added ${totalAdded} new jobs.`);
    } catch (err) {
      console.error("❌ aggregateAllSources error:", err);
    }

    return totalAdded;
  }

  /**
   * Fetch fresh jobs from multiple sources using user's skills/roles as keywords.
   * Called on-demand for resume-based recommendations.
   */
  static async fetchJobsBySkills(skills = [], roles = []) {
    const keywords = [...skills.slice(0, 4), ...roles.slice(0, 2)].join(" ").trim();
    if (!keywords) return [];

    console.log(`⚡ Skill-based India fetch: "${keywords}"`);

    const [jSearchJobs, adzunaJobs, joobleJobs] = await Promise.all([
      this.fetchJSearch(skills, roles).catch(() => []),
      this._fetchAdzunaIndia(keywords).catch(() => []),
      this._fetchJoobleIndia(keywords).catch(() => []),
    ]);

    return [...jSearchJobs, ...adzunaJobs, ...joobleJobs].filter(this._isIndiaEligible);
  }

  static _isIndiaEligible(job) {
    return (job.location || '').toLowerCase().includes('india');
  }

  static async _fetchAdzunaIndia(keywords) {
    const appId  = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey || appId === "your_adzuna_app_id") return [];

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(keywords)}&where=india`;
    console.log(`⚡ Adzuna India (skills): "${keywords}"`);
    const res = await fetch(url);
    if (!res.ok) return [];

    const { results: rawJobs = [] } = await res.json();
    return rawJobs.map(job => ({
      title:       job.title,
      company:     job.company?.display_name || "Company",
      team:        "Engineering",
      logo:        (job.company?.display_name || "A").substring(0, 1).toUpperCase(),
      logoBg:      "bg-[#002f6c] text-white",
      location:    job.location?.display_name || "India",
      experience:  "3+ Years Exp",
      salary:      this._inrFromRaw(job.salary_min, job.salary_max),
      posted:      this.calculateAgoLabel(new Date(job.created)),
      jobType:     job.contract_time === "full_time" ? "Full Time" : "Contract",
      workType:    "Hybrid",
      description: this.cleanHtml(job.description),
      requirements: ["Relevant experience for the role", "Strong problem-solving skills"],
      skills:      keywords.split(" ").filter(Boolean).slice(0, 5),
      companyHighlights: {
        rating: 4.1, size: "1,000+ employees", industry: "Technology",
        culture: "Collaborative", benefits: ["Health insurance", "PTO", "Learning budget"],
      },
      url:        job.redirect_url || "",
      isPremium:  false,
      source:     "Adzuna",
      externalId: job.id.toString(),
    }));
  }

  static async _fetchJoobleIndia(keywords) {
    const apiKey = process.env.JOOBLE_API_KEY;
    if (!apiKey || apiKey === "your_jooble_api_key") return [];

    const url = `https://jooble.org/api/${apiKey}`;
    console.log(`⚡ Jooble India (skills): "${keywords}"`);
    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ keywords, location: "India", page: 1 }),
    });
    if (!res.ok) return [];

    const { jobs: rawJobs = [] } = await res.json();
    return rawJobs.map((job, idx) => ({
      title:       job.title,
      company:     job.company || "Company",
      team:        "Software Engineering",
      logo:        (job.company || "J").substring(0, 1).toUpperCase(),
      logoBg:      "bg-blue-800 text-white",
      location:    job.location || "India",
      experience:  "2-4 Years Exp",
      salary:      this._toINR(job.salary) || "Competitive",
      posted:      job.updated ? this.calculateAgoLabel(new Date(job.updated)) : "Recently",
      jobType:     "Full Time",
      workType:    (job.location || "").toLowerCase().includes("remote") ? "Remote" : "Hybrid",
      description: this.cleanHtml(job.snippet),
      requirements: ["B.S. in Computer Science or equivalent", "Relevant experience in the stack"],
      skills:      keywords.split(" ").filter(Boolean).slice(0, 5),
      companyHighlights: {
        rating: 4.0, size: "500+ employees", industry: "Technology",
        culture: "Tech-focused", benefits: ["Health insurance", "Flexible PTO", "Learning budget"],
      },
      url:        job.link || "",
      isPremium:  false,
      source:     "Jooble",
      externalId: job.id ? job.id.toString() : `jooble-skill-${idx}-${Date.now()}`,
    }));
  }

  // ─── Remotive (Public, no key) ────────────────────────────────────────────

  static async fetchRemotiveJobs() {
    return this._fetchRemotiveKeywords("");
  }

  static async _fetchRemotiveKeywords(keywords = "") {
    const base = "https://remotive.com/api/remote-jobs";
    const url  = keywords
      ? `${base}?search=${encodeURIComponent(keywords)}&limit=20`
      : `${base}?limit=12`;

    console.log(`⚡ Remotive: "${keywords || "general"}"`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Remotive ${res.status}`);

    const { jobs: rawJobs = [] } = await res.json();
    return rawJobs.map(job => {
      const skills = [...(job.tags || []), job.category].filter(Boolean).map(t => t.trim());
      return {
        title:       job.title,
        company:     job.company_name,
        team:        "Remote Tech Team",
        logo:        job.company_name.substring(0, 1).toUpperCase(),
        logoBg:      "bg-zinc-800 text-white",
        location:    (job.candidate_required_location || '').toLowerCase().includes('india') ? job.candidate_required_location : null,
        experience:  job.title.toLowerCase().includes("senior") ? "5+ Years Exp" : "2+ Years Exp",
        salary:      this._toINR(job.salary) || "Competitive",
        posted:      this.calculateAgoLabel(new Date(job.publication_date)),
        jobType:     job.job_type === "full_time" ? "Full Time" : "Contract",
        workType:    "Remote",
        description: this.cleanHtml(job.description),
        requirements: [
          "Familiarity with technologies listed under skills",
          "Strong async communication for remote collaboration",
        ],
        skills:      skills.length > 0 ? skills.slice(0, 6) : ["JavaScript", "Node.js"],
        companyHighlights: {
          rating: 4.2, size: "50-200 employees", industry: "Technology",
          culture: "Remote-first", benefits: ["Flexible hours", "Remote stipend", "Health reimbursement"],
        },
        url:        job.url || "",
        isPremium:  false,
        source:     "Remotive",
        externalId: job.id.toString(),
      };
    });
  }

  // ─── The Muse (Public, no key) ────────────────────────────────────────────

  static async fetchTheMuse() {
    const url = "https://www.themuse.com/api/public/jobs?category=Software%20Engineer&location=India&page=0&count=20&descending=true";
    console.log("⚡ Fetching from The Muse (India)...");

    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`The Muse ${res.status}`);

    const { results: rawJobs = [] } = await res.json();
    return rawJobs.map(job => {
      const location  = job.locations?.[0]?.name || "India";
      const level     = job.levels?.[0]?.name || "Mid Level";
      const company   = job.company?.name || "The Muse Partner";
      const category  = job.categories?.[0]?.name || "Software Engineer";
      const isSenior  = level.toLowerCase().includes("senior") || level.toLowerCase().includes("lead");

      return {
        title:       job.name,
        company,
        team:        category,
        logo:        company.substring(0, 1).toUpperCase(),
        logoBg:      "bg-indigo-700 text-white",
        location,
        experience:  isSenior ? "5+ Years Exp" : "2+ Years Exp",
        salary:      "Competitive",
        posted:      job.publication_date ? this.calculateAgoLabel(new Date(job.publication_date)) : "Recently",
        jobType:     "Full Time",
        workType:    location.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
        description: `${company} is hiring a ${job.name} (${category}). This is an open role at a leading company — visit The Muse to read the full job description and apply.`,
        requirements: [
          `${level} position — relevant experience in ${category} required`,
          "Strong communication and ability to work in a collaborative team environment",
        ],
        skills:      ["JavaScript", "React", "Node.js", "TypeScript"],
        companyHighlights: {
          rating:   4.3,
          size:     "500+ employees",
          industry: "Technology",
          culture:  "Mission-driven, collaborative",
          benefits: ["Health & Dental", "Flexible PTO", "Learning budget"],
        },
        url:        job.refs?.landing_page || "",
        isPremium:  false,
        source:     "TheMuse",
        externalId: job.id.toString(),
      };
    });
  }

  // ─── Arbeitnow — skipped (European jobs only, not India) ─────────────────
  static async fetchArbeitnow() { return []; }

  // ─── RemoteOK — skipped (worldwide remote, not India-specific) ──────────
  static async fetchRemoteOK() { return []; }

  // ─── JSearch via RapidAPI (Free tier 500 req/mo — MOST COMPREHENSIVE) ────
  // Aggregates LinkedIn, Indeed, Glassdoor, ZipRecruiter results in one call.

  static async fetchJSearch(skills = [], roles = []) {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey || apiKey === "your_rapidapi_key") {
      console.log("⚠️ RAPIDAPI_KEY not set — skipping JSearch (LinkedIn/Indeed/Glassdoor).");
      return [];
    }

    const query  = ([...roles.slice(0, 2), ...skills.slice(0, 3)].join(" ").trim() || "software engineer") + " india";
    const url    = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&date_posted=week&country=in`;

    console.log(`⚡ JSearch (LinkedIn+Indeed+Glassdoor): "${query}"`);

    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key":  apiKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });
    if (!res.ok) throw new Error(`JSearch ${res.status}`);

    const { data: rawJobs = [] } = await res.json();

    return rawJobs.slice(0, 15).map(job => {
      const salary = this._inrFromRaw(job.job_min_salary, job.job_max_salary);

      const city     = job.job_city || "";
      const state    = job.job_state || "";
      const location = job.job_is_remote ? "Remote" : [city, state].filter(Boolean).join(", ") || "US";
      const company  = job.employer_name || "Unknown Company";

      return {
        title:       job.job_title,
        company,
        team:        job.job_employment_type === "FULLTIME" ? "Full-Time Engineering" : "Contract",
        logo:        company.substring(0, 1).toUpperCase(),
        logoBg:      "bg-blue-700 text-white",
        location,
        experience:  job.job_title.toLowerCase().includes("senior") || job.job_title.toLowerCase().includes("staff")
          ? "5+ Years Exp" : "2+ Years Exp",
        salary,
        posted:      job.job_posted_at_timestamp
          ? this.calculateAgoLabel(new Date(job.job_posted_at_timestamp * 1000))
          : "Recently",
        jobType:     job.job_employment_type === "FULLTIME" ? "Full Time" : "Contract",
        workType:    job.job_is_remote ? "Remote" : "Hybrid",
        description: this.cleanHtml(job.job_description || ""),
        requirements: (job.job_highlights?.Qualifications || [
          "Relevant engineering experience for the role",
          "Strong problem-solving and communication skills",
        ]).slice(0, 4),
        skills:      (job.job_required_skills || ["JavaScript", "Python", "SQL"]).slice(0, 6),
        companyHighlights: {
          rating:   4.0,
          size:     "1,000+ employees",
          industry: "Technology",
          culture:  "High performance, data-driven",
          benefits: (job.job_highlights?.Benefits || ["Health insurance", "401k", "PTO"]).slice(0, 3),
        },
        url:        job.job_apply_link || job.job_google_link || "",
        isPremium:  false,
        source:     "JSearch",
        externalId: job.job_id,
      };
    });
  }

  // ─── Adzuna (Needs ADZUNA_APP_ID + ADZUNA_APP_KEY) ───────────────────────

  static async fetchAdzunaJobs() {
    const appId  = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey || appId === "your_adzuna_app_id" || appKey === "your_adzuna_app_key") {
      console.log("⚠️ Adzuna credentials missing — skipping.");
      return [];
    }

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=developer&where=india`;
    console.log("⚡ Fetching from Adzuna...");

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Adzuna ${res.status}`);

    const { results: rawJobs = [] } = await res.json();
    return rawJobs.map(job => {
      const salary = this._inrFromRaw(job.salary_min, job.salary_max);

      return {
        title:       job.title,
        company:     job.company?.display_name || "Unknown Company",
        team:        "Product Development",
        logo:        (job.company?.display_name || "A").substring(0, 1).toUpperCase(),
        logoBg:      "bg-[#002f6c] text-white",
        location:    job.location?.display_name || "US (Hybrid)",
        experience:  "3+ Years Exp",
        salary,
        posted:      this.calculateAgoLabel(new Date(job.created)),
        jobType:     job.contract_time === "full_time" ? "Full Time" : "Contract",
        workType:    job.title.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
        description: this.cleanHtml(job.description),
        requirements: [
          "Proven engineering track record in developer technologies",
          "Solid problem-solving and relational database experience",
        ],
        skills:      ["React", "JavaScript", "TypeScript", "Node.js", "SQL"],
        companyHighlights: {
          rating:   4.1,
          size:     "1,000+ employees",
          industry: "Professional Services",
          culture:  "Collaborative, agile engineering sprints",
          benefits: ["Dental & Vision", "401(k) Matching", "Paid Family Leave"],
        },
        url:        job.redirect_url || "",
        isPremium:  false,
        source:     "Adzuna",
        externalId: job.id.toString(),
      };
    });
  }

  // ─── Jooble (Needs JOOBLE_API_KEY) ───────────────────────────────────────

  static async fetchJoobleJobs() {
    const apiKey = process.env.JOOBLE_API_KEY;

    if (!apiKey || apiKey === "your_jooble_api_key") {
      console.log("⚠️ Jooble API key missing — skipping.");
      return [];
    }

    const url = `https://jooble.org/api/${apiKey}`;
    console.log("⚡ Fetching from Jooble...");

    const res = await fetch(url, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ keywords: "software engineer", location: "India", page: 1 }),
    });
    if (!res.ok) throw new Error(`Jooble ${res.status}`);

    const { jobs: rawJobs = [] } = await res.json();
    return rawJobs.map((job, idx) => ({
      title:       job.title,
      company:     job.company || "Jooble Enterprise Partner",
      team:        "Software Engineering Division",
      logo:        (job.company || "J").substring(0, 1).toUpperCase(),
      logoBg:      "bg-blue-800 text-white",
      location:    job.location || "Remote / Hybrid",
      experience:  "2-4 Years Exp",
      salary:      this._toINR(job.salary) || "Competitive",
      posted:      job.updated ? this.calculateAgoLabel(new Date(job.updated)) : "Just now",
      jobType:     "Full Time",
      workType:    (job.location || "").toLowerCase().includes("remote") ? "Remote" : "Hybrid",
      description: this.cleanHtml(job.snippet),
      requirements: [
        "B.S. in Computer Science or equivalent technical degree",
        "Familiarity with cloud hosting services (AWS or Azure)",
      ],
      skills:      ["React", "Node.js", "Python", "Cloud Platform", "NoSQL"],
      companyHighlights: {
        rating:   4.0, size: "500-1,000 employees", industry: "Technology Services",
        culture:  "Results-oriented, tech-focused",
        benefits: ["Health savings account", "Flexible PTO", "Learning budget"],
      },
      url:        job.link || "",
      isPremium:  false,
      source:     "Jooble",
      externalId: job.id ? job.id.toString() : `jooble-${idx}-${Date.now()}`,
    }));
  }

  // ─── Helper Utilities ─────────────────────────────────────────────────────

  static cleanHtml(html) {
    if (!html) return "";
    return html
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  static calculateAgoLabel(date) {
    const diffDays = Math.ceil(Math.abs(new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1)  return "1d ago";
    if (diffDays > 30) return `${Math.round(diffDays / 30)}mo ago`;
    return `${diffDays}d ago`;
  }

  static _toINR(salary = "") {
    if (!salary || salary === "Competitive" || salary.includes("₹")) return salary || "Competitive";
    const USD = 83, EUR = 90;
    const usd = salary.match(/\$\s*([\d,.]+)\s*k?\s*[-–]\s*\$\s*([\d,.]+)\s*k?/i);
    if (usd) {
      let lo = parseFloat(usd[1].replace(/,/g, "")), hi = parseFloat(usd[2].replace(/,/g, ""));
      if (/k/i.test(salary)) { lo *= 1000; hi *= 1000; }
      return `₹${Math.round(lo * USD / 100000)}L - ₹${Math.round(hi * USD / 100000)}L`;
    }
    const eur = salary.match(/€\s*([\d,.]+)\s*k?\s*[-–]\s*€\s*([\d,.]+)\s*k?/i);
    if (eur) {
      let lo = parseFloat(eur[1].replace(/,/g, "")), hi = parseFloat(eur[2].replace(/,/g, ""));
      if (/k/i.test(salary)) { lo *= 1000; hi *= 1000; }
      return `₹${Math.round(lo * EUR / 100000)}L - ₹${Math.round(hi * EUR / 100000)}L`;
    }
    return salary;
  }

  static _inrFromRaw(min, max) {
    if (!min || !max) return "Competitive";
    return `₹${Math.round(min / 100000)}L - ₹${Math.round(max / 100000)}L`;
  }

}

export default JobAggregationService;
