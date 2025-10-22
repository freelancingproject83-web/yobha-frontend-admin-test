import axios from "axios";
import { LocalStorageKeys } from "../constants/localStorageKeys";

const apiClient = axios.create({
  baseURL: "https://backend.yobha.world/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LocalStorageKeys.AuthToken);
    console.log("Axios Interceptor - Token from localStorage:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios Interceptor - Authorization header set");
    } else {
      console.log("Axios Interceptor - No token found");
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const Get = async (url, params = {}, config = {}) => {
  const response = await apiClient.get(url, { params, ...config });
  return response;
};

export const Post = async (url, data = {}, config = {}) => {
  const response = await apiClient.post(url, data, config);
  return response;
};

export const Put = async (url, data = {}, config = {}) => {
  const response = await apiClient.put(url, data, config);
  return response;
};

export const Patch = async (url, data = {}, config = {}) => {
  const response = await apiClient.patch(url, data, config);
  return response;
};

export const Delete = async (url, config = {}) => {
  const response = await apiClient.delete(url, config);
  return response;
};

export default apiClient;
