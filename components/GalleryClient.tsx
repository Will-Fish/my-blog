/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import type { PhotographyImage } from "@/lib/photography";

type GalleryClientProps = {
  images: PhotographyImage[];
};

const mobileTilePattern = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2",
  "col-span-6 row-span-4",
  "col-span-2 row-span-2",
  "col-span-4 row-span-2",
  "col-span-6 row-span-2",
];

function getMobileTileClass(index: number) {
  return mobileTilePattern[index % mobileTilePattern.length];
}

export function GalleryClient({ images }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.removeProperty("overflow");
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % images.length,
        );
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + images.length) % images.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  if (images.length === 0) {
    return (
      <Card className="p-10 text-center">
        <p className="text-text-muted">No photos yet. Add images to `content/photography/large` and commit.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid auto-rows-[72px] grid-cols-6 gap-2 sm:auto-rows-[92px] sm:gap-3 lg:hidden">
        {images.map((item, index) => (
          <Card
            key={item.id}
            className={`group overflow-hidden rounded-[12px] ${getMobileTileClass(index)}`}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="block h-full w-full cursor-zoom-in"
              aria-label={`Open photo ${index + 1}`}
            >
              <img
                src={item.thumbSrc}
                alt={item.title}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </button>
          </Card>
        ))}
      </div>

      <div className="hidden columns-4 gap-3 lg:block">
        {images.map((item, index) => (
          <div key={item.id} className="mb-3 break-inside-avoid">
            <Card className="group overflow-hidden rounded-[12px]">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="block w-full cursor-zoom-in text-left"
                aria-label={`Open photo ${index + 1}`}
              >
                <img
                  src={item.thumbSrc}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </button>
            </Card>
          </div>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/88 p-4 md:p-8"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
          >
            Close
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) =>
                    current === null ? current : (current - 1 + images.length) % images.length,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                aria-label="Previous image"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((current) =>
                    current === null ? current : (current + 1) % images.length,
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                aria-label="Next image"
              >
                Next
              </button>
            </>
          ) : null}
          <div className="max-h-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeImage.largeSrc}
              alt={activeImage.title}
              className="max-h-[85vh] w-auto max-w-full rounded-[12px] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
