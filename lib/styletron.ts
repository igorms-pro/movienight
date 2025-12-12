import { Client, Server } from "styletron-engine-atomic";

const getHydrate = () =>
  typeof document !== "undefined"
    ? (Array.from(document.getElementsByClassName("_styletron_hydrate_")) as HTMLStyleElement[])
    : [];

export const createClientEngine = () => new Client({ hydrate: getHydrate() });
export const createServerEngine = () => new Server();
