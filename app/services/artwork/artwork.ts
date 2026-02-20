import { Get } from "@/app/http/axios";


export interface ArtWork {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  likes: number;
  user_id: number;
  created_at: string;
}

export interface ArtworksFilters {
  title?: string;
  author?: string;
  from?: string;
  to?: string;
  sort?: "likes_desc" | "likes_asc" | "created_asc" | "created_desc";
  page?: number;
  limit?: number;
}

export interface ArtworksResponse {
  page: number;
  limit: number;
  results: ArtWork[];
  count: number;
}

export const getArtworks = async (filters: ArtworksFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  return await Get<ArtworksResponse>(`/artworks?${params.toString()}`);
}