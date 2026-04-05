const config = {
  // Chunking
  chunkSize: Number(process.env.CHUNK_SIZE) || 500,
  chunkOverlap: Number(process.env.CHUNK_OVERLAP) || 50,

  topK: Number(process.env.TOP_K) || 3,

  llmProvider: process.env.LLM_PROVIDER ?? "mock",

  supportedMimeTypes: [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ],

  maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB) || 10,
};

export default config;
