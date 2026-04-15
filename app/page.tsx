"use client";

import { useMemo, useState } from "react";
import { InputTabs, type InputMode } from "@/components/InputTabs";
import { ConfigPanel } from "@/components/ConfigPanel";
import { PostVariantCard } from "@/components/PostVariantCard";
import type { GenerateResponse, Red } from "@/lib/types";

export default function HomePage() {
  const [mode, setMode] = useState<InputMode>("text");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");

  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  const [networks, setNetworks] = useState<Red[]>(["linkedin", "instagram", "facebook"]);
  const [approaches, setApproaches] = useState<[string, string, string]>([
    "Análisis experto",
    "Advertencia de riesgos",
    "Oportunidad / acción",
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = useMemo(() => {
    if (networks.length === 0) return false;
    if (mode === "pdf") return !!file;
    if (mode === "url") return url.trim().length > 5;
    return text.trim().length > 30;
  }, [mode, file, url, text, networks]);

  const toggleNetwork = (n: Red) => {
    setNetworks((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const setApproach = (index: 0 | 1 | 2, value: string) => {
    setApproaches((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = value;
      return next;
    });
  };

  const extract = async (): Promise<string> => {
    setExtracting(true);
    try {
      if (mode === "pdf" && file) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/extract", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error extrayendo PDF.");
        return data.text as string;
      }
      if (mode === "url") {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "url", value: url }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Error extrayendo URL.");
        return data.text as string;
      }
      // text
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", value: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error procesando texto.");
      return data.text as string;
    } finally {
      setExtracting(false);
    }
  };

  const onGenerate = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const sourceText = await extract();
      setExtractedText(sourceText);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, networks, approaches }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error generando posts.");
      setResult(data as GenerateResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-accent">
          Consulting Group · Uso interno
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Generador de posts para redes sociales
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Sube un PDF, pega una URL de portal oficial, o pega el texto de una nota.
          La herramienta lo contextualiza para México y devuelve 3 variantes de post
          con distintos enfoques.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <InputTabs
          mode={mode}
          setMode={setMode}
          file={file}
          setFile={setFile}
          url={url}
          setUrl={setUrl}
          text={text}
          setText={setText}
        />
        <ConfigPanel
          networks={networks}
          toggleNetwork={toggleNetwork}
          approaches={approaches}
          setApproach={setApproach}
          onGenerate={onGenerate}
          loading={loading || extracting}
          canGenerate={canGenerate}
        />
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {extractedText && !loading && (
        <details className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-700">
            Texto fuente extraído ({extractedText.length.toLocaleString()} caracteres)
          </summary>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-slate-50 p-3 text-xs text-slate-600">
            {extractedText}
          </pre>
        </details>
      )}

      {loading && (
        <div className="mt-10 flex items-center justify-center gap-3 text-slate-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-accent" />
          <span className="text-sm">
            {extracting ? "Extrayendo contenido…" : "Generando variantes con Claude…"}
          </span>
        </div>
      )}

      {result && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            3. Resultado
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {result.variants.map((v, i) => (
              <PostVariantCard key={i} index={i} variant={v} networks={networks} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
