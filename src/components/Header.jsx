export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9">
            <svg viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="6" stroke="url(#lg)" strokeWidth="2.5" />
              <path d="M10 16h12M16 10v12" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              GST Analyser
            </h1>
            <span className="text-[0.6rem] font-semibold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              AI Powered
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
