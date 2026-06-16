// In-memory cache so we don't call Gemini on every panel open
const cache = new Map();

// Try newest models first across both API versions
const ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent",
];

class CompanyInfoService {
  /** List models available for the configured API key (for debugging) */
  static async listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await res.json();
    return data;
  }

  static async getCompanyInfo(companyName) {
    const cacheKey = companyName.toLowerCase().trim();
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured in .env");

    const prompt = `You are a career research assistant. Return ONLY a raw JSON object (no markdown, no code fences, no explanation) with accurate information about the company "${companyName}" for Indian job seekers. Use this exact schema:
{
  "description": "2-3 sentence company overview",
  "industry": "e.g. Cloud Computing / Fintech / SaaS",
  "founded": "year as string e.g. 1998",
  "headquarters": "City, Country",
  "size": "e.g. 10,000-50,000 employees",
  "techStack": ["top 6 technologies the company uses"],
  "indiaPresence": ["Indian cities where they have offices, max 4, or Remote if fully remote"],
  "salaryRange": "typical SDE salary range in India in Lakhs format e.g. 18L - 40L per annum",
  "glassdoorRating": 4.2,
  "culture": "1-2 sentences on work culture",
  "whyJoin": "1-2 sentences on why a developer would want to join",
  "hiringStatus": "one of: Actively Hiring | Selectively Hiring | Limited Openings"
}`;

    let lastError = null;

    for (const url of ENDPOINTS) {
      try {
        const modelName = url.match(/models\/([^:]+)/)?.[1] ?? url;
        console.log(`⚡ Gemini [${modelName}] → ${companyName}`);

        const res = await fetch(`${url}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error(`❌ [${modelName}] ${res.status}: ${body.slice(0, 200)}`);
          lastError = `${res.status} from ${modelName}: ${body.slice(0, 200)}`;
          continue;
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          lastError = `${modelName} returned non-JSON: ${raw.slice(0, 100)}`;
          console.error("❌ No JSON in Gemini response:", raw.slice(0, 200));
          continue;
        }

        const info = JSON.parse(jsonMatch[0]);
        cache.set(cacheKey, info);
        console.log(`✅ Gemini [${modelName}] success for "${companyName}"`);
        return info;

      } catch (err) {
        console.error(`❌ Exception:`, err.message);
        lastError = err.message;
      }
    }

    throw new Error(lastError || "All Gemini models failed");
  }
}

export default CompanyInfoService;
