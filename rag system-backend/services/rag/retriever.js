import { generateEmbedding } from "./embedder.js";
import vectorStore from "../../models/vectorStore.js";
import config from "../../config/index.js";

async function retrieve(query, topK = config.topK) {
  console.log(`[Retriever] Query: "${query}" | topK: ${topK}`);

  const queryEmbedding = await generateEmbedding(query);
  const results = vectorStore.search(queryEmbedding, topK);

  console.log(
    `[Retriever] Found ${results.length} chunks (top score: ${results[0]?.score?.toFixed(4) ?? "n/a"})`,
  );
  return results;
}

export { retrieve };
