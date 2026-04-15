"use client";

import { ENFOQUES, type Red } from "@/lib/types";

interface Props {
  networks: Red[];
  toggleNetwork: (n: Red) => void;
  approaches: [string, string, string];
  setApproach: (index: 0 | 1 | 2, value: string) => void;
  onGenerate: () => void;
  loading: boolean;
  canGenerate: boolean;
}

const NETWORKS: { id: Red; label: string }[] = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
];

export function ConfigPanel({
  networks,
  toggleNetwork,
  approaches,
  setApproach,
  onGenerate,
  loading,
  canGenerate,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        2. Configuración
      </h2>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-slate-700">Redes destino</p>
        <div className="flex flex-wrap gap-2">
          {NETWORKS.map((n) => {
            const active = networks.includes(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => toggleNetwork(n.id)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  active
                    ? "border-brand-accent bg-brand-accent text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Enfoques (3 variantes)
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="mb-1 block text-xs text-slate-500">
                Variante {i + 1}
              </label>
              <select
                value={approaches[i]}
                onChange={(e) => setApproach(i as 0 | 1 | 2, e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20"
              >
                {ENFOQUES.map((enf) => (
                  <option key={enf} value={enf}>
                    {enf}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || loading}
        className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-accent disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Generando…" : "Generar 3 variantes"}
      </button>
    </section>
  );
}
