"use client";

import { useState } from "react";

interface Slide {
  title: string;
  body: string;
}

export function CarouselSlides({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  if (!slides || slides.length === 0) return null;
  const slide = slides[active];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-7 w-7 rounded-md text-xs font-medium transition ${
                active === i
                  ? "bg-brand-accent text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">
          {active + 1} / {slides.length}
        </span>
      </div>

      <div className="mt-3 aspect-square w-full max-w-sm rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Slide {active + 1}
            </p>
            <h4 className="mt-2 text-xl font-semibold leading-tight text-slate-900">
              {slide.title}
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
            {slide.body}
          </p>
        </div>
      </div>
    </div>
  );
}
