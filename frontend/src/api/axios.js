import axios from "axios";

const api = axios.create({ // creating an instance of axios
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// 🔹 Add accessToken to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle expired token & retry request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new token
        const res = await axios.post(
          "http://localhost:3000/api/auth/newAccessToken",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update header for this request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // optional logout
      }
    }

    return Promise.reject(error);
  }
);

export default api;
