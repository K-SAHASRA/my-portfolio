#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pipeline } from "@xenova/transformers";

const SOURCE_FILE = "data/resumeChunks.source.json";
const OUTPUT_FILE = "data/resumeChunks.json";

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

function validateChunk(chunk, index) {
  if (!chunk || typeof chunk !== "object") {
    throw new Error(`Chunk at index ${index} is not a valid object.`);
  }
  if (typeof chunk.id !== "string" || chunk.id.trim().length === 0) {
    throw new Error(`Chunk at index ${index} is missing an id.`);
  }
  if (typeof chunk.content !== "string" || chunk.content.trim().length === 0) {
    throw new Error(`Chunk "${chunk.id}" is missing content.`);
  }
}

async function embedChunk(chunk) {
  const runner = await getEmbedder();
  const output = await runner(chunk.content, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

async function main() {
  const sourcePath = path.resolve(process.cwd(), SOURCE_FILE);
  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);

  const rawSource = await fs.readFile(sourcePath, "utf8");
  const chunks = JSON.parse(rawSource);

  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("Source resume chunk file is empty or not an array.");
  }

  const embeddedChunks = [];
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    validateChunk(chunk, index);
    process.stdout.write(
      `Embedding chunk ${index + 1}/${chunks.length}: ${chunk.id}...\n`
    );
    const embedding = await embedChunk(chunk);
    embeddedChunks.push({
      ...chunk,
      embedding,
    });
  }

  await fs.writeFile(outputPath, JSON.stringify(embeddedChunks, null, 2));
  process.stdout.write(
    `\nWrote ${embeddedChunks.length} embedded resume chunks to ${OUTPUT_FILE}.\n`
  );
}

main().catch((error) => {
  console.error("Failed to generate resume embeddings:", error);
  process.exit(1);
});
