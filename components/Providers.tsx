"use client";

import React, { ReactNode } from "react";
import { BaseProvider } from "baseui";
import { StyletronProvider, styletron } from "@/lib/styletron";
import { theme } from "@/styles/theme";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StyletronProvider value={styletron}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}

export default Providers;
