// Client-only GSAP helpers to avoid SSR issues
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once per client
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
const isTestEnv =
  typeof process !== "undefined" && (process.env.VITEST || process.env.NODE_ENV === "test");
const gsapRegistry = gsap as unknown as {
  plugins?: Record<string, unknown>;
  core?: { globals?: Record<string, unknown> };
};
const hasScrollTrigger =
  !!gsapRegistry.plugins?.ScrollTrigger || !!gsapRegistry.core?.globals?.ScrollTrigger;
if (isBrowser && !isTestEnv && !hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimateOptions = {
  delay?: number;
  stagger?: number;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars | false };
};

export function useGsapFromTo(
  targets: gsap.TweenTarget | gsap.TweenTarget[],
  {
    delay = 0,
    stagger = 0.05,
    from = { autoAlpha: 0, y: 24 },
    to = { autoAlpha: 1, y: 0 },
  }: AnimateOptions = {},
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isTestEnv) return;
    // Ensure ScrollTrigger is registered on client
    let registered = hasScrollTrigger;
    try {
      if (!registered) {
        gsap.registerPlugin(ScrollTrigger);
        registered = true;
      }
    } catch {
      return;
    }
    if (!registered) return;
    // Resolve refs -> DOM nodes
    const elements = (
      gsap.utils.toArray(targets as gsap.TweenTarget) as Array<
        Element | { current?: Element | null }
      >
    )
      .map((t) => (t && "current" in t ? t.current : t))
      .filter((el): el is Element => Boolean(el));
    if (!elements.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { ...from },
        {
          ...to,
          delay,
          stagger,
          duration: to.duration ?? 0.6,
          ease: to.ease ?? "power2.out",
        },
      );
    });
    return () => ctx.revert();
  }, [targets, delay, stagger, from, to]);
}

export function withScrollTrigger(
  to: gsap.TweenVars = {},
): gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars | false } {
  const base: gsap.TweenVars = { ...to };
  const triggerOpts = typeof to.scrollTrigger === "object" ? to.scrollTrigger : undefined;
  base.scrollTrigger = {
    start: "top 80%",
    toggleActions: "play none none reverse",
    ...(triggerOpts || {}),
  };
  return base as gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars | false };
}
