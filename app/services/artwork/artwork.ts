import { Get, PostFormData } from "@/app/http/axios";


export interface ArtWork {
  image_url: string | Blob | undefined;
  width: any;
  size: any;
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
};

export interface UploadArtworkParams {
  title: string;
  caption: string;
  image: File;
}

export interface UploadArtworkResponse {
  message: string;
  artwork?: ArtWork;
}

export const uploadArtwork = async (params: UploadArtworkParams) => {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("caption", params.caption);
  formData.append("image", params.image);

  return await PostFormData<UploadArtworkResponse>("/artworks", formData);
};