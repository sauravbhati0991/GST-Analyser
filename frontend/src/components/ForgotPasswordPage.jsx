import { useState } from 'react';
import { apiForgotPassword, apiResetPassword } from '../utils/api';

export default function ForgotPasswordPage({ onResetSuccess, onBackToLogin }) {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiForgotPassword(email);
      setMessage(data.message);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiResetPassword(email, otp, newPassword);
      setStep('success');
      // Auto-login after 2 seconds
      setTimeout(() => onResetSuccess(data.user), 2000);
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
        </div>

        <div className="bg-bg-secondary rounded-3xl border border-accent/15 shadow-green p-8 sm:p-10">

          {/* ─── SUCCESS STATE ─── */}
          {step === 'success' && (
            <div className="text-center py-6 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00a878" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-2xl font-black text-text-primary mb-2">Password Reset!</h2>
              <p className="text-sm text-text-secondary font-medium">Your password has been updated. Logging you in...</p>
              <div className="mt-6">
                <div className="w-8 h-8 mx-auto rounded-full border-[3px] border-accent/20 border-t-accent animate-spin-loader" />
              </div>
            </div>
          )}

          {/* ─── EMAIL STEP ─── */}
          {step === 'email' && (
            <>
              <div className="mb-8">
                <button onClick={onBackToLogin} className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-deep transition-colors cursor-pointer mb-6 uppercase tracking-widest">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back to Login
                </button>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Forgot password?</h2>
                <p className="text-text-secondary text-sm mt-1.5 font-medium">Enter your email and we'll send you a reset code</p>
              </div>

              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>
                    </div>
                    <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@company.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-accent text-white font-black text-sm uppercase tracking-widest shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin-loader" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ─── OTP + NEW PASSWORD STEP ─── */}
          {step === 'otp' && (
            <>
              <div className="mb-8">
                <button onClick={() => { setStep('email'); setError(''); }} className="flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-deep transition-colors cursor-pointer mb-6 uppercase tracking-widest">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Change Email
                </button>
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Enter reset code</h2>
                <p className="text-text-secondary text-sm mt-1.5 font-medium">
                  Check your email <span className="text-accent font-bold">{email}</span> for a 6-digit code
                </p>
              </div>

              {message && !error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-semibold flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-6 px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold flex items-center gap-2 animate-fade-in-up">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP Input */}
                <div>
                  <label htmlFor="otp" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Reset Code</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16.5" r="1.5"/></svg>
                    </div>
                    <input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Enter 6-digit code" maxLength={6}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-black text-lg tracking-[0.5em] text-center placeholder:text-text-secondary/50 placeholder:tracking-normal placeholder:text-sm placeholder:font-semibold focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="new-password" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <input id="new-password" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters"
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/40 hover:text-accent transition-colors cursor-pointer">
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirm-new-password" className="block text-xs font-black uppercase tracking-widest text-accent/60 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <input id="confirm-new-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-accent/[0.03] border-2 border-accent/15 text-text-primary font-semibold text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white transition-all duration-200" />
                    {confirmPassword && newPassword === confirmPassword && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-accent text-white font-black text-sm uppercase tracking-widest shadow-lg hover:bg-accent-hover hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-[3px] border-white/30 border-t-white animate-spin-loader" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="mt-6 text-center">
                <button onClick={handleSendOTP} className="text-xs font-bold text-accent hover:text-accent-deep transition-colors cursor-pointer">
                  Didn't receive a code? Resend
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-text-secondary/60 mt-6 font-medium">
          © 2026 MAKSAA Technologies · All rights reserved
        </p>
      </div>
    </div>
  );
}
