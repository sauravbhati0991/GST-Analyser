import { useState } from 'react';
import { apiLogin, isRemembered } from '../utils/api';

export default function LoginPage({ onLogin, onSwitchToSignup, onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(isRemembered());
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiLogin(email, password, rememberMe);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden px-4">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-accent z-20" />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-accent/6 blur-[150px] opacity-70 animate-glow-float" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[120px] opacity-50 animate-glow-float" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase flex items-center justify-center gap-2">
            MAKSAA <span className="text-accent border-l-4 border-accent pl-2">ANALYSER</span>
          </h1>
          <p className="text-text-secondary text-sm mt-3 font-medium">AI-Powered GST Bill Analysis Platform</p>
        </div>

        <div className="bg-bg-secondary rounded-3xl border border-accent/15 shadow-green p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-text-primary tracking-tight">Welcome back</h2>
            <p className="text-text-secondary text-sm mt-1.5 font-medium">Sign in to continue analysing your invoices</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@company.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/40 hover:text-accent transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#00a878] w-4 h-4 cursor-pointer rounded"
                />
                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-bold text-accent hover:text-accent-deep transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-accent text-white font-black text-sm uppercase tracking-widest shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin-loader" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-bg-secondary px-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Or</span></div>
          </div>

          {/* Switch to Signup */}
          <p className="text-center text-sm font-semibold text-text-secondary">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-accent font-black hover:text-accent-deep transition-colors cursor-pointer uppercase tracking-wide"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-secondary/60 mt-6 font-medium">
          © 2026 MAKSAA Technologies · All rights reserved
        </p>
      </div>
    </div>
  );
}
