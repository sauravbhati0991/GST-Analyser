import express from "express";
import auth from "../middleware/auth.js";
import Invoice from "../models/Invoice.js";
import { extractTextFromImage } from "../utils/ocr.js";
import { analyseWithGroq } from "../utils/groq.js";
import { runGSTValidation } from "../utils/gstValidation.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { fileBase64, mimeType } = req.body;

    if (!fileBase64) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // 🚨 Limit size
    if (fileBase64.length > 500000) {
      return res.status(400).json({
        success: false,
        message: "File too large",
      });
    }

    // 🔥 STEP 1: OCR
    const extractedText = await extractTextFromImage(fileBase64);

    if (!extractedText || extractedText.length < 20) {
      throw new Error("Could not read text from image");
    }

    // 🔥 STEP 2: Groq AI
    const aiResult = await analyseWithGroq(extractedText);

    // 🔥 STEP 3: Validation
    const validated = runGSTValidation(aiResult);

    // 🔥 STEP 4: Save DB
    const invoice = new Invoice({
      userId: req.user._id,
      ...validated,
    });

    await invoice.save();

    res.json({
      success: true,
      data: invoice,
    });

  } catch (err) {
    console.error("Analysis Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Analysis failed",
    });
  }
});

export default router;