"use client";

import { useRef, useState } from "react";

export type InputMode = "pdf" | "url" | "text";

interface Props {
  mode: InputMode;
  setMode: (m: InputMode) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  url: string;
  setUrl: (s: string) => void;
  text: string;
  setText: (s: string) => void;
}

const TABS: { id: InputMode; label: string }[] = [
  { id: "pdf", label: "PDF" },
  { id: "url", label: "URL" },
  { id: "text", label: "Texto" },
];

export function InputTabs({
  mode,
  setMode,
  file,
  setFile,
  url,
  setUrl,
  text,
  setText,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        1. Fuente
      </h2>

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setMode(t.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              mode === t.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mode === "pdf" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f && f.type === "application/pdf") setFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition ${
            dragOver
              ? "border-brand-accent bg-blue-50"
              : "border-slate-300 hover:border-slate-400"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-slate-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-2 text-xs text-slate-500 underline hover:text-slate-700"
              >
                Quitar
              </button>
            </>
          ) : (
            <>
              <p className="font-medium">Arrastra un PDF o haz clic para seleccionar</p>
              <p className="mt-1 text-sm text-slate-500">
                Solo archivos PDF. Se procesan en el servidor.
              </p>
            </>
          )}
        </div>
      )}

      {mode === "url" && (
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.dof.gob.mx/..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />
      )}

      {mode === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega aquí el texto de la nota, comunicado o boletín…"
          rows={10}
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
        />
      )}
    </section>
  );
}
