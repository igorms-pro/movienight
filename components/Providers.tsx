"use client";

import React, { ReactNode, useMemo } from "react";
import { BaseProvider } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { Client } from "styletron-engine-atomic";
import { theme } from "@/styles/theme";

export function Providers({ children }: { children: ReactNode }) {
  // Create a simple client engine that works both on server and client
  // During SSR, we pass empty hydrate array which is fine
  const engine = useMemo(() => new Client({ hydrate: [] }), []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}

export default Providers;
