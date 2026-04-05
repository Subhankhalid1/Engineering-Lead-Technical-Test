class VectorStore {
  constructor() {
    // Each entry: { id, documentId, chunkIndex, text, embedding, metadata }
    this.chunks = [];
  }

  addChunks(items) {
    this.chunks.push(...items);
    console.log(`[VectorStore] Total chunks stored: ${this.chunks.length}`);
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  search(queryEmbedding, topK = 3) {
    if (this.chunks.length === 0) return [];

    const scored = this.chunks.map((chunk) => ({
      text: chunk.text,
      score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      metadata: chunk.metadata,
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
    }));

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  removeDocument(documentId) {
    const before = this.chunks.length;
    this.chunks = this.chunks.filter((c) => c.documentId !== documentId);
    console.log(
      `[VectorStore] Removed ${before - this.chunks.length} chunks for document ${documentId}`,
    );
  }

  stats() {
    const docIds = [...new Set(this.chunks.map((c) => c.documentId))];
    return {
      totalChunks: this.chunks.length,
      totalDocuments: docIds.length,
      documentIds: docIds,
    };
  }

  clear() {
    this.chunks = [];
  }
}

// shared across the whole app
export default new VectorStore();
