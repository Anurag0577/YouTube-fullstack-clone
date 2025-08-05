// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: `${API_BASE_URL}/api/auth/signup`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    },
    UPLOAD: {
        SINGLE_IMAGE: `${API_BASE_URL}/api/upload/image/single`,
        MULTIPLE_IMAGES: `${API_BASE_URL}/api/upload/image/multiple`,
        AVATAR: `${API_BASE_URL}/api/upload/avatar`,
        VIDEO: `${API_BASE_URL}/api/upload/video`,
    },
    USER: {
        PROFILE: `${API_BASE_URL}/api/users`,
    },
    VIDEOS: {
        BASE: `${API_BASE_URL}/api/videos`,
    },
    DASHBOARD: {
        ANALYTICS: `${API_BASE_URL}/api/dashboard/analytics`,
        VIDEOS: `${API_BASE_URL}/api/dashboard/videos`,
        CHANNEL: `${API_BASE_URL}/api/dashboard/channel`,
    }
};

export default API_BASE_URL; 