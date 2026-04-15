# Consulting Group · Generador de posts

Herramienta interna para generar posts de redes sociales (LinkedIn, Instagram, Facebook) a partir de un PDF, una URL de portal oficial, o texto pegado. Usa Claude para contextualizar el contenido al entorno mexicano de comercio exterior y derecho aduanero, y devuelve 3 variantes con enfoques configurables.

## Setup local

Requisitos: Node.js 18.17+ (recomendado 20+).

```bash
npm install
cp .env.local.example .env.local
# edita .env.local y pega tu ANTHROPIC_API_KEY
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

| Variable            | Descripción                         |
| ------------------- | ----------------------------------- |
| `ANTHROPIC_API_KEY` | API key de Anthropic (obligatoria). |

## Estructura

```
app/
  page.tsx              UI principal
  api/extract/route.ts  Recibe PDF / URL / texto y devuelve texto limpio
  api/generate/route.ts Llama a Claude con el prompt maestro
lib/
  prompts.ts            ⚠ Voz y tono de Consulting Group (editar aquí)
  anthropic.ts          Cliente Claude + parseo de respuesta
  extractors/*.ts       Extracción de PDF, URL y texto
components/*.tsx        UI (tabs, config, cards, carrusel)
```

## Dónde ajustar el tono

Todo el comportamiento de redacción vive en `lib/prompts.ts`:

- `SYSTEM_PROMPT`: voz, reglas, audiencia, prohibiciones.
- `networkInstruction(...)`: longitud y formato por red.
- `buildUserPrompt(...)`: composición del prompt final + formato JSON esperado.

Al cambiar cualquiera de estos, no hay que tocar nada más del código.

## Modelo

Por defecto usa `claude-sonnet-4-6` (balance costo/calidad). Para máxima calidad, en `lib/anthropic.ts` cambia `DEFAULT_MODEL` a `claude-opus-4-6` (más lento y caro).

## Deploy en Vercel

1. `vercel` (o sube el repo y conecta en el dashboard).
2. En Project Settings → Environment Variables, agrega `ANTHROPIC_API_KEY`.
3. Deploy. Como no hay login, mantén el deploy **privado** (Vercel team / password protection) o solo comparte la URL con quien corresponda.

> ⚠️ **Importante sobre timeouts**: las rutas `/api/generate` y `/api/extract` declaran `maxDuration` de 60–120s, pero el plan **Hobby** de Vercel limita a 10s y genera 504. Para producción, usa plan **Pro** (60s) o superior. En desarrollo local no aplica este límite.

## Límites conocidos (primera versión)

- No guarda historial (stateless).
- No publica a redes; solo genera y copia al portapapeles.
- La extracción de URL usa `cheerio` sobre HTML estático: sitios que renderizan con JS pueden quedar vacíos. En ese caso, pega el texto manualmente.
- PDFs escaneados sin OCR no se pueden leer (PDF debe tener texto seleccionable).
- El modelo puede devolver JSON malformado muy ocasionalmente; reintenta o edita el texto fuente.

## Flujo de uso

1. Elige fuente: PDF, URL o texto.
2. Selecciona redes destino y los 3 enfoques (un dropdown por variante).
3. Click en "Generar 3 variantes".
4. Se muestran las 3 cards; cada una tiene pestañas por red y un botón "Copiar".
5. Para Instagram: se muestran los slides del carrusel con opción "Copiar todos los slides".
