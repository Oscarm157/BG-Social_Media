import { NextRequest, NextResponse } from "next/server";
import { extractPdf } from "@/lib/extractors/pdf";
import { extractUrl } from "@/lib/extractors/url";
import { extractText } from "@/lib/extractors/text";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Archivo no recibido." }, { status: 400 });
      }
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json({ error: "Solo se acepta PDF." }, { status: 400 });
      }
      const bytes = Buffer.from(await file.arrayBuffer());
      const text = await extractPdf(bytes);
      return NextResponse.json({ text });
    }

    const body = await req.json();
    const { type, value } = body as { type?: string; value?: string };

    if (!type || !value) {
      return NextResponse.json(
        { error: "Faltan campos 'type' o 'value'." },
        { status: 400 }
      );
    }

    if (type === "url") {
      const text = await extractUrl(value);
      return NextResponse.json({ text });
    }

    if (type === "text") {
      return NextResponse.json({ text: extractText(value) });
    }

    return NextResponse.json({ error: "Tipo no soportado." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
