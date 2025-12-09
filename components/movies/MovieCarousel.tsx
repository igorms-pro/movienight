"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, KIND as BTN_KIND, SHAPE as BTN_SHAPE, SIZE as BTN_SIZE } from "baseui/button";
import { ArrowLeft, ArrowRight } from "baseui/icon";
import { Movie, MovieDetails } from "@/lib/tmdb/types";
import MovieCardCarousel from "./MovieCardCarousel";

type Props = {
  movies: (Movie | MovieDetails)[];
  title: string;
  showRating?: boolean;
  showDuration?: boolean;
};

export default function MovieCarousel({
  movies,
  title,
  showRating = false,
  showDuration = false,
}: Props) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    setIsScrolling(true);

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const currentScroll = container.scrollLeft;
    const newPosition =
      direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
      setIsScrolling(true);

      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newPartiallyVisibleCards = new Set<number>();

      cardRefs.current.forEach((cardRef, index) => {
        if (cardRef) {
          const cardRect = cardRef.getBoundingClientRect();
          const isPartiallyVisible =
            cardRect.left < containerRect.right &&
            cardRect.right > containerRect.left &&
            !(cardRect.left >= containerRect.left && cardRect.right <= containerRect.right);

          if (isPartiallyVisible) {
            newPartiallyVisibleCards.add(index);
          }
        }
      });

      setVisibleCards(newPartiallyVisibleCards);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener("resize", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [movies]);

  const canScrollLeft = scrollPosition > 10;
  const canScrollRight =
    !!scrollContainerRef.current &&
    scrollPosition <
      scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10;

  return (
    <div className="w-full mb-[60px]">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="relative max-w-[1150px] mx-auto px-3 md:px-4">
        <div className="hidden md:block">
          <Button
            onClick={() => canScrollLeft && scroll("left")}
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            disabled={!canScrollLeft}
            overrides={{
              BaseButton: {
                style: ({ $disabled }) => ({
                  position: "absolute",
                  left: "-64px",
                  top: "35%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "48px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: $disabled ? 0.3 : 1,
                }),
              },
            }}
            aria-label="Scroll left"
          >
            <ArrowLeft size={24} />
          </Button>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-[12px] md:gap-[10px] sm:gap-[8px] overflow-x-auto scroll-smooth scrollbar-none pb-2.5 pr-12 [&::-webkit-scrollbar]:hidden"
        >
          {movies.map((movie, index) => {
            const isPartiallyVisible = visibleCards.has(index);
            const cardRef = (el: HTMLDivElement | null) => {
              cardRefs.current[index] = el;
            };

            return (
              <div
                key={movie.id}
                ref={cardRef}
                className={`shrink-0 mx-[8px] w-[170px] md:w-[175px] sm:w-[150px] max-[480px]:w-[140px] transition-transform duration-200 ${
                  isScrolling ? "opacity-100" : isPartiallyVisible ? "opacity-40" : "opacity-100"
                }`}
              >
                <MovieCardCarousel
                  movie={movie}
                  showRating={showRating}
                  showDuration={showDuration}
                />
              </div>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Button
            onClick={() => canScrollRight && scroll("right")}
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            disabled={!canScrollRight}
            overrides={{
              BaseButton: {
                style: ({ $disabled }) => ({
                  position: "absolute",
                  right: "-64px",
                  top: "35%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "48px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: $disabled ? 0.3 : 1,
                }),
              },
            }}
            aria-label="Scroll right"
          >
            <ArrowRight size={24} />
          </Button>
        </div>

        <div className="mt-3 flex justify-center gap-3 md:hidden">
          <Button
            onClick={() => scroll("left")}
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            disabled={!canScrollLeft}
          >
            <ArrowLeft size={20} />
          </Button>
          <Button
            onClick={() => scroll("right")}
            kind={BTN_KIND.secondary}
            size={BTN_SIZE.compact}
            shape={BTN_SHAPE.pill}
            disabled={!canScrollRight}
          >
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
