// Edits a product photo with Gemini: keeps the product, changes the scene.
//
//   node tools/gemini-photo.mjs <photo.jpg> <out.png> "scene description" [--model <id>] [--ratio 1:1]
//
// The API key is read from the GEMINI_API_KEY environment variable (on Windows, set it once with
// `setx GEMINI_API_KEY "..."`; the script also finds it there before the terminal is restarted).
// The key is never written to a file or printed.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { extname } from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const [, value] = args.splice(i, 2);
  return value;
};
const model = option("--model", "gemini-3.1-flash-image");
const ratio = option("--ratio", "1:1");
const [input, output, scene] = args;

if (!input || !output || !scene) {
  console.error('Usage: node tools/gemini-photo.mjs <photo.jpg> <out.png> "scene description" [--model <id>] [--ratio 1:1]');
  process.exit(1);
}

function apiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.platform === "win32") {
    try {
      const out = execFileSync("reg", ["query", "HKCU\\Environment", "/v", "GEMINI_API_KEY"], { encoding: "utf8" });
      const match = out.match(/GEMINI_API_KEY\s+REG_\w+\s+(\S+)/);
      if (match) return match[1];
    } catch {}
  }
  console.error("GEMINI_API_KEY is not set. Create a key in Google AI Studio and run: setx GEMINI_API_KEY \"your-key\"");
  process.exit(1);
}

// The product must stay exactly as photographed: only the surroundings change.
const prompt =
  "Edit this photo. Keep the food exactly as it is: same shape, size, colours, browning, layers and loose threads. " +
  "Do not add, remove, smooth or beautify anything on the food itself. " +
  "Remove the original background, packaging and surface, and place the food in this new scene: " +
  scene +
  ". Realistic photography, natural lighting that matches the food, correct shadows where it rests. No text, no logos, no watermark.";

const mime = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" }[extname(input).toLowerCase()];
if (!mime) {
  console.error("The photo must be a .jpg, .png or .webp file.");
  process.exit(1);
}

const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey() },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: readFileSync(input).toString("base64") } }] }],
    generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: ratio } },
  }),
});

const body = await response.json().catch(() => ({}));
if (!response.ok) {
  console.error(`Gemini error ${response.status}: ${body.error?.message || response.statusText}`);
  process.exit(1);
}

const parts = body.candidates?.[0]?.content?.parts || [];
const image = parts.map((p) => p.inlineData || p.inline_data).find(Boolean);
if (!image) {
  const reason = body.candidates?.[0]?.finishReason || body.promptFeedback?.blockReason || "no image returned";
  const text = parts.map((p) => p.text).filter(Boolean).join(" ");
  console.error(`Gemini did not return an image (${reason}). ${text}`);
  process.exit(1);
}

writeFileSync(output, Buffer.from(image.data, "base64"));
console.log(`Saved ${output} (${model})`);
