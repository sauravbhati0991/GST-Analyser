import { formatFileSize } from '../utils/gemini';

export default function Preview({ file, previewSrc, onRemove, onAnalyse, isAnalysing }) {
  return (
    <div className="mt-5 animate-fade-in-up">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex-wrap sm:flex-nowrap">
        {/* Thumbnail */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a24] flex-shrink-0 flex items-center justify-center">
          <img src={previewSrc} alt="Bill Preview" className="w-full h-full object-cover" />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{file.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatFileSize(file.size)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/[0.08] hover:border-red-500/40 transition-all text-sm font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Remove
          </button>
          <button
            onClick={onAnalyse}
            disabled={isAnalysing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-[0_2px_12px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 2v4" />
              <path d="M22 12h-4" />
            </svg>
            {isAnalysing ? 'Analysing...' : 'Analyse Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}
