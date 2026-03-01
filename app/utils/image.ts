import { API_BASE_URL } from "@/app/http/axios";

/**
 * Constrói a URL completa de uma imagem a partir do caminho relativo retornado pelo backend
 * @param imagePath - Caminho relativo da imagem (ex: /uploads/arquivo.jpg) ou URL completa
 * @returns URL completa da imagem
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "";
  }

  // Se já for uma URL completa (http:// ou https://), retorna como está
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove barra inicial duplicada se necessário
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  // Remove barra final da base URL se houver
  const baseUrl = API_BASE_URL.endsWith("/") 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;

  return `${baseUrl}${cleanPath}`;
}

