import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import type { GenerateRequest, GenerateResponse } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// claude-sonnet-4-6: balance de costo/calidad, rápido, suficiente para redacción.
// Para máxima calidad puedes cambiar a "claude-opus-4-6" (más lento y caro).
export const DEFAULT_MODEL = "claude-sonnet-4-6";

export async function generatePosts(
  req: GenerateRequest,
  model: string = DEFAULT_MODEL
): Promise<GenerateResponse> {
  const userPrompt = buildUserPrompt(req);

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    temperature: 0.8,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Respuesta del modelo sin bloque de texto.");
  }

  const stopReason = response.stop_reason as string | null;
  if (stopReason === "max_tokens") {
    throw new Error(
      "La respuesta del modelo se cortó por límite de tokens. Reduce el número de redes seleccionadas o acorta el texto fuente."
    );
  }

  if (stopReason === "refusal") {
    throw new Error(
      "El modelo rechazó la solicitud por política de contenido. Revisa el texto fuente."
    );
  }

  const raw = textBlock.text.trim();
  const json = extractJson(raw);

  let parsed: GenerateResponse;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error(
      `El modelo no devolvió JSON válido (stop_reason: ${stopReason}). Fragmento: ${raw.slice(0, 300)}`
    );
  }

  if (!parsed.variants || !Array.isArray(parsed.variants) || parsed.variants.length !== 3) {
    throw new Error("La respuesta no contiene exactamente 3 variantes.");
  }

  return parsed;
}

/**
 * Extrae el primer bloque JSON válido del texto del modelo.
 * Tolera que el modelo devuelva el JSON envuelto en ```json ... ``` o con texto alrededor.
 */
function extractJson(raw: string): string {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();

  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.slice(firstBrace, lastBrace + 1);
  }
  return raw;
}
