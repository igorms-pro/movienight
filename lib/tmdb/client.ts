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
  try {
    const { data } = await tmdbClient.get<T>(url, config);
    return data;
  } catch (error) {
    // Structured error logging for TMDB API failures
    const isDev = process.env.NODE_ENV === "development";
    const errorContext = {
      url,
      baseURL,
      params: config?.params,
      timestamp: new Date().toISOString(),
    };

    if (axios.isAxiosError(error)) {
      const logData = {
        ...errorContext,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.message,
        code: error.code,
      };

      // Log full error details in development only
      if (isDev) {
        console.error("[TMDB API Error]", logData);
      } else {
        // Production: minimal logging to avoid exposing sensitive data
        console.error("[TMDB API Error]", {
          url,
          status: error.response?.status,
          timestamp: errorContext.timestamp,
        });
      }
    } else {
      // Non-Axios errors (network, timeout, etc.)
      const logData = {
        ...errorContext,
        error: error instanceof Error ? error.message : "Unknown error",
      };

      if (isDev) {
        console.error("[TMDB Request Failed]", logData);
      } else {
        console.error("[TMDB Request Failed]", {
          url,
          timestamp: errorContext.timestamp,
        });
      }
    }

    // Re-throw to maintain existing error handling behavior
    throw error;
  }
}

export const tmdbLanguage = language;
