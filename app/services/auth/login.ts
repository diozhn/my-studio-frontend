import { Post } from "@/app/http/axios";

export interface LoginAuth {
  // Pode ser email ou username, dependendo do backend;
  // por ora usamos `email`, mas o campo pode aceitar ambos.
  email: string;
  password: string;
}

export interface LoginAuthResponse {
  message: string;
  is_superuser: boolean;
  token: string;
  refresh_token: string;
}

export const loginAuth = async (params: LoginAuth) => {
  return await Post<LoginAuthResponse>(`/login?`, params);
};