import express from "express";
import { ingestDocument, ingestText } from "../services/rag/ingestService.js";
import documentRegistry from "../models/documentRegistry.js";
import vectorStore from "../models/vectorStore.js";
import { asyncHandler } from "../utils/errorHandler.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (req.file) {
      const result = await ingestDocument(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname,
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    }

    const { text, name } = req.body;

    if (text) {
      const result = await ingestText(text.trim(), name || "text-input");

      return res.status(201).json({
        success: true,
        data: result,
      });
    }

    res.status(400).json({
      success: false,
      error: "Provide file or text",
    });
  }),
);

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      documents: documentRegistry.list(),
      vectorStoreStats: vectorStore.stats(),
    },
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  if (!documentRegistry.has(id)) {
    return res.status(404).json({ error: "Not found" });
  }

  vectorStore.removeDocument(id);
  documentRegistry.remove(id);

  res.json({ success: true });
});

export default router;
