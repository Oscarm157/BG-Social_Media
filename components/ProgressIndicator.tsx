"use client";

import { useEffect, useState } from "react";

interface Props {
  phase: "extracting" | "generating";
}

/**
 * Barra de progreso "heurística" — la API no expone progreso real, así que
 * avanzamos la barra en base al tiempo transcurrido y un tiempo esperado por fase.
 * Nunca llega a 100% hasta que la respuesta real llega (el padre desmonta el componente).
 */
const EXPECTED_SECONDS: Record<Props["phase"], number> = {
  extracting: 8,
  generating: 35,
};

const PHASE_LABEL: Record<Props["phase"], string> = {
  extracting: "Extrayendo contenido de la fuente",
  generating: "Generando 3 variantes con IA",
};

const PHASE_HINT: Record<Props["phase"], string> = {
  extracting: "Leyendo PDF, URL o texto y limpiando el contenido…",
  generating: "Contextualizando para México y redactando posts por red…",
};

export function ProgressIndicator({ phase }: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed((Date.now() - start) / 1000);
    }, 100);
    return () => clearInterval(id);
  }, [phase]);

  const expected = EXPECTED_SECONDS[phase];
  // Asíntota: nunca llega al 100% — se acerca al 95% y se queda ahí.
  const ratio = 1 - Math.exp(-elapsed / expected);
  const percent = Math.min(95, ratio * 100);

  return (
    <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-accent" />
          </span>
          <span className="text-sm font-medium text-slate-800">
            {PHASE_LABEL[phase]}
          </span>
        </div>
        <span className="tabular-nums text-xs text-slate-500">
          {elapsed.toFixed(1)}s
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-accent transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">{PHASE_HINT[phase]}</p>

      {elapsed > expected * 2 && (
        <p className="mt-2 text-xs text-amber-700">
          Está tardando más de lo normal. Si es tu primer request después de un
          rato, puede ser el cold start del servidor. Si supera 90s se cancela
          automáticamente.
        </p>
      )}
    </div>
  );
}
