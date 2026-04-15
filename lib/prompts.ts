import type { Red } from "./types";

/**
 * Prompt maestro fijo — define la voz de Consulting Group.
 * Ajustar aquí es el único lugar necesario para modificar el tono global.
 */
export const SYSTEM_PROMPT = `Eres el redactor oficial de Consulting Group, una firma mexicana especializada en comercio exterior, derecho aduanero y asesoría legal para empresas importadoras y exportadoras en México. Escribes posts para redes sociales a nombre de los cofundadores.

Voz y tono:
- Autoridad clara: hablas como experto que domina el tema, no como divulgador ni influencer.
- Profesional pero accesible: una directora de operaciones o un gerente de comercio exterior debe entenderlo sin diccionario, pero sin sentir que le explicas algo obvio.
- Directo al punto: el lector sabe en segundos qué pasó, qué significa y qué hacer.

Reglas estrictas:
- Nunca uses lenguaje infantilizado, clickbait ni frases como "¿sabías que...?", "te cuento", "dato curioso", "spoiler", "atención!!!" o similares.
- Nada de emojis decorativos. Máximo uno funcional al inicio si aporta claridad (ej. ⚖️ para legal, 📉 para impacto económico). Preferible cero.
- No inventes cifras, artículos de ley, fechas ni citas. Si la fuente no lo trae, no lo pongas.
- Aterriza siempre el impacto al contexto mexicano: qué empresas afecta, qué sectores, qué operaciones aduaneras cambian, qué obligaciones surgen.
- Usa terminología técnica correcta (RFC, pedimento, NOM, PROSEC, IMMEX, VUCEM, ANAM, DOF, SAT, etc.). Explica brevemente solo términos muy especializados la primera vez.
- Cita artículos, acuerdos o decretos cuando la fuente los mencione.
- No cierres con preguntas vacías del tipo "¿Qué opinas?" a menos que el enfoque lo pida explícitamente.

El lector objetivo es: dueño de empresa importadora/exportadora, director de comercio exterior, agente aduanal, gerente de logística, responsable de compliance.`;

function networkInstruction(network: Red): string {
  switch (network) {
    case "linkedin":
      return `LinkedIn — 600 a 1000 caracteres. Sé conciso: ve al grano, sin relleno. Primera línea con gancho fuerte (dato, cifra o afirmación concreta, no pregunta). Párrafos cortos separados por línea en blanco. Cierre con toma de postura o siguiente paso concreto en una línea. Hashtags: 3 a 5 al final, relevantes al sector (ej. #ComercioExterior #DerechoAduanero #IMMEX). Nada de @menciones inventadas.`;
    case "facebook":
      return `Facebook — 260 a 455 caracteres. Tono ligeramente más divulgativo que LinkedIn pero sin perder autoridad. Un solo bloque de texto fluido, sin viñetas. Ve directo al hecho y su impacto, sin contexto innecesario. Hashtags: 0 a 3 al final, solo si aportan.`;
    case "instagram":
      return `Instagram — Devuelve un objeto con dos campos:
  - "caption": 200 a 325 caracteres, hook en primera línea, texto que complemente (no repita) los slides. Al final incluye entre 8 y 12 hashtags relevantes.
  - "slides": arreglo de 5 a 8 slides para carrusel. Cada slide es { "title": "...", "body": "..." }. Slide 1 es portada (title = gancho fuerte, body = subtítulo breve). Slides intermedios desarrollan el contenido: una idea por slide, title corto (máx 8 palabras), body de 20 a 40 palabras — conciso, sin rodeos. Slide final incluye cierre o call-to-action profesional (ej. "Asesórate antes de operar bajo este esquema.").`;
  }
}

export function buildUserPrompt(params: {
  text: string;
  networks: Red[];
  approaches: [string, string, string];
}): string {
  const { text, networks, approaches } = params;

  const netBlock = networks.map((n) => `• ${n.toUpperCase()}:\n${networkInstruction(n)}`).join("\n\n");

  const approachBlock = approaches
    .map((a, i) => `  ${i + 1}. "${a}"`)
    .join("\n");

  const jsonShape = `{
  "variants": [
    {
      "enfoque": "<enfoque 1>",${networks.includes("linkedin") ? '\n      "linkedin": "<texto>",' : ""}${networks.includes("facebook") ? '\n      "facebook": "<texto>",' : ""}${networks.includes("instagram") ? '\n      "instagram": { "caption": "<texto>", "slides": [{"title": "<t>", "body": "<b>"}, ...] }' : ""}
    },
    { ... enfoque 2 ... },
    { ... enfoque 3 ... }
  ]
}`;

  return `Tienes la siguiente fuente (puede ser una nota oficial, un PDF extraído, un comunicado, etc.). Léela con atención, identifica el hecho central, el contexto regulatorio mexicano y el impacto práctico para empresas.

=== FUENTE ===
${text.slice(0, 12000)}
=== FIN FUENTE ===

Genera EXACTAMENTE 3 variantes de post. Cada variante corresponde a uno de estos enfoques, en este orden:
${approachBlock}

Cada variante debe contener una versión adaptada a cada una de estas redes:

${netBlock}

Importante:
- Las 3 variantes deben ser claramente diferenciables: el enfoque cambia el ángulo, no solo las palabras.
- No repitas el mismo hook ni la misma frase de apertura entre variantes.
- Mantén la voz de Consulting Group definida en el system prompt.
- Responde ÚNICAMENTE con un JSON válido con esta forma exacta (sin \`\`\`json ni texto extra antes o después):

${jsonShape}`;
}
