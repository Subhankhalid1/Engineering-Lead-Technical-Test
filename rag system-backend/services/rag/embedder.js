import config from "../../config/index.js";
import OpenAI from "openai";

const MOCK_DIMS = 256;

function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function mockEmbed(text) {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/);
  const vec = new Array(MOCK_DIMS).fill(0);

  for (const word of words) {
    if (!word) continue;
    const idx = hashCode(word) % MOCK_DIMS;
    vec[idx] += 1;

    const idx2 = (hashCode(word + "_pos") + words.indexOf(word)) % MOCK_DIMS;
    vec[idx2] += 0.5;
  }

  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

let _openaiClient = null;

function getOpenAI() {
  if (!_openaiClient) {
    _openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openaiClient;
}

async function openAIEmbed(texts) {
  const openai = getOpenAI();

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  return response.data.map((d) => d.embedding);
}

async function generateEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) return [];

  const provider = config.llmProvider;

  if (provider === "openai") {
    console.log(
      `[Embedder] Using OpenAI text-embedding-3-small for ${texts.length} texts`,
    );
    return openAIEmbed(texts);
  }

  console.log(
    `[Embedder] Using mock TF-IDF embeddings for ${texts.length} texts`,
  );
  return texts.map(mockEmbed);
}

async function generateEmbedding(text) {
  const results = await generateEmbeddings([text]);
  return results[0];
}

export { generateEmbeddings, generateEmbedding };
