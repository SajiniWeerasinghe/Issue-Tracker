// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,

  // Issue endpoints
  ISSUES: `${API_BASE_URL}/api/issues`,
  ISSUE: (id) => `${API_BASE_URL}/api/issues/${id}`,
};

export default API_BASE_URL;
