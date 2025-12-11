import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const language = process.env.NEXT_PUBLIC_TMDB_LANG ?? "fr-FR";

if (!apiKey && process.env.E2E_MOCK !== "1") {
  throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY env variable for TMDB client");
}

export const tmdbClient: AxiosInstance = axios.create({
  baseURL,
  params: {
    api_key: apiKey,
    language,
  },
  timeout: 12_000,
});

export async function request<T>(url: string, config?: AxiosRequestConfig) {
  const { data } = await tmdbClient.get<T>(url, config);
  return data;
}

export const tmdbLanguage = language;
