import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { classifyWithAI } from "../utils/aiClassifier.js";
import { getFallbackResult } from "../utils/classifyComplaint.js";

const router = express.Router();

/**
 * POST /api/ai/classify
 * Test classification without creating a complaint.
 * Protected — requires auth.
 */
router.post("/classify", protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // Try AI first
    const aiResult = await classifyWithAI(title, description);

    if (aiResult) {
      return res.json({
        method: "AI",
        ...aiResult,
      });
    }

    // Fallback
    const fallback = getFallbackResult(title, description);
    return res.json({
      method: "Fallback",
      ...fallback,
    });
  } catch (error) {
    console.error("Classification test error:", error);
    res.status(500).json({ message: "Classification failed" });
  }
});

export default router;
