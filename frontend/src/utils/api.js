const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`API request to ${endpoint} failed. Using frontend local fallback.`, error);
    throw error; // Re-throw so context can handle fallback
  }
}

export const api = {
  getDashboard: () => request('/dashboard'),
  
  getApplications: () => request('/applications'),
  addApplication: (app) => request('/applications', { method: 'POST', body: JSON.stringify(app) }),
  updateApplication: (id, app) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(app) }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
  
  getCompanies: () => request('/profile/followed-companies'),
  addCompany: (compName) => request('/profile/follow-company', { method: 'POST', body: JSON.stringify({ companyName: compName }) }),
  deleteCompany: (compName) => request(`/profile/follow-company/${encodeURIComponent(compName)}`, { method: 'DELETE' }),
  
  getInterviews: () => request('/interviews'),
  addInterview: (intv) => request('/interviews', { method: 'POST', body: JSON.stringify(intv) }),
  deleteInterview: (id) => request(`/interviews/${id}`, { method: 'DELETE' }),
  
  getProfile: () => request('/profile'),
  updateProfile: (profile) => request('/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  
  optimizeResume: (resumeName, jobDescription) => request('/resume/optimize', { 
    method: 'POST', 
    body: JSON.stringify({ resumeName, jobDescription }) 
  }),
  
  getResumes: () => request('/resumes'),
  uploadResume: (formData) => fetch(`${BASE_URL}/resumes`, {
    method: 'POST',
    body: formData
  }).then(r => {
    if (!r.ok) throw new Error("File upload failed");
    return r.json();
  }),
  activateResume: (id) => request(`/resumes/${id}/activate`, { method: 'POST' }),
  deleteResume: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),
  getDownloadUrl: (id) => `${BASE_URL}/resumes/${id}/download`,
  getViewUrl: (id) => `${BASE_URL}/resumes/${id}`,
  
  // Analysis engine endpoints
  runAnalysis: (payload) => request('/analysis', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getAnalysisHistory: () => request('/analysis/history'),
  deleteAnalysisHistory: (id) => request(`/analysis/history/${id}`, { method: 'DELETE' }),

  // Job discovery endpoints
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(query ? `/jobs?${query}` : '/jobs');
  },
  getRecommendedJobs: () => request('/jobs/recommendations'),
  getSavedJobs: () => request('/jobs/saved'),
  saveJob: (jobId) => request('/jobs/saved', { method: 'POST', body: JSON.stringify({ jobId }) }),
  unsaveJob: (jobId) => request(`/jobs/saved/${jobId}`, { method: 'DELETE' })
};

