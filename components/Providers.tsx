"use client";

import React, { ReactNode, useMemo } from "react";
import { BaseProvider } from "baseui";
import { useServerInsertedHTML } from "next/navigation";
import { Provider as StyletronProvider } from "styletron-react";
import { createClientEngine, createServerEngine } from "@/lib/styletron";
import { theme } from "@/styles/theme";

type StyletronSheet = { css: string; attrs: Record<string, string> };

export function Providers({ children }: { children: ReactNode }) {
  const engine = useMemo(
    () => (typeof window === "undefined" ? createServerEngine() : createClientEngine()),
    [],
  );

  useServerInsertedHTML(() => {
    const sheetsGetter = (engine as { getStylesheets?: () => StyletronSheet[] }).getStylesheets;
    if (typeof sheetsGetter !== "function") return null;
    const stylesheets = sheetsGetter() || [];
    return (
      <>
        {stylesheets.map((sheet, idx: number) => (
          <style
            key={sheet.attrs?.["data-hydrate"] || idx}
            {...sheet.attrs}
            dangerouslySetInnerHTML={{ __html: sheet.css }}
          />
        ))}
      </>
    );
  });

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={theme}>{children}</BaseProvider>
    </StyletronProvider>
  );
}

export default Providers;
