import { useState } from "react";
import { compressImage } from "../utils/compress";
import { toBase64 } from "../utils/base64";
import { apiAnalyzeBill } from "../utils/api";

export default function Preview({ file, previewSrc, onRemove, onResult }) {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyse = async () => {
    try {
      setIsAnalysing(true);
      setError("");

      // ✅ Step 1: Compress image (reduces tokens)
      const compressed = await compressImage(file);

      // ✅ Step 2: Convert to base64 (without prefix)
      const base64 = await toBase64(compressed);

      // 🚨 Safety check (prevent huge requests)
      if (base64.length > 500000) {
        throw new Error("File too large. Please upload a smaller image.");
      }

      // ✅ Step 3: Call API
      const result = await apiAnalyzeBill(base64, compressed.type);

      // ✅ Step 4: Send result to parent
      if (onResult) onResult(result);

    } catch (err) {
      console.error("Analyse Error:", err);

      if (err.message?.includes("quota") || err.message?.includes("429")) {
        setError("⚠️ API limit reached. Please try again in a minute.");
      } else {
        setError(err.message || "Analysis failed");
      }

    } finally {
      setIsAnalysing(false);
    }
  };

  return (
    <div className="mt-8 animate-fade-in-up">
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-bg-secondary border border-border-light shadow-soft flex-wrap sm:flex-nowrap">

        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-bg-primary border border-border-light flex-shrink-0 flex items-center justify-center">
          <img
            src={previewSrc}
            alt="Bill Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-text-primary truncate">
            {file.name}
          </p>
          <p className="text-sm text-text-secondary mt-1 tracking-wide">
            {(file.size / 1024).toFixed(1)} KB
          </p>

          {/* ❌ Error message */}
          {error && (
            <p className="text-danger text-xs mt-2 font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-shrink-0">
          {/* Remove */}
          <button
            onClick={onRemove}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-danger/20 text-danger hover:bg-danger/5 hover:border-danger/40 transition-all text-sm font-bold"
          >
            ✕ Remove
          </button>

          {/* Analyse */}
          <button
            onClick={handleAnalyse}
            disabled={isAnalysing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-white font-bold text-sm shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {isAnalysing ? (
              <>
                <span className="animate-spin">⏳</span>
                Analysing...
              </>
            ) : (
              <>
                Analyse Bill
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}