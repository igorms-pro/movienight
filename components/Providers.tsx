"use client";

import React, { ReactNode, useMemo } from "react";
import { BaseProvider } from "baseui";
import { Provider as StyletronProvider } from "styletron-react";
import { createStyletronEngine } from "@/lib/styletron";
import { theme } from "@/styles/theme";

export function Providers({ children }: { children: ReactNode }) {
  // Create appropriate engine: Server for SSR, Client for browser
  const engine = useMemo(() => createStyletronEngine(), []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}

export default Providers;
