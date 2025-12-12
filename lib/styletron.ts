import { Client, Server } from "styletron-engine-atomic";

/**
 * Create appropriate Styletron engine based on environment
 * - Server engine for SSR (supports getStylesheets for extracting CSS)
 * - Client engine for browser (supports hydration)
 */
export const createStyletronEngine = () => {
  if (typeof window === "undefined") {
    // SSR: use Server engine
    return new Server();
  }
  // Client: use Client engine
  return new Client();
};
