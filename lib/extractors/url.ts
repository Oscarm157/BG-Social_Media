import * as cheerio from "cheerio";

export async function extractUrl(url: string): Promise<string> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("URL inválida.");
  }

  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error("Solo se permiten URLs http/https.");
  }

  const res = await fetch(parsed.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ConsultingPostsBot/1.0; +https://example.com)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`La URL devolvió status ${res.status}.`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Quitar ruido común
  $("script, style, noscript, nav, footer, header, aside, form, iframe").remove();

  // Intentar tomar primero <article> o <main>, luego body
  let root = $("article").first();
  if (root.length === 0) root = $("main").first();
  if (root.length === 0) root = $("body");

  const title = $("title").first().text().trim();
  const body = root.text();

  const cleaned = cleanText(body);
  return title ? `${title}\n\n${cleaned}` : cleaned;
}

function cleanText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ \u00A0]{2,}/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
