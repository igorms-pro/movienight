import { Client, Server } from "styletron-engine-atomic";

// Hydration for styletron when running on the client
const getHydrate = () =>
  typeof document !== "undefined"
    ? (Array.from(document.getElementsByClassName("_styletron_hydrate_")) as HTMLStyleElement[])
    : undefined;

export const styletron =
  typeof window === "undefined" ? new Server() : new Client({ hydrate: getHydrate() });
