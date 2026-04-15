"use client";

import { useState } from "react";
import type { Red, Variante } from "@/lib/types";
import { CarouselSlides } from "./CarouselSlides";

interface Props {
  index: number;
  variant: Variante;
  networks: Red[];
}

const NET_LABEL: Record<Red, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
};

export function PostVariantCard({ index, variant, networks }: Props) {
  const available = networks.filter((n) => {
    if (n === "instagram") return !!variant.instagram;
    if (n === "linkedin") return !!variant.linkedin;
    if (n === "facebook") return !!variant.facebook;
    return false;
  });
  const [active, setActive] = useState<Red>(available[0] ?? "linkedin");

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Variante {index + 1}
          </p>
          <h3 className="text-base font-semibold text-slate-900">{variant.enfoque}</h3>
        </div>
      </header>

      <div className="flex gap-1 border-b border-slate-100 px-3 pt-2">
        {available.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setActive(n)}
            className={`rounded-t-md px-3 py-1.5 text-xs font-medium transition ${
              active === n
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {NET_LABEL[n]}
          </button>
        ))}
      </div>

      <div className="p-5">
        {active === "linkedin" && variant.linkedin && (
          <TextBlock label="LinkedIn" text={variant.linkedin} />
        )}
        {active === "facebook" && variant.facebook && (
          <TextBlock label="Facebook" text={variant.facebook} />
        )}
        {active === "instagram" && variant.instagram && (
          <div className="space-y-5">
            <TextBlock label="Caption" text={variant.instagram.caption} />
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Slides del carrusel
              </p>
              <CarouselSlides slides={variant.instagram.slides} />
              <CopyAllSlidesButton slides={variant.instagram.slides} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label} · {text.length} caracteres
        </span>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-800 font-sans">
        {text}
      </pre>
    </div>
  );
}

function CopyAllSlidesButton({
  slides,
}: {
  slides: { title: string; body: string }[];
}) {
  const [copied, setCopied] = useState(false);
  const text = slides
    .map((s, i) => `Slide ${i + 1} — ${s.title}\n${s.body}`)
    .join("\n\n");
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="mt-3 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
    >
      {copied ? "¡Copiado!" : "Copiar todos los slides"}
    </button>
  );
}
