import axios from "axios";

const API = axios.create({ 
  baseURL: "http://127.0.0.1:8000/api/"
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    // Remove debug logs for production
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    // Remove debug logs for production
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;