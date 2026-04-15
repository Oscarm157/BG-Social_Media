import { NextRequest, NextResponse } from "next/server";
import { generatePosts } from "@/lib/anthropic";
import type { GenerateRequest, Red } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const VALID_NETWORKS: Red[] = ["linkedin", "instagram", "facebook"];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Falta ANTHROPIC_API_KEY en el entorno." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Partial<GenerateRequest>;
    const { text, networks, approaches } = body;

    if (!text || typeof text !== "string" || text.trim().length < 30) {
      return NextResponse.json(
        { error: "El texto fuente es muy corto (mínimo 30 caracteres)." },
        { status: 400 }
      );
    }
    if (!Array.isArray(networks) || networks.length === 0) {
      return NextResponse.json(
        { error: "Debes seleccionar al menos una red." },
        { status: 400 }
      );
    }
    for (const n of networks) {
      if (!VALID_NETWORKS.includes(n)) {
        return NextResponse.json({ error: `Red inválida: ${n}` }, { status: 400 });
      }
    }
    if (!Array.isArray(approaches) || approaches.length !== 3) {
      return NextResponse.json(
        { error: "Debes proveer exactamente 3 enfoques." },
        { status: 400 }
      );
    }
    for (const a of approaches) {
      if (typeof a !== "string" || a.trim().length === 0) {
        return NextResponse.json(
          { error: "Todos los enfoques deben ser texto no vacío." },
          { status: 400 }
        );
      }
    }

    const result = await generatePosts({
      text,
      networks: networks as Red[],
      approaches: approaches as [string, string, string],
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/generate] error:", err);
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
