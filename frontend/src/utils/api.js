const BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('authToken');
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || errBody.error || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API request to ${endpoint} failed.`, error);
    throw error;
  }
}

export const api = {
  // ── Auth ────────────────────────────────────────────────────
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  },

  // ── Dashboard ───────────────────────────────────────────────
  getDashboard: () => request('/dashboard'),

  // ── Applications ────────────────────────────────────────────
  getApplications: () => request('/applications'),
  addApplication: (app) => request('/applications', { method: 'POST', body: JSON.stringify(app) }),
  updateApplication: (id, app) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(app) }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),

  // ── Companies ───────────────────────────────────────────────
  getCompanies: () => request('/profile/followed-companies'),
  addCompany: (compName) => request('/profile/follow-company', { method: 'POST', body: JSON.stringify({ companyName: compName }) }),
  deleteCompany: (compName) => request(`/profile/follow-company/${encodeURIComponent(compName)}`, { method: 'DELETE' }),

  // ── Interviews ──────────────────────────────────────────────
  getInterviews: () => request('/interviews'),
  addInterview: (intv) => request('/interviews', { method: 'POST', body: JSON.stringify(intv) }),
  deleteInterview: (id) => request(`/interviews/${id}`, { method: 'DELETE' }),

  // ── Profile ─────────────────────────────────────────────────
  getProfile: () => request('/profile'),
  updateProfile: (profile) => request('/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // ── Resumes ─────────────────────────────────────────────────
  optimizeResume: (resumeName, jobDescription) =>
    request('/resume/optimize', { method: 'POST', body: JSON.stringify({ resumeName, jobDescription }) }),
  getResumes: () => request('/resumes'),
  uploadResume: async (formData) => {
    const token = getToken();
    const r = await fetch(`${BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!r.ok) throw new Error('File upload failed');
    return r.json();
  },
  activateResume: (id) => request(`/resumes/${id}/activate`, { method: 'PATCH' }),
  deleteResume: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),
  getDownloadUrl: (id) => `${BASE_URL}/resumes/${id}/download`,
  getViewUrl: (id) => `${BASE_URL}/resumes/${id}`,

  // ── Analysis ────────────────────────────────────────────────
  runAnalysis: (payload) => request('/analysis', { method: 'POST', body: JSON.stringify(payload) }),
  getAnalysisHistory: () => request('/analysis/history'),
  deleteAnalysisHistory: (id) => request(`/analysis/history/${id}`, { method: 'DELETE' }),

  // ── Jobs ────────────────────────────────────────────────────
  aggregateJobs: () => request('/jobs/aggregate', { method: 'POST' }),
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(query ? `/jobs?${query}` : '/jobs');
  },
  getRecommendedJobs: () => request('/jobs/recommendations'),
  getSavedJobs: () => request('/jobs/saved'),
  saveJob: (jobId) => request('/jobs/saved', { method: 'POST', body: JSON.stringify({ jobId }) }),
  unsaveJob: (jobId) => request(`/jobs/saved/${jobId}`, { method: 'DELETE' }),

  // ── Companies ───────────────────────────────────────────────
  getCompanyInfo: (name) => request(`/companies/${encodeURIComponent(name)}/info`),

  // ── Experiences ─────────────────────────────────────────────
  getExperiences: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(query ? `/experiences?${query}` : '/experiences');
  },
  createExperience: (payload) => request('/experiences', { method: 'POST', body: JSON.stringify(payload) }),
  toggleExperienceUpvote: (id) => request(`/experiences/${id}/upvote`, { method: 'POST' }),
  getTrendingCompanies: () => request('/experiences/trending'),

  // ── Notifications ───────────────────────────────────────────
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'POST' }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};
