import { pipeline } from "@xenova/transformers";

let summarizer: any = null;

// --- Helper: rewrite third-person into first-person tone ---
function toFirstPerson(text: string): string {
  return text
    // Replace name references
    .replace(/\bSahasra\s+Kokkula\b/gi, "I")
    .replace(/\bSahasra\b/gi, "I")
    .replace(/\bKokkula\b/gi, "I")

    // Pronoun conversions
    .replace(/\bShe\b/g, "I")
    .replace(/\bHer\b/g, "My")
    .replace(/\bher\b/g, "my")
    .replace(/\bhers\b/g, "mine")
    .replace(/\bHerself\b/g, "myself")
    .replace(/\bherself\b/g, "myself")

    // Fix small grammatical quirks
    .replace(/\bI's\b/g, "my")
    .replace(/\bI am have\b/g, "I have")
    .replace(/\bI am\b/g, "I'm")
    .replace(/\bI have\b/g, "I've")
    .replace(/\bI will\b/g, "I'll")

    // Trim whitespace
    .trim();
}

// --- Main summarizer function ---
export async function summarizeText(text: string): Promise<string> {
  if (!summarizer) {
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6");
  }

  if (!text || text.length < 50) return toFirstPerson(text);

  const output = await summarizer(text, {
    min_length: 40,
    max_length: 120,
  });

  const summary = output?.[0]?.summary_text?.trim() ?? text;
  return toFirstPerson(summary);
}
