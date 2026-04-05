import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import documentRoutes from "./api/documents.js";
import queryRoutes from "./api/query.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ingest", documentRoutes);
app.use("/ask", queryRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    llmProvider: process.env.LLM_PROVIDER || "mock",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`\n🚀 RAG System running on http://localhost:${PORT}`);
  console.log(`🤖 LLM Provider: ${process.env.LLM_PROVIDER || "mock"}`);
  console.log(`📚 Ready to ingest documents and answer questions\n`);
});

export default app;
