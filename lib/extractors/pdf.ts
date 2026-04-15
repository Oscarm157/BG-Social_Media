// Import the internal module directly to bypass pdf-parse's index.js,
// which contains debug code that tries to read a test PDF on load and
// breaks Next.js production builds.
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractPdf(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  return cleanText(result.text);
}

function cleanText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
