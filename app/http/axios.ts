import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});

export const Get = async <T>(endpoint: string) => {
  const { data } = await api.get<T>(endpoint);
  console.log("🚀 ~ Get ~ data:", data)
  return data;
};

export const Post = async <T>(endpoint: string, body: any) => {
  const { data } = await api.post<T>(endpoint, body);
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