import { Get } from "@/app/http/axios";


export interface UserProfile {
    id: number;
    username: string;
    role: string;
    created_at: string;
}

export const getUserProfile = async (id: number) => {
  const params = new URLSearchParams();
  params.append("id", id.toString());
  return await Get<UserProfile>(`/users/${id}`);
};