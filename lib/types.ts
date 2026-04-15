export type Red = "linkedin" | "instagram" | "facebook";

export const ENFOQUES = [
  "Análisis experto",
  "Advertencia de riesgos",
  "Oportunidad / acción",
  "Informativo neutral",
  "Opinión / postura",
  "Pregunta abierta",
  "Caso práctico",
  "Contexto histórico",
] as const;

export type Enfoque = (typeof ENFOQUES)[number];

export interface InstagramContent {
  caption: string;
  slides: { title: string; body: string }[];
}

export interface Variante {
  enfoque: string;
  linkedin?: string;
  facebook?: string;
  instagram?: InstagramContent;
}

export interface GenerateRequest {
  text: string;
  networks: Red[];
  approaches: [string, string, string];
}

export interface GenerateResponse {
  variants: Variante[];
}

export interface ExtractRequest {
  type: "url" | "text";
  value: string;
}

export interface ExtractResponse {
  text: string;
}
