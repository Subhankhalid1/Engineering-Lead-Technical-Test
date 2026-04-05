import express from "express";
const router = express.Router();
import { answerQuestion } from "../services/rag/queryService.js";
import { asyncHandler } from "../utils/errorHandler.js";

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { question, topK } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: '"question" field is required and must be a string.',
      });
    }

    const result = await answerQuestion(question.trim(), topK);

    res.json({
      success: true,
      data: result,
    });
  }),
);

export default router;
