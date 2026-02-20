import { Post } from "@/app/http/axios";


export interface RegisterAuth {
  username: string;
  email: string;
  password: string;
}

export interface RegisterAuthResponse {
  message: string;
}

export const registerAuth = async (params: RegisterAuth) => {
    return await Post<RegisterAuthResponse>(`/register?`, params);
}