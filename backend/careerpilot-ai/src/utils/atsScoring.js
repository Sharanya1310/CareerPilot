import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// ── Text extraction ─────────────────────────────────────────────
export async function extractText(buffer, mimetype) {
  try {
    if (mimetype === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text || "";
    }
    if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    return "";
  } catch (err) {
    console.error("[extractText] Failed to extract text from resume:", err.message);
    return "";
  }
}

// ── Section score helpers ───────────────────────────────────────
const TECH_KEYWORDS = [
  "javascript","typescript","python","java","go","rust","c++","c#","ruby","php","swift","kotlin",
  "react","angular","vue","nextjs","nodejs","express","django","flask","spring","laravel",
  "mongodb","postgresql","mysql","redis","elasticsearch","dynamodb","firebase","sql",
  "aws","azure","gcp","docker","kubernetes","terraform","ansible","jenkins","github","gitlab",
  "git","linux","bash","rest","graphql","grpc","kafka","rabbitmq","nginx","webpack","vite",
  "html","css","tailwind","bootstrap","sass","figma","jira","agile","scrum","ci/cd",
  "machine learning","deep learning","tensorflow","pytorch","pandas","numpy","spark"
];

const ACTION_VERBS = [
  "developed","built","designed","implemented","led","managed","created","improved","optimized",
  "architected","deployed","automated","increased","reduced","launched","engineered","delivered",
  "collaborated","coordinated","spearheaded","streamlined","established","maintained","mentored",
  "integrated","migrated","refactored","scaled","analyzed","researched"
];

const SECTION_HEADERS = [
  "experience","work history","employment","education","skills","projects","summary",
  "objective","certifications","achievements","publications","languages","interests"
];

function sectionScore(lower, type) {
  switch (type) {
    case "skills": {
      const found = TECH_KEYWORDS.filter(k => lower.includes(k)).length;
      return Math.min(100, 45 + found * 3);
    }
    case "experience": {
      const verbs = ACTION_VERBS.filter(v => lower.includes(v)).length;
      const metrics = (lower.match(/\d+\s*[%x]|\$\s*\d+|\d+\+?\s*(users|clients|customers|projects|apps|services|members|engineers|team)/g) || []).length;
      return Math.min(100, 38 + verbs * 3 + metrics * 4);
    }
    case "projects": {
      const words = ["project","built","developed","application","system","platform","api","service","tool","website","webapp","app"];
      const found = words.filter(k => lower.includes(k)).length;
      return Math.min(100, 48 + found * 5);
    }
    case "formatting":
      return 85;
    default:
      return 70;
  }
}

// ── Main ATS score ──────────────────────────────────────────────
export function calculateAtsScore(text) {
  if (!text || text.trim().length < 50) {
    return {
      atsScore: 62,
      atsPercentile: 65,
      atsSectionScores: { skills: 60, experience: 60, projects: 60, formatting: 85 },
    };
  }

  const lower = text.toLowerCase();

  // Contact presence (20 pts)
  const hasEmail   = /@\S+\.\S+/.test(lower) ? 6 : 0;
  const hasPhone   = /\d{3}[\s\-\.]\d{3,4}[\s\-\.]\d{4}|\+\d{10,12}/.test(lower) ? 4 : 0;
  const hasLinked  = /linkedin|github/.test(lower) ? 4 : 0;
  const contactPts = hasEmail + hasPhone + hasLinked;

  // Section headers (20 pts)
  const foundSections = SECTION_HEADERS.filter(s => lower.includes(s)).length;
  const sectionPts = Math.min(20, foundSections * 3);

  // Action verbs (20 pts)
  const verbCount = ACTION_VERBS.filter(v => lower.includes(v)).length;
  const verbPts = Math.min(20, verbCount * 2);

  // Quantifiable metrics (20 pts)
  const metricMatches = (lower.match(/\d+\s*[%x]|\$\s*\d+|\d+\+?\s*(users|clients|projects|engineers|members)/g) || []).length;
  const metricPts = Math.min(20, metricMatches * 4);

  // Tech keywords (20 pts)
  const techCount = TECH_KEYWORDS.filter(k => lower.includes(k)).length;
  const techPts = Math.min(20, techCount * 2);

  const raw = contactPts + sectionPts + verbPts + metricPts + techPts;
  const atsScore = Math.max(45, Math.min(98, raw));
  const atsPercentile = Math.min(99, Math.round(atsScore * 1.03));
  const resumeKeywords = TECH_KEYWORDS.filter(k => lower.includes(k));

  return {
    atsScore,
    atsPercentile,
    atsSectionScores: {
      skills:      sectionScore(lower, "skills"),
      experience:  sectionScore(lower, "experience"),
      projects:    sectionScore(lower, "projects"),
      formatting:  sectionScore(lower, "formatting"),
    },
    resumeKeywords,
  };
}

// ── Job match scoring ───────────────────────────────────────────
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are",
  "was","were","be","been","being","have","has","had","do","does","did","will","would","could",
  "should","may","might","must","can","this","that","these","those","we","you","they","our",
  "your","their","it","its","as","if","when","about","into","through","during","including",
  "until","against","among","throughout","despite","upon","while","also","than","then","there",
  "here","where","who","whom","which","what","how","all","both","each","few","more","most",
  "other","some","such","no","not","only","same","so","just","because","any","well","very",
  "still","after","before","between","own","under","again","further","once","above","below",
  "up","down","out","off","over","use","used","using","work","working","works","ability",
  "strong","good","great","excellent","experience","role","team","looking","seeking","candidate"
]);

function extractKeywords(text) {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s\+#\.]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
  )];
}

export function calculateJobMatch(resumeText, jobDescription) {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = resumeText.toLowerCase();

  // Weight tech terms higher — check multi-word phrases too
  const techPhrases = [
    ...TECH_KEYWORDS,
    "machine learning","deep learning","natural language processing","computer vision",
    "full stack","front end","back end","data structures","system design","object oriented",
    "functional programming","cloud computing","ci/cd pipeline","test driven development"
  ];

  // Build keyword pool: important JD words + tech terms found in JD
  const jdTechTerms = techPhrases.filter(t => jobDescription.toLowerCase().includes(t));
  const wordFreq = {};
  jdKeywords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const importantWords = jdKeywords.filter(w => wordFreq[w] >= 2 || w.length > 6).slice(0, 40);

  const allKeywords = [...new Set([...importantWords, ...jdTechTerms])].slice(0, 60);

  const matched = allKeywords.filter(kw => resumeLower.includes(kw));
  const missing = allKeywords.filter(kw => !resumeLower.includes(kw));

  const matchPercentage = allKeywords.length
    ? Math.max(5, Math.min(99, Math.round((matched.length / allKeywords.length) * 100)))
    : 0;

  // Recommendations
  const recs = [];
  if (missing.length > 0)
    recs.push(`Add these missing keywords: ${missing.slice(0, 6).join(", ")}`);
  if (!/\d+\s*[%x]/.test(resumeLower))
    recs.push("Add quantifiable achievements (e.g., 'improved performance by 35%')");
  if (ACTION_VERBS.filter(v => resumeLower.includes(v)).length < 4)
    recs.push("Use stronger action verbs like 'architected', 'spearheaded', or 'optimized'");
  if (matchPercentage < 50)
    recs.push("Tailor your Skills section to closely mirror the job description language");
  if (matchPercentage >= 75)
    recs.push("Strong match — highlight your top 3 relevant achievements in your cover letter");

  const summary =
    matchPercentage >= 80
      ? `Excellent match! Your resume covers ${matchPercentage}% of the job requirements. Focus on highlighting key achievements.`
      : matchPercentage >= 60
      ? `Good match at ${matchPercentage}%. Adding missing keywords and metrics will boost your ATS ranking.`
      : matchPercentage >= 40
      ? `Moderate match at ${matchPercentage}%. Tailor your resume more closely to this role for better results.`
      : `Low match at ${matchPercentage}%. Consider customizing your resume significantly for this position.`;

  return {
    matchPercentage,
    missingKeywords: missing.slice(0, 15),
    matchedKeywords: matched.slice(0, 15),
    recommendations: recs,
    summary,
  };
}
