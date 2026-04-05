import { retrieve } from "./retriever.js";
import { askLLM } from "./llm.js";
import vectorStore from "../../models/vectorStore.js";

async function answerQuestion(question, topK) {
  if (!question || !question.trim()) {
    throw Object.assign(new Error("Question cannot be empty."), {
      status: 400,
    });
  }

  const storeStats = vectorStore.stats();
  if (storeStats.totalChunks === 0) {
    throw Object.assign(
      new Error(
        "No documents have been ingested yet. Please POST to /ingest first.",
      ),
      { status: 400 },
    );
  }

  const chunks = await retrieve(question, topK);

  if (chunks.length === 0) {
    return {
      question,
      answer:
        "No relevant content found in the ingested documents for your question.",
      sources: [],
    };
  }

  const context = chunks
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n\n---\n\n");

  const answer = await askLLM(context, question);

  return {
    question,
    answer,
    sources: chunks.map((c) => ({
      documentId: c.documentId,
      score: parseFloat(c.score.toFixed(4)),
      excerpt: c.text.slice(0, 200) + (c.text.length > 200 ? "..." : ""),
      metadata: c.metadata,
    })),
  };
}

export { answerQuestion };
