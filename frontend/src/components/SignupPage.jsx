import { useState } from 'react';
import { apiSignup } from '../utils/api';

export default function SignupPage({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiSignup(name, email, password);
      onSignup(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: 'bg-danger' };
    if (password.length < 10) return { level: 2, label: 'Fair', color: 'bg-warning' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 4, label: 'Strong', color: 'bg-accent' };
    }
    return { level: 3, label: 'Good', color: 'bg-success' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-accent z-20" />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 right-0 w-[600px] h-[600px] rounded-full bg-accent/6 blur-[150px] opacity-60 animate-glow-float" />
        <div className="absolute bottom-0 -left-24 w-[550px] h-[550px] rounded-full bg-accent/5 blur-[130px] opacity-50 animate-glow-float" style={{ animationDelay: '-8s' }} />
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
            <h2 className="text-2xl font-black text-text-primary tracking-tight">Create your account</h2>
            <p className="text-text-secondary text-sm mt-1.5 font-medium">Start extracting GST data in seconds</p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="signup-name" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="signup-email" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                </div>
                <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@company.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signup-password" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters"
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/40 hover:text-accent transition-colors cursor-pointer">
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {/* Strength Indicator */}
              {password && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-border-light'}`} />
                    ))}
                  </div>
                  <span className={`text-[0.65rem] font-black uppercase tracking-widest ${strength.level >= 3 ? 'text-accent' : strength.level >= 2 ? 'text-warning' : 'text-danger'}`}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="signup-confirm" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <input id="signup-confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                {confirmPassword && password === confirmPassword && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 accent-[#00a878] w-4 h-4 cursor-pointer" />
              <label htmlFor="terms" className="text-xs font-semibold text-text-secondary leading-relaxed cursor-pointer">
                I agree to the <span className="text-accent font-bold">Terms of Service</span> and <span className="text-accent font-bold">Privacy Policy</span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-4 rounded-xl bg-accent text-white font-black text-sm uppercase tracking-widest shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin-loader" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-bg-secondary px-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Or</span></div>
          </div>

          {/* Switch to Login */}
          <p className="text-center text-sm font-semibold text-text-secondary">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-accent font-black hover:text-accent-deep transition-colors cursor-pointer uppercase tracking-wide">
              Sign In
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
