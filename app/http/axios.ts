import axios from "axios";

const ACCESS_TOKEN_KEY = "auth_token";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export const Get = async <T>(endpoint: string) => {
  const { data } = await api.get<T>(endpoint);
  console.log("🚀 ~ Get ~ data:", data);
  return data;
};

export const Post = async <T>(endpoint: string, body: any) => {
  const { data } = await api.post<T>(endpoint, body);
  return data;
};

export const PostFormData = async <T>(endpoint: string, formData: FormData) => {
  const { data } = await api.post<T>(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const Put = async <T>(endpoint: string, body: any) => {
  const { data } = await api.put<T>(endpoint, body);
  return data;
};

export const Patch = async <T>(endpoint: string, body: any) => {
  const { data } = await api.patch<T>(endpoint, body);
  return data;
};

export const Delete = async <T>(endpoint: string) => {
  const { data } = await api.delete<T>(endpoint);
  return data;
};

export default api;