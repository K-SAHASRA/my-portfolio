import { pipeline } from "@xenova/transformers";

// all-MiniLM-L6-v2 outputs 384-dimension vectors.
export const EMBEDDING_DIMENSION = 384;

type VectorCarrier<T> = T & { embedding: number[] };

let embedder: any = null;

/**
 * Lazily load the local transformer pipeline for embeddings.
 */
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

/**
 * Generate a normalized embedding for the provided text locally.
 */
export async function embedText(input: string): Promise<number[]> {
  const runner = await getEmbedder();
  const output = await runner(input, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

/**
 * Compute the cosine similarity between two equal-length vectors.
 * Returns 0 when vectors are mismatched or have zero magnitude.
 */
export function cosineSim(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const valA = a[i];
    const valB = b[i];
    dot += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  }

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Return the top-k items sorted by cosine similarity.
 */
export function topK<T>(
  queryEmbedding: number[],
  items: Array<VectorCarrier<T>>,
  k: number
) {
  return items
    .map((item) => ({
      item,
      score: cosineSim(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(k, 0));
}
