import { v4 as uuidv4 } from "uuid";
import { parseDocument } from "../../utils/documentParser.js";
import { chunkText } from "../../utils/chunker.js";
import { generateEmbeddings } from "./embedder.js";
import vectorStore from "../../models/vectorStore.js";
import documentRegistry from "../../models/documentRegistry.js";

async function ingestDocument(buffer, mimeType, filename) {
  const documentId = uuidv4();
  const startedAt = Date.now();

  console.log(`\n[Ingest] ── Starting pipeline ──`);
  console.log(
    `[Ingest] File: ${filename} | Type: ${mimeType} | ID: ${documentId}`,
  );

  console.log(`[Ingest] Step 1/4: Parsing document...`);
  const rawText = await parseDocument(buffer, mimeType);
  console.log(`[Ingest] Extracted ${rawText.length} characters`);

  if (!rawText.trim()) {
    throw new Error("Document appears to be empty or could not be parsed.");
  }

  console.log(`[Ingest] Step 2/4: Chunking text...`);
  const chunks = chunkText(rawText);
  console.log(`[Ingest] Created ${chunks.length} chunks`);

  console.log(`[Ingest] Step 3/4: Generating embeddings...`);
  const embeddings = await generateEmbeddings(chunks);

  console.log(`[Ingest] Step 4/4: Storing in vector store...`);
  const items = chunks.map((text, i) => ({
    id: `${documentId}_${i}`,
    documentId,
    chunkIndex: i,
    text,
    embedding: embeddings[i],
    metadata: { filename, mimeType, chunkIndex: i, totalChunks: chunks.length },
  }));
  vectorStore.addChunks(items);

  documentRegistry.register(documentId, {
    filename,
    mimeType,
    chunkCount: chunks.length,
    characterCount: rawText.length,
    ingestedAt: new Date().toISOString(),
  });

  const elapsed = Date.now() - startedAt;
  console.log(`[Ingest] ── Done in ${elapsed}ms ──\n`);

  return {
    documentId,
    filename,
    chunkCount: chunks.length,
    characterCount: rawText.length,
    elapsedMs: elapsed,
  };
}

async function ingestText(text, name = "text-input") {
  const fakeBuffer = Buffer.from(text, "utf-8");
  return ingestDocument(fakeBuffer, "text/plain", name);
}

export { ingestDocument, ingestText };
