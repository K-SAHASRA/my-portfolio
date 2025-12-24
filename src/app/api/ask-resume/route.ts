import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import resumeChunks from "@data/resumeChunks.source.json";

export const runtime = "nodejs";


type ResumeChunk = {
  id: string;
  content: string;
  meta?: Record<string, unknown>;
};

type RequestBody = {
  query?: string;
};

const wittyFallbacks = [
  "That's classified neural data -- ask me about AI, research, or cloud work instead!",
  "If it's not in my resume, it's probably queued for my next experiment.",
  "I'm calibrated for resume talk -- try education, projects, or research topics.",
  "That question isn't in my dataset yet, but I can dig into internships or publications.",
];

const CACHE_LIMIT = 10;
const MAX_QUERY_LENGTH = 500;
const MAX_CONTEXT_CHUNKS = 4;
const MIN_TERM_LENGTH = 3;
const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "models/gemini-2.5-flash";

const chunkData = resumeChunks as ResumeChunk[];
const answerCache = new Map<string, string>();
const loggedQueries = new Set<string>();

function chooseWittyFallback(): string {
  return wittyFallbacks[Math.floor(Math.random() * wittyFallbacks.length)];
}

function extractTerms(query: string): string[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((term) => term.trim())
    .filter((term) => term.length >= MIN_TERM_LENGTH);
  return Array.from(new Set(terms));
}

function scoreChunk(terms: string[], content: string): number {
  if (terms.length === 0) {
    return 0;
  }

  const haystack = content.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (haystack.includes(term)) {
      score += 1;
    }
  }
  return score;
}

function getTopChunks(query: string): ResumeChunk[] {
  const terms = extractTerms(query);
  if (terms.length === 0) {
    return chunkData.slice(0, 2);
  }

  return chunkData
    .map((chunk) => ({
      chunk,
      score: scoreChunk(terms, chunk.content),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_CHUNKS)
    .map((entry) => entry.chunk);
}

function extractGraduationYear(chunks: ResumeChunk[]): string | null {
  const yearPattern = /\b(20\d{2})\b/g;
  const rangePattern = /\b(20\d{2})\s*[–-]\s*(20\d{2})\b/;

  for (const chunk of chunks) {
    const rangeMatch = chunk.content.match(rangePattern);
    if (rangeMatch) {
      return rangeMatch[2];
    }
  }

  for (const chunk of chunks) {
    const match = chunk.content.match(yearPattern);
    if (match && match.length > 0) {
      return match[match.length - 1];
    }
  }

  return null;
}

function isGraduationQuestion(query: string): boolean {
  const normalized = query.toLowerCase();
  return (
    /(graduate|graduation|undergrad|b\.?tech|btech|bachelor)/.test(normalized) &&
    /(year|when|date)/.test(normalized)
  );
}

function isCloudQuestion(query: string): boolean {
  const normalized = query.toLowerCase();
  return /(cloud|devops|aws|kubernetes|docker|serverless)/.test(normalized);
}

function getChunkById(id: string): ResumeChunk | undefined {
  return chunkData.find((chunk) => chunk.id === id);
}

function toFirstPerson(text: string): string {
  return text
    .replace(/\bSahasra\s+Kokkula\b/gi, "I")
    .replace(/\bSahasra\b/gi, "I")
    .replace(/\bShe\b/g, "I")
    .replace(/\bHer\b/g, "My")
    .replace(/\bher\b/g, "my")
    .replace(/\bHerself\b/g, "myself")
    .replace(/\bherself\b/g, "myself")
    .replace(/\bI's\b/g, "my")
    .trim();
}

function firstSentence(text: string): string {
  const match = text.match(/[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.trim();
}

function formatCloudSkills(text: string): string {
  const cleaned = text.replace(/^Cloud and DevOps:\s*/i, "").trim();
  return `My cloud and DevOps stack includes ${cleaned.replace(/\.$/, "")}.`;
}

function buildCloudAnswer(): string | null {
  const srm = getChunkById("edu_srm_overview");
  if (!srm) {
    return null;
  }

  const srmSentence = firstSentence(toFirstPerson(srm.content));
  const ta = getChunkById("edu_columbia_ta");
  const skills = getChunkById("skills_cloud");

  const parts = [`Yes. ${srmSentence}`];
  if (ta) {
    parts.push(firstSentence(toFirstPerson(ta.content)));
  }
  if (skills) {
    parts.push(formatCloudSkills(skills.content));
  }

  return parts.join(" ");
}

function getFromCache(key: string): string | undefined {
  const normalized = key.toLowerCase();
  const value = answerCache.get(normalized);
  if (!value) {
    return undefined;
  }

  answerCache.delete(normalized);
  answerCache.set(normalized, value);
  return value;
}

function addToCache(key: string, value: string) {
  const normalized = key.toLowerCase();
  if (answerCache.has(normalized)) {
    answerCache.delete(normalized);
  }

  if (answerCache.size >= CACHE_LIMIT) {
    const firstKey = answerCache.keys().next().value;
    if (firstKey) {
      answerCache.delete(firstKey);
    }
  }

  answerCache.set(normalized, value);
}

export async function POST(request: Request) {
  let payload: RequestBody;

  try {
    payload = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      {
        answer: "I couldn't quite parse that. Try sending a short question about my background.",
      },
      { status: 400 }
    );
  }

  const rawQuery = payload.query?.trim();
  if (!rawQuery) {
    return NextResponse.json(
      {
        answer: "Try asking about my education, research, or projects!",
      },
      { status: 400 }
    );
  }

  if (rawQuery.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      {
        answer: "Let's keep it concise -- ask in under 500 characters so I can respond fast.",
      },
      { status: 400 }
    );
  }

  const normalizedQuery = rawQuery.toLowerCase();
  if (!loggedQueries.has(normalizedQuery)) {
    loggedQueries.add(normalizedQuery);
    console.log(`[ASK-RESUME] ${new Date().toISOString()} -- "${rawQuery}"`);
  }

  const cached = getFromCache(rawQuery);
  if (cached) {
    return NextResponse.json({ answer: cached });
  }

  if (chunkData.length === 0) {
    const fallback = chooseWittyFallback();
    addToCache(rawQuery, fallback);
    return NextResponse.json({ answer: fallback }, { status: 500 });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback =
        "Ask My Resume is offline right now. Please try again later or contact me directly.";
      addToCache(rawQuery, fallback);
      return NextResponse.json({ answer: fallback }, { status: 500 });
    }

    const matches = getTopChunks(rawQuery);
    if (!matches.length) {
      const fallback = chooseWittyFallback();
      addToCache(rawQuery, fallback);
      return NextResponse.json({ answer: fallback });
    }

    if (isGraduationQuestion(rawQuery)) {
      const year = extractGraduationYear(matches);
      if (year) {
        const answer = `I graduated in ${year}.`;
        addToCache(rawQuery, answer);
        return NextResponse.json({ answer });
      }
    }

    if (isCloudQuestion(rawQuery)) {
      const answer = buildCloudAnswer();
      if (answer) {
        addToCache(rawQuery, answer);
        return NextResponse.json({ answer });
      }
    }

    const contextBlock = matches
      .map((chunk, index) => `(${index + 1}) ${chunk.content}`)
      .join("\n");

    const prompt = `You are Sahasra Kokkula answering questions about your resume.
Use only the resume context below. If the answer is not in the context, say you don't have that detail and suggest a resume-related topic.
Do not add or infer timelines or statuses (e.g., "currently") unless explicitly stated in the context.
Respond in first person, 2-5 sentences, professional and concise.

Resume context:
${contextBlock}

Question: ${rawQuery}
Answer:`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const answer = text.length > 0 ? text : chooseWittyFallback();
    addToCache(rawQuery, answer);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("ask-resume error", error);
    const fallback = chooseWittyFallback();
    addToCache(rawQuery, fallback);
    return NextResponse.json({ answer: fallback }, { status: 500 });
  }
}
