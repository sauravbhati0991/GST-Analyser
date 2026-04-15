export default function Header({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-bg-secondary/80 backdrop-blur-xl border-b border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-text-primary uppercase flex items-center">
            MAKSAA <span className="text-accent ml-2 border-l-4 border-accent pl-2">ANALYSER</span>
          </h1>
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20 hidden sm:inline-block">
            AI Powered
          </span>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-4">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent font-black text-sm uppercase">
                {user.name ? user.name.charAt(0) : user.email.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-text-primary leading-tight">{user.name || 'User'}</p>
                <p className="text-[0.65rem] font-semibold text-text-secondary leading-tight">{user.email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-danger/20 text-danger hover:bg-danger/5 hover:border-danger/40 transition-all text-xs font-bold cursor-pointer"
              title="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
